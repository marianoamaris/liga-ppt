import type { Evento } from "../components/anotador/types";
import type {
  Edicion,
  EdicionEquipo,
  EdicionFinal,
  EquipoConPlantilla,
  FilaPalmares,
  HistoricoEdicion,
  Jugador,
  EquipoBorrador,
  JugadorTitulos,
  FilaRecord,
  Sede,
  TipoPalmares,
  TipoRecord,
  Posicion,
} from "../types/jugador";
import { supabase } from "./supabase";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const TOKEN_KEY = "ligappt_token";
const REFRESH_TOKEN_KEY = "ligappt_refresh_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function storeToken(t: string): void {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}
export function storeRefreshToken(t: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, t);
}
export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/** Intenta renovar el JWT via Supabase. Devuelve el nuevo token o null. */
async function tryRefreshToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.refreshSession();
  if (error || !data.session) return null;
  storeToken(data.session.access_token);
  if (data.session.refresh_token) storeRefreshToken(data.session.refresh_token);
  return data.session.access_token;
}

function buildHeaders(token: string | null, extra?: HeadersInit): HeadersInit {
  const refreshToken = getRefreshToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(refreshToken ? { "X-Refresh-Token": refreshToken } : {}),
    ...(extra ?? {}),
  };
}

/** Si el backend renovó la sesión sola, guarda los nuevos tokens sin avisar al usuario. */
function syncRenewedTokens(headers: Headers): void {
  const newAccess = headers.get("X-New-Access-Token");
  const newRefresh = headers.get("X-New-Refresh-Token");
  if (newAccess) storeToken(newAccess);
  if (newRefresh) storeRefreshToken(newRefresh);
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: buildHeaders(token, init.headers),
  });
  syncRenewedTokens(res.headers);

  // Token expirado → refrescar y reintentar una sola vez
  if (res.status === 401) {
    const newToken = await tryRefreshToken();
    if (!newToken) {
      clearToken();
      clearRefreshToken();
      throw new Error("Sesión expirada. Inicia sesión nuevamente.");
    }
    const retry = await fetch(`${BASE}${path}`, {
      ...init,
      headers: buildHeaders(newToken, init.headers),
    });
    syncRenewedTokens(retry.headers);
    if (!retry.ok) {
      const body = await retry.json().catch(() => ({}));
      throw new Error(body.error ?? body.message ?? `HTTP ${retry.status}`);
    }
    return retry.json() as T;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? body.message ?? `HTTP ${res.status}`);
  }
  return res.json() as T;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  nombre: string;
  username: string;
  es_admin: boolean;
}

export interface Partido {
  id: string;
  temporada: number;
  modo: string;
  jornada?: number | null;
  equipos: ApiEquipo[];
  eventos: Evento[];
  iniciado_en: string;
  finalizado_en?: string | null;
  anotador_id?: string | null;
  anotador_nombre?: string | null;
}

export interface ApiEquipo {
  equipo: { id: string; nombre: string };
  jugadores: { nombre: string }[];
  arqueroDesignado?: string;
}

export interface VsRival {
  victorias: number;
  empates: number;
  derrotas: number;
}

export interface JornadaStat {
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
}

export interface Standing {
  equipoId: string;
  nombre: string;
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
  porJornada?: Record<string, JornadaStat>;
  vsRivales?: Record<string, VsRival>;
}

export interface GoalDetail {
  tiempo: number;
  tiempoFormato: string;
  vs: string;
  jornada: number;
  partidoId: string;
}

export interface Goleador {
  jugador: string;
  equipo: string;
  equipoId: string;
  goles: number;
  golesVs?: Record<string, number>;
  detalle?: GoalDetail[];
}

export interface Arquero {
  arquero: string;
  equipo: string;
  equipoId: string;
  golesRecibidos: number;
  autogoles?: number;
  golesDe?: Record<string, number>;
}

// ── Liga config ───────────────────────────────────────────────────────────────

export interface TeamConfig {
  nombre: string;
  color: string;
  jugadores: string[];
  arquero?: string;
  capitan?: string;
}

/**
 * Guarda los equipos y plantillas de una edición.
 *
 * Escribe en `edicion_equipos` / `edicion_plantillas`, que es de donde leen el
 * anotador, la clasificación y el carrusel. La antigua `ligaConfigApi` apuntaba
 * a `liga_equipos`, una tabla que no consultaba ninguna pantalla.
 */
export const ligasApi = {
  /**
   * Crea la siguiente liga de una ciudad. El número no se manda: lo deduce el
   * backend del historial de esa sede, y reutiliza una edición sin equipos si
   * la hubiera en vez de saltarse el número.
   */
  crear: (body: {
    sede_id: string;
    jugadores_por_equipo: number;
    equipos: EquipoBorrador[];
  }) =>
    req<{
      ok: boolean;
      numero: number;
      numero_sede: number;
      sede_id: string;
      creada: boolean;
      estado: string;
      equipos: number;
      jugadores: number;
      creados: string[];
    }>("/ediciones", { method: "POST", body: JSON.stringify(body) }),
};

export const plantillasApi = {
  guardar: (edicion: number, equipos: EquipoBorrador[]) =>
    req<{
      ok: boolean;
      edicion: number;
      sede_id: string;
      equipos: number;
      jugadores: number;
      /** Nombres que no existían en el padrón y se acaban de dar de alta. */
      creados: string[];
    }>(`/ediciones/${edicion}/plantillas`, {
      method: "PUT",
      body: JSON.stringify({ equipos }),
    }),
};

export const ligaConfigApi = {
  get: (temporada: number) =>
    req<{ temporada: number; equipos: TeamConfig[] }>(
      `/ligas/equipos?temporada=${temporada}`
    ),
  save: (temporada: number, equipos: TeamConfig[]) =>
    req<{ ok: boolean }>("/ligas/equipos", {
      method: "POST",
      body: JSON.stringify({ temporada, equipos }),
    }),
};

// ── Catálogo: jugadores y ediciones ───────────────────────────────────────────
// Reemplazan a USUARIOS_LIGA.ts, TEAM_COLORS, LIGA_*_EQUIPOS y PLANTILLAS_LIGA*.

export const jugadoresApi = {
  list: (params: { q?: string; posicion?: Posicion; activo?: "true" | "false" | "todos"; inciertos?: boolean; sede?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.posicion) qs.set("posicion", params.posicion);
    if (params.activo) qs.set("activo", params.activo);
    if (params.inciertos) qs.set("inciertos", "true");
    // Sin sede devuelve el padrón completo, que es lo que necesita Crear Liga
    // para poder reutilizar a alguien que juega en la otra ciudad.
    if (params.sede) qs.set("sede", params.sede);
    const query = qs.toString();
    return req<{ total: number; jugadores: Jugador[] }>(
      `/jugadores${query ? `?${query}` : ""}`
    );
  },
  /** Acepta el slug canónico o cualquier grafía alternativa registrada. */
  get: (slug: string) =>
    req<{ jugador: Jugador; resueltoPorAlias?: string }>(`/jugadores/${slug}`),
};

/**
 * Los récords van separados por ciudad: la Bota de Oro de Valledupar no compite
 * contra la de Bogotá. Todas las vistas pasan la sede activa.
 */
export const palmaresApi = {
  /** Sin tipo devuelve todo agrupado, que es lo que pinta Historia. */
  todo: (sede?: string) =>
    req<{ palmares: Record<TipoPalmares, FilaPalmares[]> }>(
      `/palmares${sede ? `?sede=${sede}` : ""}`
    ),
  porTipo: (tipo: TipoPalmares, sede?: string) =>
    req<{ tipo: TipoPalmares; palmares: FilaPalmares[] }>(
      `/palmares?tipo=${tipo}${sede ? `&sede=${sede}` : ""}`
    ),
  titulos: (sede?: string) =>
    req<{ total: number; titulos: JugadorTitulos[] }>(
      `/palmares/titulos${sede ? `?sede=${sede}` : ""}`
    ),
};

export const recordsApi = {
  /** Podios de récords de una ciudad, agrupados por tipo. */
  todo: (sede?: string) =>
    req<{ total: number; records: Record<TipoRecord, FilaRecord[]> }>(
      `/records${sede ? `?sede=${sede}` : ""}`
    ),
};

export const sedesApi = {
  /** Ciudades activas, cada una con su edición en curso ya resuelta. */
  list: () => req<{ total: number; sedes: Sede[] }>("/sedes"),
};

export const edicionesApi = {
  /** Sin `sede` devuelve las de todas las ciudades. */
  list: (sede?: string) =>
    req<{ total: number; ediciones: Edicion[] }>(
      `/ediciones${sede ? `?sede=${sede}` : ""}`
    ),
  finales: (sede?: string) =>
    req<{ total: number; finales: EdicionFinal[] }>(
      `/ediciones/finales${sede ? `?sede=${sede}` : ""}`
    ),
  get: (numero: number) =>
    req<{ edicion: Edicion; equipos: EdicionEquipo[]; final: EdicionFinal | null }>(
      `/ediciones/${numero}`
    ),
  equipos: (numero: number) =>
    req<{
      edicion: number;
      sede_id: string | null;
      numero_sede: number | null;
      equipos: EdicionEquipo[];
    }>(`/ediciones/${numero}/equipos`),
  /** Edición completa: tabla, jornadas, goleadores, arqueros y final. */
  historico: (numero: number) => req<HistoricoEdicion>(`/historico/${numero}`),
  plantillas: (numero: number) =>
    req<{
      edicion: number;
      sede_id: string | null;
      numero_sede: number | null;
      equipos: EquipoConPlantilla[];
    }>(`/ediciones/${numero}/plantillas`),
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    req<{
      session: { access_token: string; refresh_token: string };
      profile: Profile;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => req<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  me: () => req<{ profile: Profile }>("/auth/me"),
};

// ── Partidos ──────────────────────────────────────────────────────────────────

export const partidosApi = {
  create: (body: {
    temporada: number;
    modo: string;
    jornada?: number;
    equipos: ApiEquipo[];
  }) =>
    req<Partido>("/partidos", { method: "POST", body: JSON.stringify(body) }),

  update: (id: string, eventos: Evento[]) =>
    req<Partido>(`/partidos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ eventos }),
    }),

  finalizar: (id: string) =>
    req<Partido>(`/partidos/${id}/finalizar`, { method: "PATCH" }),

  /**
   * `temporada` acota a una edición, y con ella a una ciudad. Sin el filtro la
   * API devuelve todo partido abierto de la tabla: un partido en curso en
   * Valledupar aparecería en la pantalla de Bogotá, con equipos que ni
   * siquiera resuelven contra su catálogo.
   */
  getEnVivo: (temporada: number, jornada?: number) => {
    const qs = new URLSearchParams({ temporada: String(temporada) });
    if (jornada != null) qs.set("jornada", String(jornada));
    return req<{ enVivo: Partido[]; total: number }>(`/en-vivo?${qs}`);
  },

  list: (params: Record<string, string | number>) => {
    const qs = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();
    return req<{ partidos: Partido[] }>(`/partidos?${qs}`);
  },

  get: (id: string) => req<Partido>(`/partidos/${id}`),
};

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface DetalleTarjeta {
  razon: string;
  jornada?: number;
  partidoId: string;
}

export interface JugadorDisciplina {
  jugador: string;
  equipo: string;
  equipoId: string;
  amarillas: number;
  rojas: number;
  detalle: DetalleTarjeta[];
}

/**
 * `temporada` es la clave interna de la edición (`ediciones.numero`), no el
 * número que se muestra. Sale de `useSede().edicionActual` o del selector de
 * ediciones; no tiene valor por defecto a propósito, porque desde que hay más
 * de una sede no existe «la edición actual» sin decir de qué ciudad.
 */
export const statsApi = {
  clasificacion: (temporada: number) =>
    req<{ temporada: number; standings: Standing[] }>(
      `/clasificacion?temporada=${temporada}`
    ),
  goleadores: (temporada: number) =>
    req<{ temporada: number; goleadores: Goleador[] }>(
      `/goleadores?temporada=${temporada}`
    ),
  arqueros: (temporada: number) =>
    req<{ temporada: number; arqueros: Arquero[] }>(
      `/arqueros?temporada=${temporada}`
    ),
  disciplina: (temporada: number) =>
    req<{ disciplina: JugadorDisciplina[] }>(
      `/disciplina?temporada=${temporada}`
    ),
};
