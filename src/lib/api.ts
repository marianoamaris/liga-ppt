import type { Evento } from "../components/anotador/types";
import { supabase } from "./supabase";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const TOKEN_KEY = "ligappt_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function storeToken(t: string): void {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/** Intenta renovar el JWT via Supabase. Devuelve el nuevo token o null. */
async function tryRefreshToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.refreshSession();
  if (error || !data.session) return null;
  storeToken(data.session.access_token);
  return data.session.access_token;
}

function buildHeaders(token: string | null, extra?: HeadersInit): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra ?? {}),
  };
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: buildHeaders(token, init.headers),
  });

  // Token expirado → refrescar y reintentar una sola vez
  if (res.status === 401) {
    const newToken = await tryRefreshToken();
    if (!newToken) {
      clearToken();
      throw new Error("Sesión expirada. Inicia sesión nuevamente.");
    }
    const retry = await fetch(`${BASE}${path}`, {
      ...init,
      headers: buildHeaders(newToken, init.headers),
    });
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

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    req<{ session: { access_token: string }; profile: Profile }>("/auth/login", {
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

  getEnVivo: (jornada?: number) =>
    req<{ enVivo: Partido[]; total: number }>(
      `/en-vivo${jornada != null ? `?jornada=${jornada}` : ""}`
    ),

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

export const statsApi = {
  clasificacion: (temporada = 19) =>
    req<{ temporada: number; standings: Standing[] }>(
      `/clasificacion?temporada=${temporada}`
    ),
  goleadores: (temporada = 19) =>
    req<{ temporada: number; goleadores: Goleador[] }>(
      `/goleadores?temporada=${temporada}`
    ),
  arqueros: (temporada = 19) =>
    req<{ temporada: number; arqueros: Arquero[] }>(
      `/arqueros?temporada=${temporada}`
    ),
  disciplina: (temporada = 19) =>
    req<{ disciplina: JugadorDisciplina[] }>(
      `/disciplina?temporada=${temporada}`
    ),
};
