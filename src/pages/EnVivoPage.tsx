import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { partidosApi, statsApi, type Partido, type Standing, type Goleador, type Arquero } from "../lib/api";
import { supabase } from "../lib/supabase";
import { getColor, getTextColor, computeScores, formatElapsed } from "../components/anotador/utils";
import { LIGA_19_EQUIPOS } from "../constants/liga19";
import type { EquipoEnCancha, Evento } from "../components/anotador/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MODO_LABEL: Record<string, string> = {
  jornada:   "Jornada",
  cuartos:   "Cuartos de Final",
  semifinal: "Semifinal",
  final:     "Final",
};
const MODO_ICON: Record<string, string> = {
  jornada: "⚽", cuartos: "🎯", semifinal: "⚡", final: "🏆",
};

function toLocalEquipo(eq: Partido["equipos"][number]): EquipoEnCancha {
  const local = LIGA_19_EQUIPOS.find((e) => e.id === eq.equipo.id);
  return {
    equipo: local ?? { id: eq.equipo.id, nombre: eq.equipo.nombre, imagen: "" },
    jugadores: eq.jugadores,
    arqueroDesignado: eq.arqueroDesignado,
  };
}

/** Merge finalized standings + all live active match events */
function mergeStandings(base: Standing[], partidos: Partido[]) {
  const map = new Map<string, Standing & { pos: number }>();
  for (const eq of LIGA_19_EQUIPOS) {
    map.set(eq.id, { equipoId: eq.id, nombre: eq.nombre, victorias: 0, empates: 0, derrotas: 0, puntos: 0, pos: 0 });
  }
  for (const s of base) {
    map.set(s.equipoId, { ...s, pos: 0 });
  }
  for (const partido of partidos) {
    if (partido.modo !== "jornada") continue;
    const equipos = partido.equipos.map(toLocalEquipo);
    const live = computeScores(equipos, partido.eventos);
    for (const [id, score] of live.entries()) {
      const e = map.get(id);
      if (e) map.set(id, { ...e, victorias: e.victorias + score.victorias, empates: e.empates + score.empates, derrotas: e.derrotas + score.derrotas, puntos: e.puntos + score.puntos });
    }
  }
  return [...map.values()]
    .sort((a, b) => b.puntos - a.puntos || b.victorias - a.victorias)
    .map((s, i) => ({ ...s, pos: i + 1 }));
}

const RAZON: Record<string, string> = {
  "llegada-tarde": "Llegada tarde", falta: "Falta", "falta-respeto": "Falta de respeto",
};

// ── Marcador ──────────────────────────────────────────────────────────────────

function Marcador({ partido }: { partido: Partido }) {
  const equipos = partido.equipos.map(toLocalEquipo);
  const scores  = computeScores(equipos, partido.eventos);

  if (partido.modo !== "jornada") {
    const [eqA, eqB] = equipos;
    const gA = scores.get(eqA.equipo.id)?.victorias ?? 0;
    const gB = scores.get(eqB.equipo.id)?.victorias ?? 0;
    return (
      <div className="flex items-center justify-center gap-3 py-5 px-4">
        <div className="flex-1 text-right min-w-0">
          <div className="flex items-center justify-end gap-1.5">
            <div className="font-black text-lg leading-tight text-white">{eqA.equipo.nombre}</div>
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getColor(eqA.equipo.id) }} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-white text-4xl font-black tabular-nums leading-none">{gA}</span>
          <span className="text-gray-600 text-xl font-light">—</span>
          <span className="text-white text-4xl font-black tabular-nums leading-none">{gB}</span>
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: getColor(eqB.equipo.id) }} />
            <div className="font-black text-lg leading-tight text-white">{eqB.equipo.nombre}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-around py-4 px-3">
      {equipos.map((eq) => {
        const color = getColor(eq.equipo.id);
        const s = scores.get(eq.equipo.id) ?? { victorias: 0, empates: 0, derrotas: 0, puntos: 0 };
        return (
          <div key={eq.equipo.id} className="text-center min-w-0 flex-1">
            <div className="flex items-center justify-center gap-1 leading-tight">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-white text-[11px] font-bold truncate">{eq.equipo.nombre}</span>
            </div>
            <div className="text-white text-3xl font-black tabular-nums leading-tight mt-0.5">
              {s.puntos}<span className="text-gray-600 text-[10px] font-normal ml-px">p</span>
            </div>
            <div className="text-gray-500 text-[10px] mt-0.5">{s.victorias}V·{s.empates}E·{s.derrotas}D</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Feed eventos ──────────────────────────────────────────────────────────────

function FeedEventos({ eventos, equipos }: { eventos: Evento[]; equipos: EquipoEnCancha[] }) {
  if (eventos.length === 0) return <p className="text-gray-600 text-xs text-center py-4">Sin eventos aún</p>;
  return (
    <div className="divide-y divide-gray-800 max-h-52 overflow-y-auto">
      {[...eventos].reverse().map((ev) => {
        const t = <span className="text-gray-500 text-[10px] w-11 shrink-0 font-mono tabular-nums">{formatElapsed(ev.data.tiempoEnMarcador)}</span>;
        if (ev.tipo === "gol") {
          const eq = equipos.find((e) => e.equipo.id === ev.data.equipoGoleadorId);
          return (
            <div key={ev.data.id} className="flex items-center gap-2 px-4 py-2 text-sm">
              {t}<span>⚽</span>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getColor(ev.data.equipoGoleadorId) }} />
              <span className="font-medium text-white">{ev.data.goleador}</span>
              <span className="text-gray-600 text-xs">· {eq?.equipo.nombre}</span>
            </div>
          );
        }
        if (ev.tipo === "autogol") {
          const eq = equipos.find((e) => e.equipo.id === ev.data.equipoAutogolId);
          return (
            <div key={ev.data.id} className="flex items-center gap-2 px-4 py-2 text-sm">
              {t}<span>🥅</span>
              <span className="text-red-400 font-medium">Autogol</span>
              <span className="text-gray-600 text-xs">· {eq?.equipo.nombre}</span>
            </div>
          );
        }
        if (ev.tipo === "empate") {
          const eqA = equipos.find((e) => e.equipo.id === ev.data.equipoAId);
          const eqB = equipos.find((e) => e.equipo.id === ev.data.equipoBId);
          return (
            <div key={ev.data.id} className="flex items-center gap-2 px-4 py-2 text-sm">
              {t}<span>🤝</span>
              <span className="text-yellow-500 text-xs">{eqA?.equipo.nombre} vs {eqB?.equipo.nombre}</span>
            </div>
          );
        }
        if (ev.tipo === "amarilla") {
          return (
            <div key={ev.data.id} className="flex items-center gap-2 px-4 py-2 text-sm">
              {t}<span>🟨</span>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getColor(ev.data.equipoId) }} />
              <span className="font-medium text-white">{ev.data.jugador}</span>
              <span className="text-gray-600 text-xs">· {RAZON[ev.data.razon]}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ── Cancha card ───────────────────────────────────────────────────────────────

function CanchaCard({ partido, numero }: { partido: Partido; numero: number }) {
  const equipos = partido.equipos.map(toLocalEquipo);
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-gray-700 text-white text-xs font-black px-2 py-0.5 rounded-lg">
            Cancha {numero}
          </span>
          <span className="text-lg">{MODO_ICON[partido.modo] ?? "⚽"}</span>
          <span className="text-white font-bold text-sm">
            {MODO_LABEL[partido.modo] ?? partido.modo}
            {partido.jornada ? ` ${partido.jornada}` : ""}
          </span>
        </div>
        {partido.anotador_nombre && (
          <span className="text-gray-600 text-xs">🖊 {partido.anotador_nombre}</span>
        )}
      </div>

      <Marcador partido={partido} />

      {partido.eventos.length > 0 && (
        <div className="border-t border-gray-800">
          <div className="px-4 py-1.5">
            <span className="text-gray-600 text-[10px] uppercase tracking-wider font-semibold">
              Eventos · {partido.eventos.length}
            </span>
          </div>
          <FeedEventos eventos={partido.eventos} equipos={equipos} />
        </div>
      )}
    </div>
  );
}

// ── Rankings goleadores / arqueros ────────────────────────────────────────────

const LAYOUT_TRANSITION = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } as const;

function TablaGoleadores({ goleadores, loading }: { goleadores: Goleador[]; loading: boolean }) {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <span className="text-lg">⚽</span>
        <h2 className="text-white font-bold text-sm">Goleadores</h2>
      </div>
      <div className="divide-y divide-gray-800/40">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
                <div className="w-4 h-3 bg-gray-800 rounded-full" />
                <div className="flex-1 h-3 bg-gray-800 rounded-full" />
                <div className="w-4 h-3 bg-gray-800 rounded-full" />
              </div>
            ))
          : goleadores.length === 0
          ? <p className="text-gray-600 text-xs text-center py-6">Sin goles registrados</p>
          : (
            <AnimatePresence initial={false}>
              {goleadores.map((g, i) => {
                const color = getColor(g.equipoId);
                const textColor = getTextColor(g.equipoId);
                return (
                  <motion.div
                    key={`${g.jugador}-${g.equipoId}`}
                    layout
                    transition={LAYOUT_TRANSITION}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <span className="text-gray-600 text-xs tabular-nums w-4 text-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{g.jugador}</div>
                      <div
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5"
                        style={{ backgroundColor: color, color: textColor }}
                      >
                        {g.equipo}
                      </div>
                    </div>
                    <span className="text-white font-black text-base tabular-nums shrink-0">{g.goles}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
      </div>
    </div>
  );
}

function TablaArqueros({ arqueros, loading }: { arqueros: Arquero[]; loading: boolean }) {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <span className="text-lg">🧤</span>
        <h2 className="text-white font-bold text-sm">Valla menos vencida</h2>
      </div>
      <div className="divide-y divide-gray-800/40">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
                <div className="w-4 h-3 bg-gray-800 rounded-full" />
                <div className="flex-1 h-3 bg-gray-800 rounded-full" />
                <div className="w-4 h-3 bg-gray-800 rounded-full" />
              </div>
            ))
          : arqueros.length === 0
          ? <p className="text-gray-600 text-xs text-center py-6">Sin datos</p>
          : (
            <AnimatePresence initial={false}>
              {arqueros.map((a, i) => {
                const color = getColor(a.equipoId);
                const textColor = getTextColor(a.equipoId);
                return (
                  <motion.div
                    key={`${a.arquero}-${a.equipoId}`}
                    layout
                    transition={LAYOUT_TRANSITION}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <span className="text-gray-600 text-xs tabular-nums w-4 text-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{a.arquero}</div>
                      <div
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5"
                        style={{ backgroundColor: color, color: textColor }}
                      >
                        {a.equipo}
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs tabular-nums shrink-0">{a.golesRecibidos} <span className="text-gray-600">gc</span></span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
      </div>
    </div>
  );
}

// ── Clasificación ─────────────────────────────────────────────────────────────

// Anchos de columna fijos para que el layout div replique la alineación de tabla
const COL = {
  pos:     "w-7 shrink-0",
  equipo:  "flex-1 min-w-0",
  stat:    "w-8 shrink-0 text-center",
  pts:     "w-10 shrink-0 text-center",
};

function TablaClasificacion({ standings, loading }: { standings: ReturnType<typeof mergeStandings>; loading: boolean }) {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        <h2 className="text-white font-bold text-sm">Clasificación en vivo</h2>
        <span className="text-gray-600 text-xs ml-auto">Temporada 19</span>
      </div>

      {/* Header fijo (no anima) */}
      <div className="flex items-center gap-0 px-3 py-2 border-b border-gray-800/50">
        <span className={`${COL.pos} text-gray-600 text-xs font-semibold text-left`}>#</span>
        <span className={`${COL.equipo} text-gray-600 text-xs font-semibold`}>Equipo</span>
        <span className={`${COL.stat} text-gray-600 text-xs font-semibold`}>V</span>
        <span className={`${COL.stat} text-gray-600 text-xs font-semibold`}>E</span>
        <span className={`${COL.stat} text-gray-600 text-xs font-semibold`}>D</span>
        <span className={`${COL.pts} text-gray-500 text-xs font-black`}>Pts</span>
      </div>

      {/* Filas animadas */}
      <div className="divide-y divide-gray-800/40">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center gap-0 px-3 py-2.5 animate-pulse">
                <div className={`${COL.pos}`}><div className="h-3 w-3 bg-gray-800 rounded-full mx-auto" /></div>
                <div className={`${COL.equipo} pr-2`}><div className="h-3 bg-gray-800 rounded-full" /></div>
                <div className={`${COL.stat}`}><div className="h-3 w-4 bg-gray-800 rounded-full mx-auto" /></div>
                <div className={`${COL.stat}`}><div className="h-3 w-4 bg-gray-800 rounded-full mx-auto" /></div>
                <div className={`${COL.stat}`}><div className="h-3 w-4 bg-gray-800 rounded-full mx-auto" /></div>
                <div className={`${COL.pts}`}><div className="h-4 w-5 bg-gray-800 rounded-full mx-auto" /></div>
              </div>
            ))
          : (
            <AnimatePresence initial={false}>
              {standings.map((s) => {
                const color = getColor(s.equipoId);
                return (
                  <motion.div
                    key={s.equipoId}
                    layout
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex items-center gap-0 px-3 py-2.5 hover:bg-gray-800/30"
                  >
                    <span className={`${COL.pos} text-gray-500 text-xs tabular-nums`}>{s.pos}</span>
                    <div className={`${COL.equipo} flex items-center gap-2 pr-2`}>
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-white text-sm font-medium truncate">{s.nombre}</span>
                    </div>
                    <span className={`${COL.stat} text-white tabular-nums text-xs`}>{s.victorias}</span>
                    <span className={`${COL.stat} text-white tabular-nums text-xs`}>{s.empates}</span>
                    <span className={`${COL.stat} text-white tabular-nums text-xs`}>{s.derrotas}</span>
                    <span className={`${COL.pts} text-white font-black text-base tabular-nums`}>{s.puntos}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type FiltroCancha = "todas" | 1 | 2 | 3;

export function EnVivoPage() {
  const [partidos, setPartidos]         = useState<Partido[]>([]);
  const [baseStandings, setBase]        = useState<Standing[]>([]);
  const [goleadores, setGoleadores]     = useState<Goleador[]>([]);
  const [arqueros, setArqueros]         = useState<Arquero[]>([]);
  const [filtro, setFiltro]             = useState<FiltroCancha>("todas");
  const [loadingMatch, setLoadingMatch] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRankings, setLoadingRankings] = useState(true);
  const [lastUpdate, setLastUpdate]     = useState<Date | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);

  async function fetchActivos() {
    try {
      const { enVivo } = await partidosApi.getEnVivo();
      const activos = enVivo
        .filter((p) => !p.finalizado_en)
        .sort((a, b) => new Date(a.iniciado_en).getTime() - new Date(b.iniciado_en).getTime());
      setPartidos(activos);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("En Vivo fetch:", err);
    } finally {
      setLoadingMatch(false);
    }
  }

  async function fetchStandings() {
    try {
      const { standings } = await statsApi.clasificacion(19);
      setBase(standings);
    } catch {
      // silent
    } finally {
      setLoadingStats(false);
    }
  }

  async function fetchRankings() {
    try {
      const [{ goleadores: g }, { arqueros: a }] = await Promise.all([
        statsApi.goleadores(19),
        statsApi.arqueros(19),
      ]);
      setGoleadores(g);
      setArqueros(a);
    } catch {
      // silent
    } finally {
      setLoadingRankings(false);
    }
  }

  function refreshAll() {
    fetchActivos();
    fetchStandings();
    fetchRankings();
  }

  useEffect(() => {
    refreshAll();
    const interval = setInterval(refreshAll, 10_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    channelRef.current?.unsubscribe();
    channelRef.current = supabase
      .channel("en-vivo")
      .on("postgres_changes", { event: "*", schema: "public", table: "partidos" }, refreshAll)
      .subscribe();
    return () => channelRef.current?.unsubscribe();
  }, []);

  // Canchas numeradas por orden de inicio
  const canchas = partidos.slice(0, 3);
  const standings = mergeStandings(baseStandings, canchas);

  // Which cancha cards to show
  const visibles: { partido: Partido; numero: number }[] =
    filtro === "todas"
      ? canchas.map((p, i) => ({ partido: p, numero: i + 1 }))
      : canchas
          .map((p, i) => ({ partido: p, numero: i + 1 }))
          .filter((c) => c.numero === filtro);

  return (
    <div className="min-h-full bg-gray-100 p-4 md:p-6 max-w-2xl mx-auto w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-700 font-bold uppercase tracking-wider text-sm">En Vivo</span>
          {lastUpdate && (
            <span className="text-gray-400 text-xs">
              · {lastUpdate.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
        </div>

        {/* Cancha filter */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
          {(["todas", 1, 2, 3] as FiltroCancha[]).map((f) => {
            const active = filtro === f;
            const label = typeof f === "number" ? `Cancha ${f}` : "Todas";
            const disponible = typeof f === "string" || canchas.length >= f;
            return (
              <button
                key={String(f)}
                onClick={() => setFiltro(f)}
                disabled={!disponible}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? "bg-gray-900 text-white shadow"
                    : disponible
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Match cards */}
      {loadingMatch ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : visibles.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">📡</div>
          <p className="text-gray-400 font-semibold">
            {filtro === "todas" ? "Sin partidos activos" : `Cancha ${filtro} sin partido activo`}
          </p>
          <p className="text-gray-600 text-sm mt-1">Se actualizará automáticamente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibles.map(({ partido, numero }) => (
            <CanchaCard key={partido.id} partido={partido} numero={numero} />
          ))}
        </div>
      )}

      {/* Live classification */}
      <TablaClasificacion standings={standings} loading={loadingStats} />

      {/* Rankings goleadores / arqueros */}
      <div className="grid grid-cols-2 gap-4">
        <TablaGoleadores goleadores={goleadores} loading={loadingRankings} />
        <TablaArqueros arqueros={arqueros} loading={loadingRankings} />
      </div>
    </div>
  );
}
