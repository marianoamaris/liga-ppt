import { useState, useRef, useEffect, useMemo, type FormEvent } from "react";
import { useEdiciones, useJugadores } from "../hooks/useCatalogo";
import { ligasApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useSede } from "../context/SedeContext";
import type { EntradaPlantilla, EquipoBorrador, Jugador } from "../types/jugador";

/**
 * Los nueve petos con los que se juega. `slug` es lo que guarda la base como
 * identidad del equipo dentro de la edición; el hex es solo para pintarlo aquí
 * —el definitivo lo pone el backend, para que el mismo color se vea igual en
 * todas las ediciones.
 */
const COLORES = [
  { slug: "verde",    hex: "#22C55E", label: "Verde" },
  { slug: "rojo",     hex: "#D00027", label: "Rojo" },
  { slug: "azul",     hex: "#2563EB", label: "Azul" },
  { slug: "naranja",  hex: "#F97316", label: "Naranja" },
  { slug: "morado",   hex: "#9333EA", label: "Morado" },
  { slug: "rosado",   hex: "#FF69B4", label: "Rosado" },
  { slug: "amarillo", hex: "#FDB913", label: "Amarillo" },
  { slug: "negro",    hex: "#222222", label: "Negro" },
  { slug: "blanco",   hex: "#FFFFFF", label: "Blanco" },
];

const SLUG_TO_HEX: Record<string, string> = Object.fromEntries(
  COLORES.map((s) => [s.slug, s.hex])
);

/** Una jornada necesita tres equipos para poder repartirse. */
const MIN_EQUIPOS = 3;
const MAX_EQUIPOS = COLORES.length;

/**
 * Cupo de plantilla. Deja de ser una constante en cuanto hay más de una ciudad:
 * Valledupar juega con 8 y Bogotá con 10, así que se elige al crear la liga y
 * se guarda en la edición.
 */
const CUPO_MIN = 5;
const CUPO_MAX = 15;
const CUPO_POR_DEFECTO = 8;

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

const hexDe = (slug: string) => SLUG_TO_HEX[slug] ?? "#4B5563";
const labelDe = (slug: string) =>
  COLORES.find((c) => c.slug === slug)?.label ?? slug;

/**
 * El borrador lleva una identidad propia además de los campos que viaja al
 * backend. Sin ella habría que indexar las tarjetas por su posición, y al
 * eliminar una del medio React reasignaría a las siguientes el estado interno
 * de la borrada: el texto a medio escribir en el buscador saltaría de tarjeta.
 */
type Borrador = EquipoBorrador & { _id: string };

const nuevoId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `e-${Math.random().toString(36).slice(2)}`;

function equipoVacio(colorSlug: string): Borrador {
  return { _id: nuevoId(), nombre: "", color_slug: colorSlug, jugadores: [] };
}

/** Punto de partida de una edición sin equipos: el mínimo jugable, en blanco. */
function borradorVacio(): Borrador[] {
  return COLORES.slice(0, MIN_EQUIPOS).map((c) => equipoVacio(c.slug));
}

// ── Buscador de jugadores ───────────────────────────────────────────────────

/**
 * Busca en el padrón, que es único para toda la liga: alguien que juega en
 * Valledupar aparece igual al armar un equipo de Bogotá, y seleccionarlo
 * reutiliza su ficha en vez de duplicarla. Solo cuando nadie coincide se ofrece
 * darlo de alta.
 */
function BuscadorJugador({
  onAdd,
  asignados,
  placeholder = "Buscar o crear jugador…",
}: {
  onAdd: (entrada: { nombre: string; jugador_id: string | null }) => void;
  asignados: string[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { jugadores } = useJugadores();

  const disponibles = useMemo(
    () =>
      [...jugadores]
        .filter((j) => !asignados.includes(j.nombre))
        .sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [jugadores, asignados]
  );

  const q = query.trim().toLowerCase();
  const filtrados = useMemo(
    () =>
      (q
        ? disponibles.filter(
            (j) =>
              j.nombre.toLowerCase().includes(q) ||
              (j.apodo?.toLowerCase().includes(q) ?? false)
          )
        : disponibles
      ).slice(0, 30),
    [disponibles, q]
  );

  // Solo se ofrece crear cuando no hay una coincidencia exacta: es la salvaguarda
  // contra dar de alta a alguien dos veces por una tilde.
  const hayExacto = useMemo(
    () => jugadores.some((j) => j.nombre.toLowerCase() === q),
    [jugadores, q]
  );

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function elegir(j: Jugador) {
    onAdd({ nombre: j.nombre, jugador_id: j.id });
    setQuery("");
    setOpen(false);
  }

  function crear() {
    if (!query.trim()) return;
    onAdd({ nombre: query.trim(), jugador_id: null });
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <input
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          if (filtrados.length) elegir(filtrados[0]);
          else crear();
        }}
      />

      {open && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl">
          {filtrados.map((j) => (
            <li
              key={j.id}
              className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
              onMouseDown={() => elegir(j)}
            >
              <span className="truncate">
                {j.nombre}
                {j.apodo && <span className="ml-1 text-white/30">«{j.apodo}»</span>}
              </span>
              {/* En qué ciudades ya juega: avisa de que reutilizas a alguien. */}
              {!!j.sedes?.length && (
                <span className="shrink-0 text-[10px] uppercase tracking-wider text-white/30">
                  {j.sedes.join(" · ")}
                </span>
              )}
            </li>
          ))}

          {!filtrados.length && !query.trim() && (
            <li className="px-3 py-2 text-sm text-white/30">
              Todos los jugadores ya están asignados
            </li>
          )}

          {query.trim() && !hayExacto && (
            <li
              className="cursor-pointer border-t border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/10"
              onMouseDown={crear}
            >
              + Crear «{query.trim()}»
              <span className="ml-1 text-white/30">— no está en el padrón</span>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

// ── Tarjeta de equipo ───────────────────────────────────────────────────────

function TarjetaEquipo({
  equipo,
  todos,
  coloresLibres,
  cupo,
  onChange,
  onEliminar,
}: {
  equipo: Borrador;
  todos: Borrador[];
  coloresLibres: string[];
  cupo: number;
  onChange: (e: Borrador) => void;
  /** null cuando quitarlo dejaría la liga por debajo del mínimo jugable. */
  onEliminar: (() => void) | null;
}) {
  // Confirmación en la propia tarjeta y no un diálogo del navegador: borrar un
  // equipo con plantilla se lleva por delante trabajo de varios minutos.
  const [confirmando, setConfirmando] = useState(false);
  const hex = hexDe(equipo.color_slug);
  const light = isLight(hex);
  const headerText = light ? "#111111" : "#FFFFFF";

  const asignados = todos.flatMap((e) => e.jugadores.map((j) => j.nombre));
  const total = equipo.jugadores.length;
  const lleno = total >= cupo;

  const arquero = equipo.jugadores.find((j) => j.es_arquero) ?? null;
  const deCampo = equipo.jugadores.filter((j) => !j.es_arquero);

  function agregar(entrada: { nombre: string; jugador_id: string | null }, comoArquero: boolean) {
    if (equipo.jugadores.some((j) => j.nombre === entrada.nombre)) return;
    const nuevo: EntradaPlantilla = {
      ...entrada,
      es_arquero: comoArquero,
      es_capitan: false,
    };
    onChange({ ...equipo, jugadores: [...equipo.jugadores, nuevo] });
  }

  function quitar(nombre: string) {
    onChange({ ...equipo, jugadores: equipo.jugadores.filter((j) => j.nombre !== nombre) });
  }

  function setCapitan(nombre: string) {
    onChange({
      ...equipo,
      jugadores: equipo.jugadores.map((j) => ({ ...j, es_capitan: j.nombre === nombre })),
    });
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-lg">
      {/* Cabecera de color */}
      <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: hex }}>
        <select
          value={equipo.color_slug}
          onChange={(e) => onChange({ ...equipo, color_slug: e.target.value })}
          aria-label="Color del peto"
          className="cursor-pointer rounded border-0 bg-black/15 px-1.5 py-1 text-[11px] font-bold outline-none"
          style={{ color: headerText }}
        >
          {[equipo.color_slug, ...coloresLibres].map((c) => (
            <option key={c} value={c} className="bg-[#1a1a1a] text-white">
              {labelDe(c)}
            </option>
          ))}
        </select>

        <input
          className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder-current/50"
          style={{ color: headerText }}
          placeholder="Nombre del equipo…"
          value={equipo.nombre}
          onChange={(e) => onChange({ ...equipo, nombre: e.target.value })}
        />

        <span
          className="text-[12px] font-bold tabular-nums"
          style={{ color: light ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)" }}
        >
          {total}/{cupo}
        </span>

        {onEliminar && (
          <button
            onClick={() => (confirmando ? onEliminar() : setConfirmando(true))}
            onBlur={() => setConfirmando(false)}
            title={confirmando ? "Confirmar borrado" : "Eliminar equipo"}
            className="shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold transition-colors"
            style={{
              color: confirmando ? "#FFFFFF" : light ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.6)",
              backgroundColor: confirmando ? "#D00027" : "transparent",
            }}
          >
            {confirmando ? "¿Eliminar?" : "×"}
          </button>
        )}
      </div>

      <div className="flex flex-col divide-y divide-white/5">
        {/* Arquero */}
        <div className="space-y-2 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Arquero</p>
          {arquero ? (
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="flex items-center gap-2 text-sm font-medium text-white/90">
                <span>🧤</span>
                {arquero.nombre}
                {!arquero.jugador_id && (
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400/70">nuevo</span>
                )}
              </span>
              <button
                className="text-lg leading-none text-white/30 transition-colors hover:text-red-400"
                onClick={() => quitar(arquero.nombre)}
              >
                ×
              </button>
            </div>
          ) : lleno ? (
            <p className="text-xs italic text-white/20">Límite alcanzado</p>
          ) : (
            <BuscadorJugador
              onAdd={(e) => agregar(e, true)}
              asignados={asignados}
              placeholder="Asignar arquero…"
            />
          )}
        </div>

        {/* Jugadores de campo */}
        <div className="space-y-3 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Jugadores de campo
          </p>
          <div className="flex min-h-[28px] flex-wrap gap-2">
            {deCampo.map((j) => (
              <span
                key={j.nombre}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                  j.es_capitan
                    ? "border border-yellow-400/30 bg-yellow-400/20 text-yellow-300"
                    : "border border-white/10 bg-white/8 text-white/75"
                }`}
              >
                {j.es_capitan && <span className="text-[10px]">©</span>}
                {j.nombre}
                {!j.jugador_id && (
                  <span className="text-[9px] uppercase text-emerald-400/70">nuevo</span>
                )}
                <button
                  className="ml-1 leading-none text-white/30 transition-colors hover:text-red-400"
                  onClick={() => quitar(j.nombre)}
                >
                  ×
                </button>
              </span>
            ))}
            {!deCampo.length && <span className="text-xs italic text-white/20">Sin jugadores</span>}
          </div>

          {lleno ? (
            <p className="text-xs italic text-white/20">
              Límite de {cupo} jugadores alcanzado
            </p>
          ) : (
            <BuscadorJugador
              onAdd={(e) => agregar(e, false)}
              asignados={asignados}
              placeholder="Agregar jugador…"
            />
          )}
        </div>

        {/* Capitán */}
        <div className="space-y-2 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Capitán</p>
          {!equipo.jugadores.length ? (
            <p className="text-xs italic text-white/20">Agrega jugadores primero</p>
          ) : (
            <select
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              value={equipo.jugadores.find((j) => j.es_capitan)?.nombre ?? ""}
              onChange={(e) => setCapitan(e.target.value)}
            >
              <option value="" className="bg-[#1a1a1a] text-white/40">— Sin capitán —</option>
              {equipo.jugadores.map((j) => (
                <option key={j.nombre} value={j.nombre} className="bg-[#1a1a1a] text-white">
                  {j.es_arquero ? `🧤 ${j.nombre}` : j.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Login ───────────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-xs space-y-6">
        <div className="text-center">
          <img src="/ligaPPT-escudo.png" alt="Liga PPT" className="mx-auto mb-3 h-14 w-14 object-contain" />
          <h1 className="text-xl font-black text-white">Crear Liga</h1>
          <p className="mt-0.5 text-sm text-gray-500">Liga PPT · Zona Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Correo</label>
            <input
              type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Contraseña</label>
            <input
              type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-xl bg-white py-3.5 text-sm font-bold text-black disabled:opacity-50"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Página ──────────────────────────────────────────────────────────────────

export function CrearLigaPage() {
  const { profile, loading: authLoading, logout } = useAuth();
  const [authed, setAuthed] = useState(false);

  const { sedes, sedeId } = useSede();
  const { jugadores } = useJugadores();
  const porId = useMemo(() => new Map(jugadores.map((j) => [j.id, j])), [jugadores]);
  // La sede se elige aquí y no se toma de la navegación: administrar la liga de
  // otra ciudad no debería cambiar lo que ves en el resto de la app.
  const [sedeElegida, setSedeElegida] = useState(sedeId);
  const { ediciones, loading: cargandoEdiciones } = useEdiciones(sedeElegida);
  const [cupo, setCupo] = useState(CUPO_POR_DEFECTO);

  // Tres equipos visibles desde el primer render: es el mínimo jugable, así que
  // no hay ningún estado válido con menos.
  const [equipos, setEquipos] = useState<Borrador[]>(borradorVacio);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!authLoading && profile) setAuthed(true);
  }, [authLoading, profile]);

  useEffect(() => setSedeElegida(sedeId), [sedeId]);

  // Cambiar de ciudad reinicia el borrador: los equipos de una no sirven en otra.
  useEffect(() => {
    setEquipos(borradorVacio());
    setStatus("idle");
    setMsg("");
  }, [sedeElegida]);

  /**
   * Qué edición va a crearse.
   *
   * Esta pantalla solo abre ligas nuevas, así que el número no se elige: es el
   * siguiente de la ciudad. La excepción son las ediciones sin equipos, que son
   * un número reservado y no una liga: se reutilizan, porque si no la edición 1
   * de Bogotá quedaría huérfana y la ciudad arrancaría en la 2. El backend
   * aplica esta misma regla al guardar; aquí solo se anticipa para poder
   * anunciarla.
   */
  const proxima = useMemo(() => {
    if (cargandoEdiciones || ediciones[0]?.sede_id !== sedeElegida) return null;
    const reservada = [...ediciones]
      .filter((e) => (e.total_equipos ?? 0) === 0)
      .sort((a, b) => a.numero_sede - b.numero_sede)[0];
    if (reservada) return { numero_sede: reservada.numero_sede, reutiliza: true };

    const max = Math.max(0, ...ediciones.map((e) => e.numero_sede));
    return { numero_sede: max + 1, reutiliza: false };
  }, [ediciones, cargandoEdiciones, sedeElegida]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-sm text-white/30">
        Cargando…
      </div>
    );
  }

  if (!authed) return <LoginForm onSuccess={() => setAuthed(true)} />;

  const usados = equipos.map((e) => e.color_slug);
  const coloresLibres = COLORES.map((c) => c.slug).filter((c) => !usados.includes(c));

  function eliminarEquipo(indice: number) {
    setEquipos((prev) => prev.filter((_, i) => i !== indice));
  }

  function cambiarCantidad(n: number) {
    setEquipos((prev) => {
      if (n === prev.length) return prev;
      if (n < prev.length) return prev.slice(0, n);

      const libres = COLORES.map((c) => c.slug).filter(
        (c) => !prev.some((e) => e.color_slug === c)
      );
      const extra = Array.from({ length: n - prev.length }, (_, i) =>
        equipoVacio(libres[i] ?? COLORES[0].slug)
      );
      return [...prev, ...extra];
    });
  }

  async function crear() {
    const sinNombre = equipos.filter((e) => !e.nombre.trim());
    if (sinNombre.length) {
      setStatus("error");
      setMsg(`Faltan nombres en ${sinNombre.length} equipo(s).`);
      return;
    }

    setStatus("loading");
    setMsg("");
    try {
      const r = await ligasApi.crear({
        sede_id: sedeElegida,
        jugadores_por_equipo: cupo,
        // `_id` es identidad de la interfaz, no del dominio: no se envía.
        equipos: equipos.map((e) => ({
          nombre: e.nombre,
          color_slug: e.color_slug,
          jugadores: e.jugadores,
        })),
      });

      setStatus("ok");
      setMsg(
        `Liga creada: edición ${r.numero_sede} de ${nombreSede}, ` +
          `${r.equipos} equipos y ${r.jugadores} jugadores` +
          (r.estado === "proxima" ? " (queda como próxima)" : "") +
          "." +
          (r.creados.length ? ` Nuevos en el padrón: ${r.creados.join(", ")}.` : "")
      );
      setEquipos(borradorVacio());
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Error al crear la liga");
    }
  }

  const nombreSede = sedes.find((s) => s.id === sedeElegida)?.nombre ?? sedeElegida;

  /**
   * Qué significa cada jugador del borrador para esta ciudad. La distinción
   * importa: quien ya juega en Valledupar y entra a Bogotá no es un alta en el
   * padrón —conserva su ficha y su palmarés— pero sí es alguien que empieza a
   * jugar en una ciudad nueva, y conviene verlo antes de guardar.
   */
  const enBorrador = equipos.flatMap((e) => e.jugadores);
  const totalJugadores = enBorrador.length;
  const altasPadron = enBorrador.filter((j) => !j.jugador_id).length;
  const seSumanASede = enBorrador.filter(
    (j) => j.jugador_id && !porId.get(j.jugador_id)?.sedes?.includes(sedeElegida)
  ).length;

  /** Cuántos juegan ya en esta ciudad; en una recién abierta, cero. */
  const jugadoresDeLaSede = jugadores.filter((j) =>
    j.sedes?.includes(sedeElegida)
  ).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-lg font-bold tracking-tight">Crear Liga</h1>

            {/* Ciudad */}
            <div className="flex gap-1 rounded-lg border border-white/10 p-1">
              {sedes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSedeElegida(s.id)}
                  aria-pressed={s.id === sedeElegida}
                  className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                    s.id === sedeElegida ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"
                  }`}
                  style={
                    s.id === sedeElegida && s.color_hex
                      ? { boxShadow: `inset 0 -2px 0 ${s.color_hex}` }
                      : undefined
                  }
                >
                  {s.nombre}
                </button>
              ))}
            </div>

            {/* La edición no se elige: este módulo solo abre ligas nuevas y el
                número es el siguiente de la ciudad. */}
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs">
              {proxima ? (
                <>
                  Edición <strong className="text-white">{proxima.numero_sede}</strong>
                </>
              ) : (
                <span className="text-white/30">Calculando…</span>
              )}
            </span>

            {/* Cupo de plantilla: Valledupar juega con 8 y Bogotá con 10 */}
            <label className="flex items-center gap-2 text-xs text-white/40">
              Por equipo
              <select
                value={cupo}
                onChange={(e) => setCupo(Number(e.target.value))}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white outline-none focus:border-white/30"
              >
                {Array.from({ length: CUPO_MAX - CUPO_MIN + 1 }, (_, i) => i + CUPO_MIN).map((n) => (
                  <option key={n} value={n} className="bg-[#1a1a1a]">{n}</option>
                ))}
              </select>
            </label>

            {/* Cantidad de equipos */}
            <label className="flex items-center gap-2 text-xs text-white/40">
              Equipos
              <select
                value={equipos.length}
                onChange={(e) => cambiarCantidad(Number(e.target.value))}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white outline-none focus:border-white/30"
              >
                {Array.from({ length: MAX_EQUIPOS - MIN_EQUIPOS + 1 }, (_, i) => i + MIN_EQUIPOS).map((n) => (
                  <option key={n} value={n} className="bg-[#1a1a1a]">{n}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/30">
              {equipos.length} equipos · {totalJugadores} jugadores
              {altasPadron > 0 && (
                <span className="text-emerald-400/70"> · {altasPadron} altas</span>
              )}
              {seSumanASede > 0 && (
                <span className="text-sky-400/70"> · {seSumanASede} llegan de otra ciudad</span>
              )}
            </span>
            <button
              onClick={crear}
              disabled={status === "loading" || !proxima}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                status === "loading" || !proxima
                  ? "cursor-not-allowed bg-white/10 text-white/30"
                  : "bg-white text-black hover:bg-white/90 active:scale-95"
              }`}
            >
              {status === "loading" ? "Creando…" : "Crear liga"}
            </button>
            <button
              onClick={() => { logout(); setAuthed(false); }}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/40 transition-colors hover:text-white/60"
            >
              Salir
            </button>
          </div>
        </div>

        {msg && (
          <div className={`mx-auto mt-2 max-w-6xl text-xs ${status === "ok" ? "text-green-400" : "text-red-400"}`}>
            {msg}
          </div>
        )}

        {proxima && (
          <p className="mx-auto mt-1 max-w-6xl text-[11px] text-white/30">
            Se creará la edición {proxima.numero_sede} de {nombreSede}
            {proxima.reutiliza && " (ya estaba abierta sin equipos)"}.{" "}
            {jugadoresDeLaSede === 0 ? (
              <span className="text-white/40">
                {nombreSede} todavía no tiene jugadores: los que agregues serán los primeros.
              </span>
            ) : (
              <>{jugadoresDeLaSede} jugadores juegan ya en {nombreSede}.</>
            )}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipos.map((equipo, i) => (
            <TarjetaEquipo
              key={equipo._id}
              equipo={equipo}
              todos={equipos}
              coloresLibres={coloresLibres}
              cupo={cupo}
              onChange={(actualizado) =>
                setEquipos((prev) => prev.map((e, j) => (j === i ? actualizado : e)))
              }
              onEliminar={
                equipos.length > MIN_EQUIPOS ? () => eliminarEquipo(i) : null
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
