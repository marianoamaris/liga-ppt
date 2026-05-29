import { useState } from "react";
import { getColor, computeScores } from "./utils";
import type { ModoPartido, PartidoVivo, RazonAmarilla } from "./types";

const RAZON_LABEL: Record<RazonAmarilla, string> = {
  "halar-peto":      "Halar peto",
  "falta-temeraria": "Falta temeraria",
  "falta-tactica":   "Falta táctica o normal",
  "llegada-tarde":   "Llegada tarde",
  "falta":           "Falta",
  "falta-respeto":   "Falta de respeto al anotador",
};

const MODO_LABEL: Record<ModoPartido, string> = {
  jornada: "Jornada",
  cuartos: "Cuartos de Final",
  semifinal: "Semifinal",
  final: "Final",
};

const MODO_ICON: Record<ModoPartido, string> = {
  jornada: "⚽",
  cuartos: "🎯",
  semifinal: "⚡",
  final: "🏆",
};

interface Props {
  partido: PartidoVivo;
  onNuevoPartido: () => void;
}

export function ResumenPartido({ partido, onNuevoPartido }: Props) {
  const [copiado, setCopiado] = useState(false);
  const { config, eventos } = partido;
  const { equipos, modo } = config;
  const esPlayoff = modo !== "jornada";

  const scores = computeScores(equipos, eventos);

  // Aggregate stats
  const golesPorJugador: Record<string, number> = {};
  const golesRecibidosPorArquero: Record<string, number> = {};
  const amarillasData: { jugador: string; equipo: string; razon: RazonAmarilla }[] = [];
  const rojasData: { jugador: string; equipo: string }[] = [];

  for (const ev of eventos) {
    if (ev.tipo === "gol") {
      golesPorJugador[ev.data.goleador] =
        (golesPorJugador[ev.data.goleador] ?? 0) + 1;
      const eqArq = equipos.find((e) => e.equipo.id === ev.data.equipoArqueroId);
      const arquero = eqArq?.arqueroDesignado;
      if (arquero) {
        golesRecibidosPorArquero[arquero] =
          (golesRecibidosPorArquero[arquero] ?? 0) + 1;
      }
    } else if (ev.tipo === "autogol") {
      // El arquero del equipo que hizo el autogol recibe el gol
      const eqArq = equipos.find((e) => e.equipo.id === ev.data.equipoAutogolId);
      const arquero = eqArq?.arqueroDesignado;
      if (arquero) {
        golesRecibidosPorArquero[arquero] =
          (golesRecibidosPorArquero[arquero] ?? 0) + 1;
      }
    } else if (ev.tipo === "amarilla") {
      const eqAm = equipos.find((e) => e.equipo.id === ev.data.equipoId);
      amarillasData.push({
        jugador: ev.data.jugador,
        equipo: eqAm?.equipo.nombre ?? "",
        razon: ev.data.razon,
      });
    } else if (ev.tipo === "roja") {
      const eqRoja = equipos.find((e) => e.equipo.id === ev.data.equipoId);
      rojasData.push({
        jugador: ev.data.jugador,
        equipo: eqRoja?.equipo.nombre ?? "",
      });
    }
  }

  // ── Playoff result view ────────────────────────────────────────────────────
  if (esPlayoff) {
    const [eqA, eqB] = equipos;
    const colorA = getColor(eqA.equipo.id);
    const colorB = getColor(eqB.equipo.id);
    const golesA = scores.get(eqA.equipo.id)?.victorias ?? 0;
    const golesB = scores.get(eqB.equipo.id)?.victorias ?? 0;

    return (
      <div className="min-h-screen bg-gray-950 overflow-y-auto">
        <div className="max-w-lg mx-auto p-4 space-y-5 pb-10">
          {/* Header */}
          <div className="text-center pt-6 pb-1">
            <div className="text-4xl mb-1">{MODO_ICON[modo]}</div>
            <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold">
              {MODO_LABEL[modo]} · Finalizado
            </p>
          </div>

          {/* Score */}
          <div className="bg-gray-900 rounded-2xl px-6 py-8">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 text-right min-w-0">
                <div className="font-bold text-xl leading-tight truncate" style={{ color: colorA }}>
                  {eqA.equipo.nombre}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-white text-6xl font-black tabular-nums leading-none">
                  {golesA}
                </span>
                <span className="text-gray-600 text-2xl font-light">—</span>
                <span className="text-white text-6xl font-black tabular-nums leading-none">
                  {golesB}
                </span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-bold text-xl leading-tight truncate" style={{ color: colorB }}>
                  {eqB.equipo.nombre}
                </div>
              </div>
            </div>
          </div>

          {/* Goleadores */}
          {Object.keys(golesPorJugador).length > 0 && (
            <div className="bg-gray-900 rounded-2xl p-4">
              <h2 className="text-white font-bold mb-3 flex items-center gap-2">
                ⚽ Goleadores
              </h2>
              <div className="space-y-2">
                {Object.entries(golesPorJugador)
                  .sort(([, a], [, b]) => b - a)
                  .map(([jugador, goles], i) => {
                    const eq = equipos.find((e) =>
                      e.jugadores.some((j) => j.nombre === jugador)
                    );
                    const color = eq ? getColor(eq.equipo.id) : "#9ca3af";
                    return (
                      <div key={jugador} className="flex justify-between items-center py-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gray-600 text-xs w-5 shrink-0">{i + 1}.</span>
                          <span className="text-sm font-medium truncate" style={{ color }}>
                            {jugador}
                          </span>
                        </div>
                        <span className="text-white font-bold shrink-0 ml-2">
                          {goles} {goles === 1 ? "gol" : "goles"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Arqueros */}
          {Object.keys(golesRecibidosPorArquero).length > 0 && (
            <div className="bg-gray-900 rounded-2xl p-4">
              <h2 className="text-white font-bold mb-3 flex items-center gap-2">
                🧤 Goles recibidos
              </h2>
              <div className="space-y-2">
                {Object.entries(golesRecibidosPorArquero)
                  .sort(([, a], [, b]) => a - b)
                  .map(([arquero, goles]) => (
                    <div key={arquero} className="flex justify-between items-center py-1">
                      <span className="text-gray-300 text-sm">{arquero}</span>
                      <span className="text-gray-400 text-sm">{goles} recibidos</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <button
            onClick={onNuevoPartido}
            className="w-full min-h-[56px] bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold rounded-2xl text-lg transition-colors"
          >
            Nuevo Partido
          </button>
        </div>
      </div>
    );
  }

  // ── Jornada full summary ───────────────────────────────────────────────────
  const resumenJSON = JSON.stringify(
    {
      jornada: config.jornada,
      equipos: equipos.map((eq) => {
        const s = scores.get(eq.equipo.id) ?? {
          victorias: 0, empates: 0, derrotas: 0, puntos: 0,
        };
        return {
          equipo: eq.equipo.nombre,
          victorias: s.victorias, empates: s.empates,
          derrotas: s.derrotas, puntos: s.puntos,
        };
      }),
      goles: eventos
        .filter((e) => e.tipo === "gol")
        .map((ev) => {
          if (ev.tipo !== "gol") return null;
          const eqGol = equipos.find((e) => e.equipo.id === ev.data.equipoGoleadorId);
          const eqArq = equipos.find((e) => e.equipo.id === ev.data.equipoArqueroId);
          return {
            tiempoEnMarcador: ev.data.tiempoEnMarcador,
            goleador: ev.data.goleador,
            equipoGoleador: eqGol?.equipo.nombre,
            arquero: eqArq?.arqueroDesignado ?? "—",
            equipoArquero: eqArq?.equipo.nombre,
          };
        })
        .filter(Boolean),
      amarillas: amarillasData,
      rojas: rojasData,
    },
    null,
    2
  );

  return (
    <div className="min-h-screen bg-gray-950 overflow-y-auto">
      <div className="max-w-lg mx-auto p-4 space-y-5 pb-10">
        <div className="text-center pt-6 pb-2">
          <div className="text-5xl mb-2">🏁</div>
          <h1 className="text-white text-2xl font-bold">Partido Finalizado</h1>
          <p className="text-gray-500 text-sm mt-1">
            Jornada {config.jornada} · Liga PPT #19
          </p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-3 gap-3">
          {equipos.map((eq) => {
            const color = getColor(eq.equipo.id);
            const s = scores.get(eq.equipo.id) ?? {
              victorias: 0, empates: 0, derrotas: 0, puntos: 0,
            };
            return (
              <div
                key={eq.equipo.id}
                className="bg-gray-900 rounded-2xl p-4 text-center"
                style={{ border: `1px solid ${color}40` }}
              >
                <div className="text-xs font-bold mb-2 truncate" style={{ color }}>
                  {eq.equipo.nombre}
                </div>
                <div className="text-white text-3xl font-black tabular-nums">{s.puntos}</div>
                <div className="text-gray-500 text-xs mt-0.5">puntos</div>
                <div className="text-gray-600 text-[11px] mt-1.5">
                  {s.victorias}V · {s.empates}E · {s.derrotas}D
                </div>
              </div>
            );
          })}
        </div>

        {/* Goleadores */}
        {Object.keys(golesPorJugador).length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-white font-bold mb-3">⚽ Goleadores</h2>
            <div className="space-y-2">
              {Object.entries(golesPorJugador)
                .sort(([, a], [, b]) => b - a)
                .map(([jugador, goles], i) => {
                  const eq = equipos.find((e) =>
                    e.jugadores.some((j) => j.nombre === jugador)
                  );
                  const color = eq ? getColor(eq.equipo.id) : "#9ca3af";
                  return (
                    <div key={jugador} className="flex justify-between items-center py-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-gray-600 text-xs w-5 shrink-0">{i + 1}.</span>
                        <span className="text-sm font-medium truncate" style={{ color }}>
                          {jugador}
                        </span>
                      </div>
                      <span className="text-white font-bold shrink-0 ml-2">
                        {goles} {goles === 1 ? "gol" : "goles"}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Arqueros */}
        {Object.keys(golesRecibidosPorArquero).length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-white font-bold mb-3">🧤 Arqueros</h2>
            <div className="space-y-2">
              {Object.entries(golesRecibidosPorArquero)
                .sort(([, a], [, b]) => a - b)
                .map(([arquero, goles]) => (
                  <div key={arquero} className="flex justify-between items-center py-1">
                    <span className="text-gray-300 text-sm">{arquero}</span>
                    <span className="text-gray-400 text-sm">{goles} recibidos</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Amarillas */}
        {amarillasData.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-white font-bold mb-3">🟨 Tarjetas Amarillas</h2>
            <div className="space-y-2">
              {amarillasData.map((a, i) => {
                const eq = equipos.find((e) =>
                  e.jugadores.some((j) => j.nombre === a.jugador)
                );
                const color = eq ? getColor(eq.equipo.id) : "#9ca3af";
                return (
                  <div key={i} className="flex justify-between items-start py-1">
                    <div className="min-w-0">
                      <span className="text-sm font-medium" style={{ color }}>
                        {a.jugador}
                      </span>
                      <div className="text-gray-600 text-xs">{RAZON_LABEL[a.razon]}</div>
                    </div>
                    <span className="text-gray-500 text-xs shrink-0 ml-2">{a.equipo}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rojas */}
        {rojasData.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-white font-bold mb-3">🟥 Tarjetas Rojas</h2>
            <div className="space-y-2">
              {rojasData.map((r, i) => {
                const eq = equipos.find((e) =>
                  e.jugadores.some((j) => j.nombre === r.jugador)
                );
                const color = eq ? getColor(eq.equipo.id) : "#9ca3af";
                return (
                  <div key={i} className="flex justify-between items-center py-1">
                    <div className="min-w-0">
                      <span className="text-sm font-medium" style={{ color }}>
                        {r.jugador}
                      </span>
                      <div className="text-red-500 text-xs font-semibold">Expulsión</div>
                    </div>
                    <span className="text-gray-500 text-xs shrink-0 ml-2">{r.equipo}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* JSON export */}
        <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm">Datos del partido</h2>
            <button
              onClick={() =>
                navigator.clipboard.writeText(resumenJSON).then(() => {
                  setCopiado(true);
                  setTimeout(() => setCopiado(false), 2500);
                })
              }
              className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              {copiado ? "✓ Copiado" : "Copiar JSON"}
            </button>
          </div>
          <pre className="text-xs text-gray-400 bg-gray-800 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap break-all">
            {resumenJSON}
          </pre>
        </div>

        <button
          onClick={onNuevoPartido}
          className="w-full min-h-[56px] bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold rounded-2xl text-lg transition-colors"
        >
          Nuevo Partido
        </button>
      </div>
    </div>
  );
}
