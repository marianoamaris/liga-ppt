import { useState } from "react";
import { JORNADAS_TOTALES } from "../../constants/ANOTADOR_CONFIG";
import { EDICION_ACTUAL } from "../../config";
import { usePlantillasEdicion } from "../../hooks/useCatalogo";
import { camisetaEquipo } from "../../utils/imagenesEquipos";
import type { EquipoConPlantilla } from "../../types/jugador";
import type { EquipoEnCancha, ModoPartido, PartidoConfig } from "./types";

function buildEquipo(equipo: EquipoConPlantilla): EquipoEnCancha {
  return {
    equipo: {
      id: equipo.slug,
      nombre: equipo.nombre,
      imagen: camisetaEquipo(equipo.edicion, equipo.color_slug) ?? "",
    },
    jugadores: equipo.jugadores.map(({ nombre }) => ({ nombre })),
    ...(equipo.arqueroDesignado
      ? { arqueroDesignado: equipo.arqueroDesignado }
      : {}),
  };
}

const MODOS: { key: ModoPartido; label: string; icon: string }[] = [
  { key: "jornada",   label: "Jornada",  icon: "⚽" },
  { key: "cuartos",   label: "Cuartos",  icon: "🎯" },
  { key: "semifinal", label: "Semifinal", icon: "⚡" },
  { key: "final",     label: "Final",    icon: "🏆" },
];

interface SlotProps {
  slot: number;
  equipoId: string | null;
  ocupados: string[];
  onChange: (id: string | null) => void;
  equipos: EquipoConPlantilla[];
}

function TeamSlot({ slot, equipoId, ocupados, onChange, equipos }: SlotProps) {
  const equipo = equipoId ? equipos.find((e) => e.slug === equipoId) : null;
  const color = equipo?.color_hex ?? "#4B5563";

  return (
    <div
      className="bg-gray-800/80 rounded-2xl p-4 space-y-3 border border-gray-700/50"
      style={equipo ? { borderColor: `${color}40` } : undefined}
    >
      <div className="flex items-center gap-2">
        {equipo && (
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
        )}
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
          Equipo {slot + 1}
        </span>
      </div>

      <select
        value={equipoId ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full bg-gray-700 text-white rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[52px]"
        style={equipo ? { borderLeft: `3px solid ${color}` } : undefined}
      >
        <option value="">— Seleccionar equipo —</option>
        {equipos.map((eq) => (
          <option
            key={eq.slug}
            value={eq.slug}
            disabled={ocupados.includes(eq.slug) && equipoId !== eq.slug}
          >
            {eq.nombre}
          </option>
        ))}
      </select>

      {equipo && (
        <div className="space-y-1.5">
          <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
            Plantilla
          </p>
          <div className="flex flex-wrap gap-1.5">
            {equipo.jugadores.map(({ nombre: j, esArquero }) => {
              return (
                <span
                  key={j}
                  className={`text-xs rounded-xl px-2.5 py-1.5 leading-none flex items-center gap-1 ${
                    esArquero
                      ? "bg-green-900/40 text-green-400 border border-green-800/60"
                      : "bg-gray-700/80 text-gray-300"
                  }`}
                >
                  {esArquero && <span>🧤</span>}
                  {j}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  onIniciar: (config: PartidoConfig) => void;
}

export function SetupJornada({ onIniciar }: Props) {
  const [modo, setModo] = useState<ModoPartido>("jornada");
  const [jornada, setJornada] = useState(1);
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const { equipos, loading, error } = usePlantillasEdicion(EDICION_ACTUAL);

  const esPlayoff = modo !== "jornada";
  const slotCount = esPlayoff ? 2 : 3;
  const activeSlots = slots.slice(0, slotCount);
  const ocupados = activeSlots.filter(Boolean) as string[];
  const listos = activeSlots.every((s) => s !== null);

  function handleModoChange(m: ModoPartido) {
    setModo(m);
    setSlots([null, null, null]);
  }

  function updateSlot(i: number, id: string | null) {
    const next = [...slots];
    next[i] = id;
    setSlots(next);
  }

  function handleIniciar() {
    if (!listos) return;
    const elegidos = (activeSlots as string[]).map((id) =>
      equipos.find((e) => e.slug === id)
    );
    if (elegidos.some((e) => !e)) return;
    const [a, b, c] = elegidos as EquipoConPlantilla[];

    if (modo === "jornada") {
      onIniciar({
        modo: "jornada",
        jornada,
        equipos: [buildEquipo(a), buildEquipo(b), buildEquipo(c)],
      });
    } else {
      onIniciar({
        modo,
        equipos: [buildEquipo(a), buildEquipo(b)],
      });
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 pt-8 pb-10 space-y-4">
        <div className="text-center pb-2">
          <p className="text-gray-500 text-sm">Liga PPT · Edición #20</p>
          <h1 className="text-white text-2xl font-bold mt-1">Configurar Partido</h1>
        </div>

        {/* Mode selector — 2×2 grid */}
        <div className="grid grid-cols-2 gap-1.5 bg-gray-800/60 p-1.5 rounded-2xl">
          {MODOS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => handleModoChange(key)}
              className={`min-h-[52px] rounded-xl text-sm font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                modo === key
                  ? "bg-gray-900 text-white shadow-lg"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="text-xl leading-none">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Jornada selector (only for jornada mode) */}
        {!esPlayoff && (
          <div className="bg-gray-800/80 rounded-2xl p-4 border border-gray-700/50">
            <label className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold block mb-2.5">
              Jornada
            </label>
            <select
              value={jornada}
              onChange={(e) => setJornada(Number(e.target.value))}
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3.5 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[52px]"
            >
              {Array.from({ length: JORNADAS_TOTALES }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>Jornada {n}</option>
              ))}
            </select>
          </div>
        )}

        {/* Team slots */}
        {(loading || error) && (
          <p
            className={`rounded-2xl px-4 py-3 text-sm ${
              error
                ? "bg-red-900/30 text-red-300"
                : "bg-gray-800/80 text-gray-400"
            }`}
          >
            {error
              ? `No se pudieron cargar los equipos: ${error}`
              : "Cargando equipos y plantillas…"}
          </p>
        )}
        {Array.from({ length: slotCount }, (_, i) => (
          <TeamSlot
            key={i}
            slot={i}
            equipoId={slots[i] ?? null}
            ocupados={ocupados.filter((id) => id !== slots[i])}
            onChange={(id) => updateSlot(i, id)}
            equipos={equipos}
          />
        ))}

        {/* Start button */}
        <button
          onClick={handleIniciar}
          disabled={!listos}
          className="w-full min-h-[56px] bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-2xl text-lg transition-colors active:scale-[0.98]"
        >
          {listos
            ? `🚀 Iniciar ${modo === "jornada" ? "Partido" : modo === "semifinal" ? "Semifinal" : "Final"}`
            : `Selecciona ${slotCount === 2 ? "los 2 equipos" : "los 3 equipos"}`}
        </button>
      </div>
    </div>
  );
}
