import { useState, useEffect } from "react";
import { statsApi, type Standing, type Goleador, type Arquero } from "../lib/api";
import { getColor } from "../components/anotador/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

function Medal({ pos }: { pos: number }) {
  if (pos === 1) return <span>🥇</span>;
  if (pos === 2) return <span>🥈</span>;
  if (pos === 3) return <span>🥉</span>;
  return <span className="text-gray-500 text-sm w-5 inline-block text-center">{pos}</span>;
}

function LoadingRows({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-3 py-3">
              <div className="h-3 bg-gray-800 rounded-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Classification table ──────────────────────────────────────────────────────
function TablaClasificacion({
  standings,
  loading,
}: {
  standings: Standing[];
  loading: boolean;
}) {
  const sorted = [...standings].sort(
    (a, b) => b.puntos - a.puntos || b.victorias - a.victorias
  );

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-white font-bold text-base">Clasificación</h2>
        <span className="text-gray-600 text-xs">Temporada 19</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-gray-600 font-semibold text-xs px-3 py-2 text-left w-8">#</th>
              <th className="text-gray-600 font-semibold text-xs px-3 py-2 text-left">Equipo</th>
              <th className="text-gray-600 font-semibold text-xs px-3 py-2 text-center">V</th>
              <th className="text-gray-600 font-semibold text-xs px-3 py-2 text-center">E</th>
              <th className="text-gray-600 font-semibold text-xs px-3 py-2 text-center">D</th>
              <th className="text-gray-500 font-black text-xs px-3 py-2 text-center">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {loading ? (
              <LoadingRows cols={6} />
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-600 py-8 text-sm">
                  Sin datos de jornadas aún
                </td>
              </tr>
            ) : (
              sorted.map((s, i) => {
                const color = getColor(s.equipoId);
                return (
                  <tr key={s.equipoId} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-3 py-3 text-center">
                      <Medal pos={i + 1} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-white font-medium">{s.nombre}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-white tabular-nums">
                      {s.victorias}
                    </td>
                    <td className="px-3 py-3 text-center text-white tabular-nums">
                      {s.empates}
                    </td>
                    <td className="px-3 py-3 text-center text-white tabular-nums">
                      {s.derrotas}
                    </td>
                    <td className="px-3 py-3 text-center text-white font-black text-base tabular-nums">
                      {s.puntos}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Top scorers ───────────────────────────────────────────────────────────────
function TablaGoleadores({
  goleadores,
  loading,
}: {
  goleadores: Goleador[];
  loading: boolean;
}) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4">
      <h2 className="text-white font-bold text-base mb-3">⚽ Goleadores</h2>
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : goleadores.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">Sin goles registrados</p>
      ) : (
        <div className="space-y-2">
          {goleadores.slice(0, 10).map((g, i) => {
            const color = getColor(g.equipoId);
            return (
              <div key={`${g.jugador}-${i}`} className="flex items-center gap-2">
                <span className="w-5 text-center shrink-0">
                  <Medal pos={i + 1} />
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium" style={{ color }}>
                    {g.jugador}
                  </span>
                  <span className="text-gray-600 text-xs ml-1">· {g.equipo}</span>
                </div>
                <span className="text-white font-black text-sm tabular-nums shrink-0">
                  {g.goles}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Top keepers ───────────────────────────────────────────────────────────────
function TablaArqueros({
  arqueros,
  loading,
}: {
  arqueros: Arquero[];
  loading: boolean;
}) {
  const sorted = [...arqueros].sort((a, b) => a.golesRecibidos - b.golesRecibidos);

  return (
    <div className="bg-gray-900 rounded-2xl p-4">
      <h2 className="text-white font-bold text-base mb-3">🧤 Arqueros</h2>
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="text-gray-600 text-sm text-center py-4">Sin datos</p>
      ) : (
        <div className="space-y-2">
          {sorted.slice(0, 10).map((a, i) => {
            const color = getColor(a.equipoId);
            return (
              <div key={`${a.arquero}-${i}`} className="flex items-center gap-2">
                <span className="w-5 text-center shrink-0 text-xs text-gray-600">
                  {i + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium" style={{ color }}>
                    {a.arquero}
                  </span>
                  <span className="text-gray-600 text-xs ml-1">· {a.equipo}</span>
                </div>
                <span className="text-gray-400 text-sm tabular-nums shrink-0">
                  {a.golesRecibidos} rec.
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [goleadores, setGoleadores] = useState<Goleador[]>([]);
  const [arqueros, setArqueros] = useState<Arquero[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    setError("");
    try {
      const [clas, gol, arq] = await Promise.all([
        statsApi.clasificacion(19),
        statsApi.goleadores(19),
        statsApi.arqueros(19),
      ]);
      setStandings(clas.standings);
      setGoleadores(gol.goleadores);
      setArqueros(arq.arqueros);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando datos");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-full bg-gray-100 p-4 md:p-6 space-y-4 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-xl font-black">Dashboard</h1>
          <p className="text-gray-500 text-xs">Liga PPT · Temporada 19</p>
        </div>
        <div className="text-right">
          <button
            onClick={fetchAll}
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ↻ Actualizar
          </button>
          {lastUpdate && (
            <p className="text-gray-400 text-[10px] mt-0.5">
              {lastUpdate.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <TablaClasificacion standings={standings} loading={loadingStats} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TablaGoleadores goleadores={goleadores} loading={loadingStats} />
        <TablaArqueros arqueros={arqueros} loading={loadingStats} />
      </div>
    </div>
  );
}
