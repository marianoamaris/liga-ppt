import React, { useState, useRef, useEffect, type FormEvent } from "react";
import { USUARIOS_LIGA } from "../constants/USUARIOS_LIGA";
import { ligaConfigApi, type TeamConfig } from "../lib/api";
import { useAuth } from "../context/AuthContext";

// slug = identificador del backend (color field en la BD)
// hex  = solo para display en el frontend
const SLOT_COLORS = [
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

export const SLUG_TO_HEX: Record<string, string> = Object.fromEntries(
  SLOT_COLORS.map((s) => [s.slug, s.hex])
);

const ALL_PLAYERS = USUARIOS_LIGA.map((u) => u.name).sort((a, b) =>
  a.localeCompare(b)
);

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

// Slot mantiene hex para display; slug es lo que va al backend como "color"
type Slot = {
  slug: string;
  hex: string;
  label: string;
  nombre: string;
  jugadores: string[];
  arquero?: string;
  capitan?: string;
};

function PlayerSearch({
  onAdd,
  assigned,
  placeholder = "Buscar o escribir nombre…",
}: {
  onAdd: (name: string) => void;
  assigned: string[];
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = ALL_PLAYERS.filter(
    (p) =>
      !assigned.includes(p) &&
      p.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleAdd(name: string) {
    onAdd(name);
    setQuery("");
    setOpen(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && query.trim()) handleAdd(query.trim());
  }

  return (
    <div ref={ref} className="relative">
      <input
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"
        placeholder={placeholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKey}
      />
      {open && (filtered.length > 0 || query.trim()) && (
        <ul className="absolute z-50 mt-1 max-h-44 w-full overflow-y-auto rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl">
          {filtered.map((p) => (
            <li key={p} className="cursor-pointer px-3 py-2 text-sm text-white/80 hover:bg-white/10" onMouseDown={() => handleAdd(p)}>
              {p}
            </li>
          ))}
          {query.trim() && !filtered.find((p) => p.toLowerCase() === query.toLowerCase()) && (
            <li className="cursor-pointer border-t border-white/10 px-3 py-2 text-sm text-white/50 hover:bg-white/10" onMouseDown={() => handleAdd(query.trim())}>
              + Agregar "{query.trim()}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function TeamCard({
  slot,
  allSlots,
  onChange,
}: {
  slot: Slot;
  allSlots: Slot[];
  onChange: (updated: Slot) => void;
}) {
  const light = isLight(slot.hex);
  const headerText = light ? "#111111" : "#FFFFFF";
  const isBorderNeeded = slot.slug === "blanco";

  // All names taken across all slots (jugadores + arqueros)
  const allAssigned = allSlots.flatMap((s) => [
    ...s.jugadores,
    ...(s.arquero ? [s.arquero] : []),
  ]);

  const teamMembers = [
    ...(slot.arquero ? [slot.arquero] : []),
    ...slot.jugadores,
  ];

  function setArquero(name: string) {
    const next: Slot = { ...slot, arquero: name };
    if (slot.capitan === name) delete next.capitan;
    onChange(next);
  }

  function clearArquero() {
    const next: Slot = { ...slot };
    delete next.arquero;
    if (slot.capitan === slot.arquero) delete next.capitan;
    onChange(next);
  }

  function addPlayer(name: string) {
    if (!slot.jugadores.includes(name))
      onChange({ ...slot, jugadores: [...slot.jugadores, name] });
  }

  function removePlayer(name: string) {
    const next: Slot = { ...slot, jugadores: slot.jugadores.filter((j) => j !== name) };
    if (slot.capitan === name) delete next.capitan;
    onChange(next);
  }

  const MAX = 8;
  const totalCount = slot.jugadores.length + (slot.arquero ? 1 : 0);
  const isFull = totalCount >= MAX;

  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden border ${
        isBorderNeeded ? "border-white/20" : "border-transparent"
      } bg-[#111] shadow-lg`}
    >
      {/* Color header */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: slot.hex }}>
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: light ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.35)" }} />
        <input
          className="flex-1 bg-transparent text-base font-bold outline-none"
          style={{ color: headerText }}
          placeholder="Nombre del equipo…"
          value={slot.nombre}
          onChange={(e) => onChange({ ...slot, nombre: e.target.value })}
        />
        <span
          className="text-[12px] font-bold tabular-nums"
          style={{ color: isFull ? (light ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)") : (light ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.45)") }}
        >
          {totalCount}/{MAX}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col divide-y divide-white/5">

        {/* Arquero slot */}
        <div className="p-4 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Arquero</p>
          {slot.arquero ? (
            <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🧤</span>
                <span className="text-sm text-white/90 font-medium">{slot.arquero}</span>
              </div>
              <button
                className="text-white/30 hover:text-red-400 transition-colors text-lg leading-none"
                onClick={clearArquero}
              >
                ×
              </button>
            </div>
          ) : isFull ? (
            <p className="text-xs text-white/20 italic">Límite alcanzado</p>
          ) : (
            <PlayerSearch
              onAdd={setArquero}
              assigned={allAssigned}
              placeholder="Asignar arquero…"
            />
          )}
        </div>

        {/* Jugadores */}
        <div className="p-4 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Jugadores de campo</p>
          <div className="flex flex-wrap gap-2 min-h-[28px]">
            {slot.jugadores.map((j) => (
              <span
                key={j}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                  slot.capitan === j
                    ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                    : "bg-white/8 text-white/75 border border-white/10"
                }`}
              >
                {slot.capitan === j && <span className="text-[10px]">©</span>}
                {j}
                <button
                  className="ml-1 text-white/30 hover:text-red-400 transition-colors leading-none"
                  onClick={() => removePlayer(j)}
                >
                  ×
                </button>
              </span>
            ))}
            {slot.jugadores.length === 0 && (
              <span className="text-xs text-white/20 italic">Sin jugadores</span>
            )}
          </div>
          {isFull ? (
            <p className="text-xs text-white/20 italic">Límite de 8 jugadores alcanzado</p>
          ) : (
            <PlayerSearch
              onAdd={addPlayer}
              assigned={allAssigned}
              placeholder="Agregar jugador…"
            />
          )}
        </div>

        {/* Capitán */}
        <div className="p-4 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Capitán</p>
          {teamMembers.length === 0 ? (
            <p className="text-xs text-white/20 italic">Agrega jugadores primero</p>
          ) : (
            <select
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-white/30 appearance-none"
              value={slot.capitan ?? ""}
              onChange={(e) => {
                const next = { ...slot };
                if (e.target.value) next.capitan = e.target.value;
                else delete next.capitan;
                onChange(next);
              }}
            >
              <option value="" className="bg-[#1a1a1a] text-white/40">— Sin capitán —</option>
              {teamMembers.map((m) => (
                <option key={m} value={m} className="bg-[#1a1a1a] text-white">
                  {m === slot.arquero ? `🧤 ${m}` : m}
                </option>
              ))}
            </select>
          )}
        </div>

      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-xs space-y-6">
        <div className="text-center">
          <img src="/ligaPPT-escudo.png" alt="Liga PPT" className="w-14 h-14 mx-auto mb-3 object-contain" />
          <h1 className="text-white text-xl font-black">Crear Liga</h1>
          <p className="text-gray-500 text-sm mt-0.5">Liga PPT · Zona Admin</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#111] rounded-2xl p-6 space-y-4 border border-white/10 shadow-2xl">
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block">Correo</label>
            <input
              type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com"
              className="w-full bg-white/5 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-white/20 border border-white/10"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-gray-400 text-xs uppercase tracking-wider font-semibold block">Contraseña</label>
            <input
              type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full bg-white/5 text-white rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-white/20 border border-white/10"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
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

export function CrearLigaPage() {
  const { profile, loading: authLoading, logout } = useAuth();
  const [authed, setAuthed] = useState(false);
  const [temporada, setTemporada] = useState(20);
  const [slots, setSlots] = useState<Slot[]>(
    SLOT_COLORS.map((sc) => ({ ...sc, nombre: "", jugadores: [] }))
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!authLoading && profile) setAuthed(true);
  }, [authLoading, profile]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/30 text-sm">
        Cargando…
      </div>
    );
  }

  if (!authed) {
    return <LoginForm onSuccess={() => setAuthed(true)} />;
  }

  async function load() {
    setStatus("loading");
    try {
      const data = await ligaConfigApi.get(temporada);
      const updated = SLOT_COLORS.map((sc) => {
        const found = data.equipos.find((e) => e.color === sc.slug);
        return found
          ? {
              ...sc,
              nombre: found.nombre,
              jugadores: found.jugadores,
              ...(found.arquero ? { arquero: found.arquero } : {}),
              ...(found.capitan ? { capitan: found.capitan } : {}),
            }
          : { ...sc, nombre: "", jugadores: [] };
      });
      setSlots(updated);
      setStatus("idle");
    } catch {
      setStatus("idle");
    }
  }

  async function save() {
    // Validación client-side: nombres vacíos en cards con jugadores
    const invalid = slots.filter(
      (s) => !s.nombre.trim() && (s.jugadores.length > 0 || s.arquero)
    );
    if (invalid.length > 0) {
      setStatus("error");
      setMsg(`Faltan nombres en: ${invalid.map((s) => s.label).join(", ")}`);
      return;
    }

    setStatus("loading");
    setMsg("");
    try {
      // Construir payload: usar slug como "color", omitir arquero/capitan si están vacíos
      const equipos: TeamConfig[] = slots
        .filter((s) => s.nombre.trim() || s.jugadores.length > 0 || s.arquero)
        .map((s) => ({
          nombre: s.nombre,
          color: s.slug,
          jugadores: s.jugadores,
          ...(s.arquero ? { arquero: s.arquero } : {}),
          ...(s.capitan ? { capitan: s.capitan } : {}),
        }));

      await ligaConfigApi.save(temporada, equipos);
      setStatus("ok");
      setMsg("Guardado correctamente");
    } catch (e: any) {
      setStatus("error");
      setMsg(e.message ?? "Error al guardar");
    }
  }

  function updateSlot(index: number, updated: Slot) {
    setSlots((prev) => prev.map((s, i) => (i === index ? updated : s)));
  }

  const totalJugadores = slots.reduce((acc, s) => acc + s.jugadores.length + (s.arquero ? 1 : 0), 0);
  const equiposNombrados = slots.filter((s) => s.nombre.trim()).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold tracking-tight">
              Liga PPT{" "}
              <input
                type="number"
                className="ml-1 w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-center text-lg font-bold outline-none focus:border-white/30"
                value={temporada}
                onChange={(e) => setTemporada(Number(e.target.value))}
                min={1}
              />
            </h1>
            <button
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:border-white/20 hover:text-white/70 transition-colors"
              onClick={load}
              disabled={status === "loading"}
            >
              Cargar existente
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/30">
              {equiposNombrados}/9 equipos · {totalJugadores} jugadores
            </span>
            <button
              onClick={save}
              disabled={status === "loading"}
              className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
                status === "loading"
                  ? "bg-white/10 text-white/30 cursor-not-allowed"
                  : "bg-white text-black hover:bg-white/90 active:scale-95"
              }`}
            >
              {status === "loading" ? "Guardando…" : "Guardar"}
            </button>
            <button
              onClick={() => { logout(); setAuthed(false); }}
              className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        {msg && (
          <div
            className={`mx-auto mt-2 max-w-6xl text-xs ${
              status === "ok" ? "text-green-400" : "text-red-400"
            }`}
          >
            {msg}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot, i) => (
            <TeamCard
              key={slot.slug}
              slot={slot}
              allSlots={slots}
              onChange={(updated) => updateSlot(i, updated)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
