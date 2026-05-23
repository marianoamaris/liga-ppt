import { getColor, computeScores, formatCountdown, DURACION_PARTIDO } from "./utils";
import type { EquipoEnCancha, Evento, ModoPartido } from "./types";

interface Props {
  modo: ModoPartido;
  equipos: EquipoEnCancha[];
  eventos: Evento[];
  jornada?: number;
  // jornada only
  tiempoRestante?: number;
  corriendo?: boolean;
  onToggle?: () => void;
  onReiniciar?: () => void;
}

export function MarcadorVivo({
  modo,
  equipos,
  eventos,
  jornada,
  tiempoRestante = 0,
  corriendo = false,
  onToggle,
  onReiniciar,
}: Props) {
  const scores = computeScores(equipos, eventos);

  // ── Playoff header ────────────────────────────────────────────────────────
  if (modo !== "jornada") {
    const [eqA, eqB] = equipos;
    const colorA = getColor(eqA.equipo.id);
    const colorB = getColor(eqB.equipo.id);
    const golesA = scores.get(eqA.equipo.id)?.victorias ?? 0;
    const golesB = scores.get(eqB.equipo.id)?.victorias ?? 0;
    const label =
      modo === "cuartos" ? "🎯 Cuartos de Final" :
      modo === "semifinal" ? "⚡ Semifinal" : "🏆 Final";

    return (
      <div className="bg-gray-950 border-b border-gray-800 sticky top-0 z-30 shadow-xl px-4 py-4">
        <p className="text-gray-500 text-[11px] uppercase tracking-widest font-semibold text-center mb-3">
          {label}
        </p>
        <div className="flex items-center justify-center gap-3">
          {/* Team A */}
          <div className="flex-1 text-right">
            <div className="font-bold text-lg leading-tight" style={{ color: colorA }}>
              {eqA.equipo.nombre}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-white text-5xl font-black tabular-nums leading-none">
              {golesA}
            </span>
            <span className="text-gray-600 text-2xl font-light">—</span>
            <span className="text-white text-5xl font-black tabular-nums leading-none">
              {golesB}
            </span>
          </div>

          {/* Team B */}
          <div className="flex-1 text-left">
            <div className="font-bold text-lg leading-tight" style={{ color: colorB }}>
              {eqB.equipo.nombre}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Jornada header ────────────────────────────────────────────────────────
  const tiempoAgotado = tiempoRestante <= 0;
  const urgente = tiempoRestante <= 60 && !tiempoAgotado;

  return (
    <div className="bg-gray-950 border-b border-gray-800 sticky top-0 z-30 shadow-xl">
      {/* Scores row */}
      <div className="flex items-center px-3 pt-2.5 pb-1.5 gap-1">
        {equipos.map((eq) => {
          const color = getColor(eq.equipo.id);
          const s = scores.get(eq.equipo.id) ?? {
            victorias: 0, empates: 0, derrotas: 0, puntos: 0,
          };
          return (
            <div key={eq.equipo.id} className="flex-1 text-center min-w-0">
              <div className="text-[10px] font-bold truncate leading-none" style={{ color }}>
                {eq.equipo.nombre}
              </div>
              <div className="text-white text-2xl font-black leading-tight tabular-nums">
                {s.puntos}
                <span className="text-gray-600 text-[11px] font-normal ml-px">p</span>
              </div>
              <div className="text-gray-600 text-[10px] leading-none">
                {s.victorias}V·{s.empates}E·{s.derrotas}D
              </div>
            </div>
          );
        })}
        {jornada && (
          <div className="text-gray-700 text-[10px] shrink-0 pl-2 border-l border-gray-800 leading-tight text-right">
            J{jornada}
          </div>
        )}
      </div>

      <div className="h-px bg-gray-800 mx-3" />

      {/* Timer row */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="flex-1">
          {tiempoAgotado ? (
            <span className="font-mono font-black text-2xl text-red-400 animate-pulse">
              ⏰ TIEMPO
            </span>
          ) : (
            <span className={`font-mono font-black text-3xl tabular-nums leading-none ${urgente ? "text-yellow-400" : "text-white"}`}>
              {formatCountdown(tiempoRestante)}
            </span>
          )}
          {urgente && (
            <span className="text-yellow-600 text-[10px] block leading-none mt-0.5">
              último minuto
            </span>
          )}
        </div>

        <button
          onClick={onToggle}
          disabled={tiempoAgotado}
          className={`min-h-[44px] px-5 rounded-xl text-sm font-bold transition-colors active:scale-95 ${
            tiempoAgotado
              ? "bg-gray-800 text-gray-600 cursor-not-allowed"
              : corriendo
              ? "bg-orange-600/30 border border-orange-500/50 text-orange-300 hover:bg-orange-600/50"
              : "bg-green-600/30 border border-green-500/50 text-green-300 hover:bg-green-600/50"
          }`}
        >
          {corriendo ? "⏸ Parar" : "▶ Iniciar"}
        </button>

        <button
          onClick={onReiniciar}
          className="min-h-[44px] px-4 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-gray-400 rounded-xl text-sm font-semibold transition-colors border border-gray-700 active:scale-95"
          title={`Reiniciar a ${DURACION_PARTIDO / 60}:00`}
        >
          ↺
        </button>
      </div>
    </div>
  );
}
