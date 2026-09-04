import { useState, useEffect, useRef, useMemo, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { edicionesApi, partidosApi, statsApi, type Partido, type Standing, type Goleador, type Arquero, type JugadorDisciplina } from "../lib/api";
import { supabase } from "../lib/supabase";
import { getTextColor, computeScores, formatElapsed } from "../components/anotador/utils";
import { useSede } from "../context/SedeContext";
import { useEquiposEdicion } from "../hooks/useCatalogo";
import type { EquipoLocal, PartidoPlayoff } from "../types/jugador";
import { CuadroPlayoffs } from "../components/common/CuadroPlayoffs";
import {
  ICONO_MODO,
  IconoAnotador,
  IconoDesempate,
  IconoArquero,
  IconoAutogol,
  IconoEmpate,
  IconoGol,
  IconoJornada,
  IconoRapido,
  IconoSalvador,
  Puesto,
  Tarjeta,
} from "../components/common/iconos";
import type { EquipoEnCancha, Evento } from "../components/anotador/types";

/**
 * Catálogo de equipos de la edición en curso. Antes venía de `constants/liga20`
 * y era accesible desde cualquier punto del archivo; ahora llega de la API, así
 * que se comparte por contexto en lugar de pasarlo por ocho niveles de props.
 */
interface CatalogoEdicion {
  equipos: EquipoLocal[];
  /** Color de camiseta según `edicion_equipos`, no un mapa escrito a mano. */
  colorDe: (id: string) => string;
}

const EquiposCtx = createContext<CatalogoEdicion>({
  equipos: [],
  colorDe: () => "#4B5563",
});
const useCatalogo = () => useContext(EquiposCtx);

// ── Helpers ───────────────────────────────────────────────────────────────────

const MODO_LABEL: Record<string, string> = {
  jornada:   "Jornada",
  cuartos:   "Cuartos de Final",
  semifinal: "Semifinal",
  final:     "Final",
};


function toLocalEquipo(
  eq: Partido["equipos"][number],
  equipos: EquipoLocal[]
): EquipoEnCancha {
  const local = equipos.find((e) => e.id === eq.equipo.id);
  return {
    equipo: local ?? { id: eq.equipo.id, nombre: eq.equipo.nombre, imagen: "" },
    jugadores: eq.jugadores,
    arqueroDesignado: eq.arqueroDesignado,
  };
}

/** Merge finalized standings + all live active match events */
function mergeStandings(base: Standing[], partidos: Partido[], equipos: EquipoLocal[]) {
  const map = new Map<string, Standing & { pos: number }>();
  for (const eq of equipos) {
    map.set(eq.id, { equipoId: eq.id, nombre: eq.nombre, victorias: 0, empates: 0, derrotas: 0, puntos: 0, pos: 0 });
  }
  for (const s of base) {
    map.set(s.equipoId, { ...s, pos: 0 });
  }
  for (const partido of partidos) {
    if (partido.modo !== "jornada") continue;
    const enCancha = partido.equipos.map((e) => toLocalEquipo(e, equipos));
    const live = computeScores(enCancha, partido.eventos);
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
  "halar-peto": "Halar peto", "falta-temeraria": "Falta temeraria",
  "falta-tactica": "Falta táctica o normal", "llegada-tarde": "Llegada tarde",
  falta: "Falta", "falta-respeto": "Falta de respeto",
};

// ── Marcador ──────────────────────────────────────────────────────────────────

function Marcador({ partido }: { partido: Partido }) {
  const { equipos: catalogo, colorDe } = useCatalogo();
  const equipos = partido.equipos.map((e) => toLocalEquipo(e, catalogo));
  const scores  = computeScores(equipos, partido.eventos);

  if (partido.modo !== "jornada") {
    const [eqA, eqB] = equipos;
    const gA = scores.get(eqA.equipo.id)?.victorias ?? 0;
    const gB = scores.get(eqB.equipo.id)?.victorias ?? 0;
    return (
      <div className="flex items-center justify-center gap-3 py-5 px-4">
        <div className="flex-1 text-right min-w-0">
          <div className="flex items-center justify-end gap-1.5">
            <div className="font-black text-lg leading-tight text-chalk">{eqA.equipo.nombre}</div>
            <div className="w-2.5 h-2.5 rounded-full shrink-0 ring-[1.5px] ring-chalk-3" style={{ backgroundColor: colorDe(eqA.equipo.id) }} />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-chalk text-4xl font-black tnum leading-none">{gA}</span>
          <span className="text-chalk-3 text-xl font-light">—</span>
          <span className="text-chalk text-4xl font-black tnum leading-none">{gB}</span>
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0 ring-[1.5px] ring-chalk-3" style={{ backgroundColor: colorDe(eqB.equipo.id) }} />
            <div className="font-black text-lg leading-tight text-chalk">{eqB.equipo.nombre}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-around py-4 px-3">
      {equipos.map((eq) => {
        const color = colorDe(eq.equipo.id);
        const s = scores.get(eq.equipo.id) ?? { victorias: 0, empates: 0, derrotas: 0, puntos: 0 };
        return (
          <div key={eq.equipo.id} className="text-center min-w-0 flex-1">
            <div className="flex items-center justify-center gap-1 leading-tight">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: color }} />
              <span className="text-chalk text-[11px] font-bold truncate">{eq.equipo.nombre}</span>
            </div>
            <div className="text-chalk text-3xl font-black tnum leading-tight mt-0.5">
              {s.puntos}<span className="text-chalk-3 text-[10px] font-normal ml-px">p</span>
            </div>
            <div className="text-chalk-3 text-[10px] mt-0.5">{s.victorias}V·{s.empates}E·{s.derrotas}D</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Feed eventos ──────────────────────────────────────────────────────────────

function FeedEventos({ eventos, equipos }: { eventos: Evento[]; equipos: EquipoEnCancha[] }) {
  const { colorDe } = useCatalogo();
  if (eventos.length === 0) return <p className="text-chalk-3 text-xs text-center py-4">Sin eventos aún</p>;
  return (
    <div className="divide-y divide-line max-h-52 overflow-y-auto">
      {[...eventos].reverse().map((ev) => {
        const t = <span className="text-chalk-3 text-[10px] w-11 shrink-0 font-mono tnum">{formatElapsed(ev.data.tiempoEnMarcador)}</span>;
        if (ev.tipo === "gol") {
          const eq = equipos.find((e) => e.equipo.id === ev.data.equipoGoleadorId);
          return (
            <div key={ev.data.id} className="flex items-center gap-2 px-4 py-2 text-sm">
              {t}<IconoGol className="size-3.5 shrink-0 text-chalk-2" />
              <span className="w-2 h-2 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: colorDe(ev.data.equipoGoleadorId) }} />
              <span className="font-medium text-chalk">{ev.data.goleador}</span>
              <span className="text-chalk-3 text-xs">· {eq?.equipo.nombre}</span>
            </div>
          );
        }
        if (ev.tipo === "autogol") {
          const eq = equipos.find((e) => e.equipo.id === ev.data.equipoAutogolId);
          return (
            <div key={ev.data.id} className="flex items-center gap-2 px-4 py-2 text-sm">
              {t}<IconoAutogol className="size-3.5 shrink-0 text-vivo" />
              <span className="text-vivo font-medium">Autogol</span>
              <span className="text-chalk-3 text-xs">· {eq?.equipo.nombre}</span>
            </div>
          );
        }
        if (ev.tipo === "empate") {
          const eqA = equipos.find((e) => e.equipo.id === ev.data.equipoAId);
          const eqB = equipos.find((e) => e.equipo.id === ev.data.equipoBId);
          return (
            <div key={ev.data.id} className="flex items-center gap-2 px-4 py-2 text-sm">
              {t}<IconoEmpate className="size-3.5 shrink-0 text-chalk-3" />
              <span className="text-amarilla text-xs">{eqA?.equipo.nombre} vs {eqB?.equipo.nombre}</span>
            </div>
          );
        }
        if (ev.tipo === "amarilla") {
          return (
            <div key={ev.data.id} className="flex items-center gap-2 px-4 py-2 text-sm">
              {t}<Tarjeta tipo="amarilla" />
              <span className="w-2 h-2 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: colorDe(ev.data.equipoId) }} />
              <span className="font-medium text-chalk">{ev.data.jugador}</span>
              <span className="text-chalk-3 text-xs">· {RAZON[ev.data.razon]}</span>
            </div>
          );
        }
        if (ev.tipo === "roja") {
          return (
            <div key={ev.data.id} className="flex items-center gap-2 px-4 py-2 text-sm">
              {t}<Tarjeta tipo="roja" />
              <span className="w-2 h-2 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: colorDe(ev.data.equipoId) }} />
              <span className="font-medium text-chalk">{ev.data.jugador}</span>
              <span className="text-vivo text-xs font-semibold">· Expulsión</span>
            </div>
          );
        }
        if (ev.tipo === "definicion") {
          const eq = equipos.find((e) => e.equipo.id === ev.data.ganadorId);
          const { penales } = ev.data;
          return (
            <div key={ev.data.id} className="px-4 py-2">
              <div className="flex items-center gap-2 text-sm">
                {t}<IconoDesempate className="size-3.5 shrink-0 text-chalk-2" />
                <span className="w-2 h-2 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: colorDe(ev.data.ganadorId) }} />
                <span className="font-medium text-chalk">{eq?.equipo.nombre}</span>
                <span className="text-chalk-3 text-xs">
                  ·{" "}
                  {ev.data.metodo === "tabla"
                    ? "pasa por tabla"
                    : `pasa en penales ${penales?.golesA ?? 0}–${penales?.golesB ?? 0}`}
                </span>
              </div>
              {/* La tanda, cobro a cobro: relleno el que entró, hueco el fallado. */}
              {penales?.tiros?.length ? (
                <ul className="mt-1.5 ml-[3.25rem] flex flex-wrap gap-x-3 gap-y-1">
                  {penales.tiros.map((tiro) => (
                    <li key={tiro.id} className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0 border"
                        style={{
                          borderColor: colorDe(tiro.equipoId),
                          backgroundColor: tiro.convertido
                            ? colorDe(tiro.equipoId)
                            : "transparent",
                        }}
                      />
                      <span className="text-chalk-2 text-[11px]">{tiro.jugador}</span>
                      {!tiro.convertido && (
                        <span className="text-chalk-3 text-[10px]">falló</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : null}
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
  const { equipos: catalogo } = useCatalogo();
  const equipos = partido.equipos.map((e) => toLocalEquipo(e, catalogo));
  return (
    <div className="bg-surface rounded-lg overflow-hidden border border-line">
      {/* Header */}
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-raised text-chalk text-xs font-black px-2 py-0.5 rounded-lg">
            Cancha {numero}
          </span>
          {(() => { const I = ICONO_MODO[partido.modo] ?? IconoJornada; return <I className="size-4 text-chalk-2" />; })()}
          <span className="text-chalk font-bold text-sm">
            {MODO_LABEL[partido.modo] ?? partido.modo}
            {partido.jornada ? ` ${partido.jornada}` : ""}
          </span>
        </div>
        {partido.anotador_nombre && (
          <span className="text-chalk-3 text-xs inline-flex items-center gap-1.5">
            <IconoAnotador className="size-3" />
            {partido.anotador_nombre}
          </span>
        )}
      </div>

      <Marcador partido={partido} />

      {partido.eventos.length > 0 && (
        <div className="border-t border-line">
          <div className="px-4 py-1.5">
            <span className="text-chalk-3 text-[10px] uppercase tracking-wider font-semibold">
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
  const { equipos: catalogo, colorDe } = useCatalogo();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex items-center gap-2">
        <IconoGol className="size-4 text-chalk-2" />
        <h2 className="text-chalk font-bold text-sm">Goleadores</h2>
      </div>
      <div className="overflow-y-auto max-h-[420px] divide-y divide-line/40 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
                <div className="w-4 h-3 bg-raised rounded-full" />
                <div className="flex-1 h-3 bg-raised rounded-full" />
                <div className="w-4 h-3 bg-raised rounded-full" />
              </div>
            ))
          : goleadores.length === 0
          ? <p className="text-chalk-3 text-xs text-center py-6">Sin goles registrados</p>
          : (
            <AnimatePresence initial={false}>
              {goleadores.map((g, i) => {
                const color = colorDe(g.equipoId);
                const textColor = getTextColor(g.equipoId);
                const hasVs = g.golesVs && Object.keys(g.golesVs).length > 0;
                const isOpen = expandedIdx === i;
                const vsEntries = hasVs
                  ? Object.entries(g.golesVs!).sort(([, a], [, b]) => b - a)
                  : [];

                return (
                  <motion.div
                    key={`${g.jugador}-${g.equipoId}`}
                    layout
                    transition={LAYOUT_TRANSITION}
                    className="border-b border-line/40 last:border-0"
                  >
                    {/* Fila principal */}
                    <div
                      className={`flex items-center gap-3 px-4 py-2.5 ${hasVs ? "cursor-pointer hover:bg-raised/30 active:bg-raised/50" : ""} transition-colors`}
                      onClick={() => hasVs && setExpandedIdx(isOpen ? null : i)}
                    >
                      <span className="text-chalk-3 text-xs tnum w-4 text-center shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-chalk text-sm font-medium truncate">{g.jugador}</div>
                        <div
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5"
                          style={{ backgroundColor: color, color: textColor }}
                        >
                          {g.equipo}
                        </div>
                      </div>
                      <span className="text-chalk font-black text-base tnum shrink-0">{g.goles}</span>
                      {hasVs && (
                        <span
                          className="text-chalk-3 text-xs ml-1 shrink-0 transition-transform duration-200"
                          style={{ display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                        >
                          ▸
                        </span>
                      )}
                    </div>

                    {/* Desglose golesVs */}
                    <AnimatePresence initial={false}>
                      {isOpen && hasVs && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-2.5 pt-0.5 space-y-1 border-t border-line/40">
                            <p className="text-chalk-3 text-[10px] uppercase tracking-wider font-semibold mb-1.5">Goles por rival</p>
                            {vsEntries.map(([rival, golesContra]) => {
                              const rivalEq = catalogo.find((e) => e.nombre === rival);
                              const rivalColor = rivalEq ? colorDe(rivalEq.id) : "#6b7280";
                              return (
                                <div key={rival} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: rivalColor }} />
                                  <span className="text-chalk-2 text-xs flex-1 truncate">{rival}</span>
                                  <span className="text-chalk text-xs font-bold tnum">{golesContra}</span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
  const { equipos: catalogo, colorDe } = useCatalogo();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex items-center gap-2">
        <IconoArquero className="size-4 text-chalk-2" />
        <h2 className="text-chalk font-bold text-sm">Valla menos vencida</h2>
      </div>
      <div className="overflow-y-auto max-h-[380px] divide-y divide-line/40 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
                <div className="w-4 h-3 bg-raised rounded-full" />
                <div className="flex-1 h-3 bg-raised rounded-full" />
                <div className="w-4 h-3 bg-raised rounded-full" />
              </div>
            ))
          : arqueros.length === 0
          ? <p className="text-chalk-3 text-xs text-center py-6">Sin datos</p>
          : (
            <AnimatePresence initial={false}>
              {arqueros.map((a, i) => {
                const color = colorDe(a.equipoId);
                const textColor = getTextColor(a.equipoId);
                const hasVs = a.golesDe && Object.keys(a.golesDe).length > 0;
                const isOpen = expandedIdx === i;
                const vsEntries = hasVs
                  ? Object.entries(a.golesDe!).sort(([, x], [, y]) => y - x)
                  : [];

                return (
                  <motion.div
                    key={`${a.arquero}-${a.equipoId}`}
                    layout
                    transition={LAYOUT_TRANSITION}
                    className="border-b border-line/40 last:border-0"
                  >
                    {/* Fila principal */}
                    <div
                      className={`flex items-center gap-3 px-4 py-2.5 ${hasVs ? "cursor-pointer hover:bg-raised/30 active:bg-raised/50" : ""} transition-colors`}
                      onClick={() => hasVs && setExpandedIdx(isOpen ? null : i)}
                    >
                      <span className="text-chalk-3 text-xs tnum w-4 text-center shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-chalk text-sm font-medium truncate">{a.arquero}</div>
                        <div
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block mt-0.5"
                          style={{ backgroundColor: color, color: textColor }}
                        >
                          {a.equipo}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-chalk-2 text-xs tnum">{a.golesRecibidos} <span className="text-chalk-3">gc</span></span>
                        {a.autogoles != null && a.autogoles > 0 && (
                          <div className="text-chalk-3 text-[10px]">{a.autogoles} ag</div>
                        )}
                      </div>
                      {hasVs && (
                        <span
                          className="text-chalk-3 text-xs ml-1 shrink-0 transition-transform duration-200"
                          style={{ display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                        >
                          ▸
                        </span>
                      )}
                    </div>

                    {/* Desglose golesDe */}
                    <AnimatePresence initial={false}>
                      {isOpen && hasVs && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-2.5 pt-0.5 space-y-1 border-t border-line/40">
                            <p className="text-chalk-3 text-[10px] uppercase tracking-wider font-semibold mb-1.5">Goles recibidos de</p>
                            {vsEntries.map(([rival, golesContra]) => {
                              const rivalEq = catalogo.find((e) => e.nombre === rival);
                              const rivalColor = rivalEq ? colorDe(rivalEq.id) : "#6b7280";
                              return (
                                <div key={rival} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: rivalColor }} />
                                  <span className="text-chalk-2 text-xs flex-1 truncate">{rival}</span>
                                  <span className="text-chalk text-xs font-bold tnum">{golesContra}</span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
      </div>
    </div>
  );
}

// ── Top goles rápidos ─────────────────────────────────────────────────────────


function TopGolesRapidos({ goleadores, loading }: { goleadores: Goleador[]; loading: boolean }) {
  const { colorDe } = useCatalogo();
  const top3 = useMemo(() => {
    return goleadores
      .flatMap((g) =>
        (g.detalle ?? []).map((d) => ({
          ...d,
          jugador: g.jugador,
          equipo: g.equipo,
          equipoId: g.equipoId,
        }))
      )
      .filter((d) => d.tiempo > 0)
      .sort((a, b) => a.tiempo - b.tiempo)
      .slice(0, 3);
  }, [goleadores]);

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex items-center gap-2">
        <IconoRapido className="size-4 text-chalk-2" />
        <h2 className="text-chalk font-bold text-sm">Gol más rápido</h2>
      </div>
      <div className="divide-y divide-line/40">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
              <div className="w-6 h-6 bg-raised rounded-full shrink-0" />
              <div className="flex-1 h-3 bg-raised rounded-full" />
              <div className="w-12 h-3 bg-raised rounded-full" />
            </div>
          ))
        ) : top3.length === 0 ? (
          <p className="text-chalk-3 text-xs text-center py-6">Sin datos</p>
        ) : (
          top3.map((g, i) => {
            const color = colorDe(g.equipoId);
            const textColor = getTextColor(g.equipoId);
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <Puesto n={i + 1} />
                <div className="flex-1 min-w-0">
                  <div className="text-chalk text-sm font-medium truncate">{g.jugador}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <div
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block"
                      style={{ backgroundColor: color, color: textColor }}
                    >
                      {g.equipo}
                    </div>
                    <span className="text-chalk-3 text-[10px]">vs {g.vs} · J{g.jornada}</span>
                  </div>
                </div>
                <div className="text-green-400 font-black text-sm tnum shrink-0 font-mono">
                  {g.tiempoFormato}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function TopGolesSalvadores({ goleadores, loading }: { goleadores: Goleador[]; loading: boolean }) {
  const { colorDe } = useCatalogo();
  const salvadores = useMemo(() => {
    return goleadores
      .flatMap((g) =>
        (g.detalle ?? []).map((d) => ({
          ...d,
          jugador: g.jugador,
          equipo: g.equipo,
          equipoId: g.equipoId,
        }))
      )
      .filter((d) => d.tiempo >= 420 && d.tiempo <= 480)
      .sort((a, b) => b.tiempo - a.tiempo)
      .slice(0, 3);
  }, [goleadores]);

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex items-center gap-2">
        <IconoSalvador className="size-4 text-chalk-2" />
        <h2 className="text-chalk font-bold text-sm">Salvadores</h2>
        <span className="text-chalk-3 text-[10px] ml-auto">Último minuto</span>
      </div>
      <div className="divide-y divide-line/40">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 animate-pulse">
              <div className="w-6 h-6 bg-raised rounded-full shrink-0" />
              <div className="flex-1 h-3 bg-raised rounded-full" />
              <div className="w-12 h-3 bg-raised rounded-full" />
            </div>
          ))
        ) : salvadores.length === 0 ? (
          <p className="text-chalk-3 text-xs text-center py-6">Sin goles de último minuto</p>
        ) : (
          salvadores.map((g, i) => {
            const color = colorDe(g.equipoId);
            const textColor = getTextColor(g.equipoId);
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <Puesto n={i + 1} />
                <div className="flex-1 min-w-0">
                  <div className="text-chalk text-sm font-medium truncate">{g.jugador}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <div
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block"
                      style={{ backgroundColor: color, color: textColor }}
                    >
                      {g.equipo}
                    </div>
                    <span className="text-chalk-3 text-[10px]">vs {g.vs} · J{g.jornada}</span>
                  </div>
                </div>
                <div className="text-orange-400 font-black text-sm tnum shrink-0 font-mono">
                  {g.tiempoFormato}
                </div>
              </div>
            );
          })
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
  const { equipos: catalogo, colorDe } = useCatalogo();
  const { numeroSede } = useSede();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-vivo animate-pulse" />
        <h2 className="text-chalk font-bold text-sm">Clasificación en vivo</h2>
        {/* El número visible de la edición, no `ediciones.numero`: en Bogotá
            la clave interna es 101 y aquí se lee «Edición 1». */}
        {numeroSede != null && (
          <span className="text-chalk-3 text-xs ml-auto">Edición {numeroSede}</span>
        )}
      </div>

      {/* Header fijo */}
      <div className="flex items-center gap-0 px-3 py-2 border-b border-line/50">
        <span className={`${COL.pos} text-chalk-3 text-xs font-semibold text-left`}>#</span>
        <span className={`${COL.equipo} text-chalk-3 text-xs font-semibold`}>Equipo</span>
        <span className={`${COL.stat} text-chalk-3 text-xs font-semibold`}>PJ</span>
        <span className={`${COL.stat} text-chalk-3 text-xs font-semibold`}>V</span>
        <span className={`${COL.stat} text-chalk-3 text-xs font-semibold`}>E</span>
        <span className={`${COL.stat} text-chalk-3 text-xs font-semibold`}>D</span>
        <span className={`${COL.pts} text-chalk-3 text-xs font-black`}>Pts</span>
      </div>

      {/* Filas animadas */}
      <div className="divide-y divide-line/40">
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center gap-0 px-3 py-2.5 animate-pulse">
                <div className={`${COL.pos}`}><div className="h-3 w-3 bg-raised rounded-full mx-auto" /></div>
                <div className={`${COL.equipo} pr-2`}><div className="h-3 bg-raised rounded-full" /></div>
                <div className={`${COL.stat}`}><div className="h-3 w-4 bg-raised rounded-full mx-auto" /></div>
                <div className={`${COL.stat}`}><div className="h-3 w-4 bg-raised rounded-full mx-auto" /></div>
                <div className={`${COL.stat}`}><div className="h-3 w-4 bg-raised rounded-full mx-auto" /></div>
                <div className={`${COL.stat}`}><div className="h-3 w-4 bg-raised rounded-full mx-auto" /></div>
                <div className={`${COL.pts}`}><div className="h-4 w-5 bg-raised rounded-full mx-auto" /></div>
              </div>
            ))
          : (
            <AnimatePresence initial={false}>
              {standings.map((s) => {
                const color = colorDe(s.equipoId);
                const hasVs = s.vsRivales && Object.keys(s.vsRivales).length > 0;
                const hasJornadas = s.porJornada && Object.keys(s.porJornada).length > 0;
                const expandible = hasVs || hasJornadas;
                const isOpen = expandedId === s.equipoId;
                const vsEntries = hasVs
                  ? Object.entries(s.vsRivales!).sort(([, a], [, b]) => b.victorias - a.victorias || b.empates - a.empates)
                  : [];

                return (
                  <motion.div
                    key={s.equipoId}
                    layout
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="border-b border-line/40 last:border-0"
                  >
                    {/* Fila principal */}
                    <div
                      className={`flex items-center gap-0 px-3 py-2.5 ${expandible ? "cursor-pointer hover:bg-raised/30 active:bg-raised/50" : ""} transition-colors`}
                      onClick={() => expandible && setExpandedId(isOpen ? null : s.equipoId)}
                    >
                      <span className={`${COL.pos} text-chalk-3 text-xs tnum`}>{s.pos}</span>
                      <div className={`${COL.equipo} flex items-center gap-2 pr-1`}>
                        <div className="w-2 h-2 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: color }} />
                        <span className="text-chalk text-sm font-medium truncate">{s.nombre}</span>
                        {expandible && (
                          <span
                            className="text-chalk-3 text-[10px] shrink-0 transition-transform duration-200"
                            style={{ display: "inline-block", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                          >
                            ▸
                          </span>
                        )}
                      </div>
                      <span className={`${COL.stat} text-chalk-2 tnum text-xs`}>{s.victorias + s.empates + s.derrotas}</span>
                      <span className={`${COL.stat} text-chalk tnum text-xs`}>{s.victorias}</span>
                      <span className={`${COL.stat} text-chalk tnum text-xs`}>{s.empates}</span>
                      <span className={`${COL.stat} text-chalk tnum text-xs`}>{s.derrotas}</span>
                      <span className={`${COL.pts} text-chalk font-black text-base tnum`}>{s.puntos}</span>
                    </div>

                    {/* Desglose vsRivales */}
                    <AnimatePresence initial={false}>
                      {isOpen && hasVs && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-2.5 pt-1 border-t border-line/40 space-y-3">

                            {/* Por jornada */}
                            {s.porJornada && Object.keys(s.porJornada).length > 0 && (
                              <div>
                                <p className="text-chalk-3 text-[10px] uppercase tracking-wider font-semibold mb-1.5">Por jornada</p>
                                <div className="flex items-center gap-1 mb-1 px-1">
                                  <span className="w-12 text-chalk-3 text-[10px]">Jornada</span>
                                  <span className="w-5 text-center text-green-600 text-[10px] font-bold">V</span>
                                  <span className="w-5 text-center text-yellow-600 text-[10px] font-bold">E</span>
                                  <span className="w-5 text-center text-red-600 text-[10px] font-bold">D</span>
                                  <span className="flex-1 text-right text-chalk-3 text-[10px] font-bold pr-1">Pts</span>
                                </div>
                                {Object.entries(s.porJornada)
                                  .sort(([a], [b]) => Number(a) - Number(b))
                                  .map(([jornada, stat]) => (
                                    <div key={jornada} className="flex items-center gap-1 py-0.5 px-1">
                                      <span className="w-12 text-chalk-3 text-xs">J{jornada}</span>
                                      <span className="w-5 text-center text-green-400 text-xs font-bold tnum">{stat.victorias}</span>
                                      <span className="w-5 text-center text-amarilla text-xs tnum">{stat.empates}</span>
                                      <span className="w-5 text-center text-vivo text-xs tnum">{stat.derrotas}</span>
                                      <span className="flex-1 text-right text-chalk text-xs font-black tnum pr-1">{stat.puntos}</span>
                                    </div>
                                  ))}
                              </div>
                            )}

                            {/* Head to head */}
                            {hasVs && (
                              <div>
                                <p className="text-chalk-3 text-[10px] uppercase tracking-wider font-semibold mb-1.5">Head to head</p>
                                <div className="flex items-center gap-2 mb-1 px-1">
                                  <span className="flex-1 text-chalk-3 text-[10px]">Rival</span>
                                  <span className="w-5 text-center text-green-600 text-[10px] font-bold">V</span>
                                  <span className="w-5 text-center text-yellow-600 text-[10px] font-bold">E</span>
                                  <span className="w-5 text-center text-red-600 text-[10px] font-bold">D</span>
                                </div>
                                {vsEntries.map(([rival, rec]) => {
                                  const rivalEq = catalogo.find((e) => e.nombre === rival);
                                  const rivalColor = rivalEq ? colorDe(rivalEq.id) : "#6b7280";
                                  return (
                                    <div key={rival} className="flex items-center gap-2 py-0.5 px-1">
                                      <div className="w-1.5 h-1.5 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: rivalColor }} />
                                      <span className="text-chalk-2 text-xs flex-1 truncate">{rival}</span>
                                      <span className="w-5 text-center text-green-400 text-xs font-bold tnum">{rec.victorias}</span>
                                      <span className="w-5 text-center text-amarilla text-xs tnum">{rec.empates}</span>
                                      <span className="w-5 text-center text-vivo text-xs tnum">{rec.derrotas}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
      </div>
    </div>
  );
}

// ── Disciplina ────────────────────────────────────────────────────────────────

const RAZON_LABEL: Record<string, string> = {
  "halar-peto":      "Halar peto",
  "falta-temeraria": "Falta temeraria",
  "falta-tactica":   "Falta táctica o normal",
  "llegada-tarde":   "Llegada tarde",
  "falta":           "Falta",
  "falta-respeto":   "Falta de respeto",
  "roja":            "Expulsión directa",
};

function TablaDisciplina({ disciplina, loading }: { disciplina: JugadorDisciplina[]; loading: boolean }) {
  const { equipos: catalogo, colorDe } = useCatalogo();
  const [expandedEquipo, setExpandedEquipo] = useState<string | null>(null);
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  const equipoStats = catalogo
    .map((eq) => {
      const jugadores = disciplina.filter((j) => j.equipoId === eq.id);
      return {
        eq,
        jugadores,
        totalAmarillas: jugadores.reduce((s, j) => s + j.amarillas, 0),
        totalRojas:     jugadores.reduce((s, j) => s + j.rojas, 0),
      };
    })
    .filter((e) => e.jugadores.length > 0)
    .sort((a, b) => b.totalRojas - a.totalRojas || b.totalAmarillas - a.totalAmarillas);

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-line flex items-center gap-2">
        <Tarjeta tipo="amarilla" className="h-4 w-3" />
        <h2 className="text-chalk font-bold text-sm">Disciplina</h2>
      </div>

      <div className="divide-y divide-line/40">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                <div className="w-2.5 h-2.5 bg-raised rounded-full" />
                <div className="flex-1 h-3 bg-raised rounded-full" />
                <div className="w-12 h-3 bg-raised rounded-full" />
              </div>
            ))
          : equipoStats.length === 0
          ? <p className="text-chalk-3 text-xs text-center py-6">Sin tarjetas registradas</p>
          : equipoStats.map(({ eq, jugadores, totalAmarillas, totalRojas }) => {
              const color = colorDe(eq.id);
              const equipoOpen = expandedEquipo === eq.id;

              return (
                <div key={eq.id} className="border-b border-line/40 last:border-0">
                  {/* Fila equipo */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-raised/30 transition-colors"
                    onClick={() => { setExpandedEquipo(equipoOpen ? null : eq.id); setExpandedPlayer(null); }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 ring-[1.5px] ring-chalk-3" style={{ backgroundColor: color }} />
                    <span className="text-chalk text-sm font-medium flex-1">{eq.nombre}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {totalAmarillas > 0 && <span className="text-amarilla text-xs font-bold inline-flex items-center gap-1"><Tarjeta tipo="amarilla" />{totalAmarillas}</span>}
                      {totalRojas     > 0 && <span className="text-vivo text-xs font-bold inline-flex items-center gap-1"><Tarjeta tipo="roja" />{totalRojas}</span>}
                    </div>
                    <span
                      className="text-chalk-3 text-[10px] shrink-0 transition-transform duration-200"
                      style={{ display: "inline-block", transform: equipoOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                    >▸</span>
                  </div>

                  {/* Jugadores del equipo */}
                  <AnimatePresence initial={false}>
                    {equipoOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-line/40 divide-y divide-line/20">
                          {jugadores.map((j) => {
                            const playerKey = `${eq.id}-${j.jugador}`;
                            const playerOpen = expandedPlayer === playerKey;
                            return (
                              <div key={playerKey}>
                                <div
                                  className="flex items-center gap-3 pl-8 pr-4 py-2 cursor-pointer hover:bg-raised/20 transition-colors"
                                  onClick={() => setExpandedPlayer(playerOpen ? null : playerKey)}
                                >
                                  <span className="text-chalk-2 text-xs flex-1 truncate">{j.jugador}</span>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {j.amarillas > 0 && <span className="text-amarilla text-xs font-bold inline-flex items-center gap-1"><Tarjeta tipo="amarilla" />{j.amarillas}</span>}
                                    {j.rojas     > 0 && <span className="text-vivo text-xs font-bold inline-flex items-center gap-1"><Tarjeta tipo="roja" />{j.rojas}</span>}
                                  </div>
                                  <span
                                    className="text-chalk-2 text-[10px] shrink-0 transition-transform duration-200"
                                    style={{ display: "inline-block", transform: playerOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                                  >▸</span>
                                </div>

                                {/* Detalle tarjetas del jugador */}
                                <AnimatePresence initial={false}>
                                  {playerOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.18, ease: "easeInOut" }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pl-10 pr-4 pb-2 pt-1 space-y-1 border-t border-line/20">
                                        {j.detalle.map((d, di) => (
                                          <div key={di} className="flex items-center gap-2">
                                            <Tarjeta tipo={d.razon === "roja" ? "roja" : "amarilla"} />
                                            <span className="text-chalk-2 text-xs flex-1">{RAZON_LABEL[d.razon] ?? d.razon}</span>
                                            {d.jornada != null && <span className="text-chalk-3 text-[10px] shrink-0">J{d.jornada}</span>}
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
      </div>
    </div>
  );
}

// ── Torneo Regular ────────────────────────────────────────────────────────────

type Standings = ReturnType<typeof mergeStandings>;

function TorneoRegularSection({
  standings,
  disciplina,
  loading,
}: {
  standings: Standings;
  disciplina: JugadorDisciplina[];
  loading: boolean;
}) {
  const { colorDe } = useCatalogo();
  const [jornadaAbierta, setJornadaAbierta] = useState<string | null>(null);

  const jornadasDisponibles = useMemo(() => {
    const keys = new Set<string>();
    for (const s of standings) {
      if (s.porJornada) Object.keys(s.porJornada).forEach((k) => keys.add(k));
    }
    return [...keys].sort((a, b) => Number(a) - Number(b));
  }, [standings]);

  const teamDisciplina = useMemo(() => {
    const map = new Map<string, { equipoId: string; equipo: string; amarillas: number; rojas: number }>();
    for (const d of disciplina) {
      const prev = map.get(d.equipoId) ?? { equipoId: d.equipoId, equipo: d.equipo, amarillas: 0, rojas: 0 };
      map.set(d.equipoId, { ...prev, amarillas: prev.amarillas + d.amarillas, rojas: prev.rojas + d.rojas });
    }
    return [...map.values()].sort((a, b) => (b.amarillas + b.rojas * 2) - (a.amarillas + a.rojas * 2));
  }, [disciplina]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-surface rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">

      {/* Banner */}
      <div className="bg-surface rounded-lg px-4 py-3 border border-line flex items-center justify-between">
        <div>
          <h2 className="text-chalk font-bold text-sm">Torneo Regular · Liga #20</h2>
          <p className="text-chalk-3 text-xs mt-0.5">Premier League · 6 Jornadas · 9 Equipos</p>
        </div>
        <span className="bg-green-900/40 text-green-400 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border border-green-800/50">
          En curso
        </span>
      </div>

      {/* Jornada a Jornada */}
      {jornadasDisponibles.length > 0 && (
        <div className="bg-surface rounded-lg overflow-hidden border border-line">
          <div className="px-4 py-2.5 border-b border-line">
            <h3 className="text-chalk text-xs font-bold uppercase tracking-wider">Jornada a Jornada</h3>
          </div>
          <div className="divide-y divide-line/60">
            {jornadasDisponibles.map((j) => {
              const abierta = jornadaAbierta === j;
              const jornadaStandings = standings
                .map((s) => ({
                  nombre: s.nombre,
                  equipoId: s.equipoId,
                  ...(s.porJornada?.[j] ?? { victorias: 0, empates: 0, derrotas: 0, puntos: 0 }),
                }))
                .filter((s) => s.victorias + s.empates + s.derrotas > 0)
                .sort((a, b) => b.puntos - a.puntos || b.victorias - a.victorias);
              const lider = jornadaStandings[0];

              return (
                <div key={j}>
                  <button
                    onClick={() => setJornadaAbierta(abierta ? null : j)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-raised/40 transition-colors text-left"
                  >
                    <span className="text-chalk text-xs font-semibold">Jornada {j}</span>
                    <div className="flex items-center gap-2.5">
                      {lider && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorDe(lider.equipoId) }} />
                          <span className="text-chalk-3 text-[10px]">{lider.nombre} lideró</span>
                        </div>
                      )}
                      <motion.span
                        animate={{ rotate: abierta ? 180 : 0 }}
                        transition={{ duration: 0.18 }}
                        className="text-chalk-3 text-[10px] inline-block"
                      >
                        ▼
                      </motion.span>
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {abierta && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 space-y-1.5">
                          {jornadaStandings.map((s, idx) => (
                            <div key={s.equipoId} className="flex items-center gap-2 text-[11px]">
                              <span className="text-chalk-3 w-4 text-center shrink-0 tnum">{idx + 1}</span>
                              <span className="w-1.5 h-1.5 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: colorDe(s.equipoId) }} />
                              <span className="text-chalk-2 flex-1 truncate">{s.nombre}</span>
                              <div className="flex gap-2 tnum shrink-0">
                                <span className="text-green-400">{s.victorias}V</span>
                                <span className="text-amarilla">{s.empates}E</span>
                                <span className="text-vivo">{s.derrotas}D</span>
                                <span className="text-chalk font-bold w-6 text-right">{s.puntos}p</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disciplina del Torneo */}
      {(teamDisciplina.length > 0 || disciplina.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-surface rounded-lg overflow-hidden border border-line">
            <div className="px-4 py-2.5 border-b border-line">
              <h3 className="text-chalk text-xs font-bold uppercase tracking-wider">Tarjetas por Equipo</h3>
            </div>
            <div className="divide-y divide-line/60">
              {teamDisciplina.slice(0, 6).map((t) => (
                <div key={t.equipoId} className="flex items-center gap-2.5 px-4 py-2.5">
                  <span className="w-2 h-2 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: colorDe(t.equipoId) }} />
                  <span className="text-chalk-2 text-xs flex-1 truncate">{t.equipo}</span>
                  <div className="flex gap-1.5 shrink-0">
                    {t.amarillas > 0 && (
                      <span className="text-[11px] bg-yellow-500/15 text-yellow-300 px-1.5 py-0.5 rounded font-bold tnum">{t.amarillas}🟡</span>
                    )}
                    {t.rojas > 0 && (
                      <span className="text-[11px] bg-red-500/15 text-red-300 px-1.5 py-0.5 rounded font-bold tnum">{t.rojas}🔴</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface rounded-lg overflow-hidden border border-line">
            <div className="px-4 py-2.5 border-b border-line">
              <h3 className="text-chalk text-xs font-bold uppercase tracking-wider">Top Tarjeteados</h3>
            </div>
            <div className="divide-y divide-line/60">
              {[...disciplina]
                .sort((a, b) => (b.amarillas + b.rojas * 2) - (a.amarillas + a.rojas * 2))
                .slice(0, 6)
                .map((d) => (
                  <div key={d.jugador} className="flex items-center gap-2.5 px-4 py-2.5">
                    <span className="w-2 h-2 rounded-full shrink-0 ring-1 ring-chalk-3" style={{ backgroundColor: colorDe(d.equipoId) }} />
                    <span className="text-chalk-2 text-xs flex-1 truncate">{d.jugador}</span>
                    <div className="flex gap-1 shrink-0">
                      {d.amarillas > 0 && <span className="text-yellow-300 text-[11px] font-bold tnum">{d.amarillas}🟡</span>}
                      {d.rojas > 0 && <span className="text-red-300 text-[11px] font-bold tnum">{d.rojas}🔴</span>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ── Playoff ───────────────────────────────────────────────────────────────────

function PlayoffMatchup({
  equipoA,
  posA,
  equipoB,
  posB,
  label,
}: {
  equipoA: Standings[number];
  posA: number;
  equipoB: Standings[number];
  posB: number;
  label: string;
}) {
  const { colorDe } = useCatalogo();
  const colorA = colorDe(equipoA.equipoId);
  const colorB = colorDe(equipoB.equipoId);

  const h2hDirecto = equipoA.vsRivales?.[equipoB.nombre];
  const h2hInverso = equipoB.vsRivales?.[equipoA.nombre];
  const h2h = h2hDirecto
    ?? (h2hInverso
      ? { victorias: h2hInverso.derrotas, empates: h2hInverso.empates, derrotas: h2hInverso.victorias }
      : null);

  const favoritoEquipo = equipoA.puntos >= equipoB.puntos ? equipoA : equipoB;
  const diferencia = Math.abs(equipoA.puntos - equipoB.puntos);

  return (
    <div className="bg-surface rounded-lg overflow-hidden border border-line">
      <div className="px-4 py-2 border-b border-line">
        <span className="text-ink bg-chalk text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg">
          {label}
        </span>
      </div>

      <div className="px-4 py-5 flex items-center gap-2">
        <div className="flex-1 text-center space-y-1 min-w-0">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colorA }} />
            <span className="text-chalk font-bold text-sm leading-tight truncate">{equipoA.nombre}</span>
          </div>
          <p className="text-chalk-3 text-[11px] tnum">#{posA} · {equipoA.puntos} pts</p>
          <p className="text-chalk-3 text-[10px] tnum">{equipoA.victorias}V {equipoA.empates}E {equipoA.derrotas}D</p>
        </div>

        <div className="shrink-0 px-2">
          <span className="text-chalk-2 font-bold text-lg">vs</span>
        </div>

        <div className="flex-1 text-center space-y-1 min-w-0">
          <div className="flex items-center justify-center gap-1.5">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colorB }} />
            <span className="text-chalk font-bold text-sm leading-tight truncate">{equipoB.nombre}</span>
          </div>
          <p className="text-chalk-3 text-[11px] tnum">#{posB} · {equipoB.puntos} pts</p>
          <p className="text-chalk-3 text-[10px] tnum">{equipoB.victorias}V {equipoB.empates}E {equipoB.derrotas}D</p>
        </div>
      </div>

      <div className="px-4 pb-4 border-t border-line/60 pt-3 space-y-3">
        <div>
          <p className="text-chalk-3 text-[10px] uppercase tracking-wider font-semibold mb-2">Cara a cara · historial</p>
          {h2h ? (
            <div className="flex items-center gap-2">
              <span className="text-chalk-2 text-[11px] flex-1 text-right truncate">{equipoA.nombre}</span>
              <div className="flex gap-1.5 shrink-0 text-[11px] tnum font-bold">
                <span className="text-green-400">{h2h.victorias}V</span>
                <span className="text-amarilla">{h2h.empates}E</span>
                <span className="text-vivo">{h2h.derrotas}D</span>
              </div>
              <span className="text-chalk-2 text-[11px] flex-1 text-left truncate">{equipoB.nombre}</span>
            </div>
          ) : (
            <p className="text-chalk-3 text-xs">Sin historial directo</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-chalk-3 text-[10px]">Favorito por tabla:</span>
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: colorDe(favoritoEquipo.equipoId), color: getTextColor(favoritoEquipo.equipoId) }}
          >
            {favoritoEquipo.nombre}
          </span>
          {diferencia > 0 && (
            <span className="text-chalk-3 text-[10px]">+{diferencia} pts</span>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayoffSection({
  standings,
  llaves,
  numeroSede,
  loading,
}: {
  standings: Standings;
  llaves: PartidoPlayoff[];
  numeroSede: number | null;
  loading: boolean;
}) {
  const { equipos: catalogo, colorDe } = useCatalogo();

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-44 bg-surface rounded-lg animate-pulse" />)}
      </div>
    );
  }

  // El cuadro real manda en cuanto se juega la primera llave; hasta entonces
  // esta pantalla solo puede proyectar los cruces a partir de la tabla.
  const empezado = llaves.length > 0;
  const hayFinal = llaves.some((ll) => ll.ronda === "final" && !ll.en_juego && ll.ganador_slug);
  const nombreDe = (slug: string) =>
    catalogo.find((e) => e.id === slug)?.nombre ??
    llaves.find((ll) => ll.equipo1_slug === slug)?.equipo1_nombre ??
    llaves.find((ll) => ll.equipo2_slug === slug)?.equipo2_nombre ??
    slug.replace(/-/g, " ");

  if (empezado) {
    const campeon = llaves.find((ll) => ll.ronda === "final")?.ganador_slug ?? null;
    return (
      <div className="space-y-5 max-w-4xl mx-auto">
        <div className="bg-surface rounded-lg px-4 py-3 border border-line">
          <h2 className="text-chalk font-bold text-sm">
            Cuadro final{numeroSede != null ? ` · Liga #${numeroSede}` : ""}
          </h2>
          <p className="text-chalk-3 text-xs mt-0.5">
            {hayFinal
              ? "Cuadro completo. Queda guardado en la edición."
              : "Se actualiza con cada llave que termina."}
          </p>
        </div>

        <div className="bg-surface rounded-lg px-4 py-4 border border-line">
          <CuadroPlayoffs
            llaves={llaves}
            nombreDe={nombreDe}
            colorDe={(slug) => colorDe(slug)}
            campeonSlug={campeon}
            ordenTabla={standings.map((s) => s.equipoId)}
          />
        </div>
      </div>
    );
  }

  if (standings.length < 6) {
    return (
      <div className="bg-surface rounded-lg py-10 text-center border border-line">
        <p className="text-chalk-3 text-sm">Clasificación insuficiente para definir el playoff.</p>
      </div>
    );
  }

  const [p1, p2, p3, p4, p5, p6] = standings;

  return (
    <div className="space-y-5 max-w-2xl mx-auto">

      {/* Banner */}
      <div className="bg-surface rounded-lg px-4 py-3 border border-line flex items-center justify-between">
        <div>
          <h2 className="text-chalk font-bold text-sm">
            Playoff{numeroSede != null ? ` · Liga #${numeroSede}` : ""}
          </h2>
          <p className="text-chalk-3 text-xs mt-0.5">#3–#6 juegan playoff · #1 y #2 van directo a semis</p>
        </div>
        <span className="bg-amber-900/30 text-amber-400 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border border-amber-800/30">
          Próxima sesión
        </span>
      </div>

      {/* Clasificados directos a Semifinales */}
      <div className="bg-surface rounded-lg overflow-hidden border border-line">
        <div className="px-4 py-2.5 border-b border-line">
          <h3 className="text-chalk text-xs font-bold uppercase tracking-wider">Pasan Directo a Semifinales</h3>
        </div>
        <div className="flex gap-3 px-4 py-4">
          {[p1, p2].map((s, i) => {
            const color = colorDe(s.equipoId);
            return (
              <div key={s.equipoId} className="flex-1 text-center">
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border"
                  style={{ borderColor: `${color}50`, backgroundColor: `${color}18` }}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 ring-[1.5px] ring-chalk-3" style={{ backgroundColor: color }} />
                  <span className="text-chalk text-xs font-bold truncate">{s.nombre}</span>
                </div>
                <p className="text-chalk-3 text-[10px] mt-1.5 tnum">#{i + 1} · {s.puntos} pts</p>
              </div>
            );
          })}
        </div>
        <div className="px-4 pb-3">
          <p className="text-chalk-3 text-[10px]">#1 y #2 esperan en semifinales a los ganadores del playoff.</p>
        </div>
      </div>

      {/* Playoff */}
      <div>
        <p className="text-chalk-3 text-[11px] uppercase tracking-wider font-semibold mb-3">Playoff · Fase previa</p>
        <div className="space-y-3">
          <PlayoffMatchup equipoA={p3} posA={3} equipoB={p6} posB={6} label="Playoff 1 · #3 vs #6" />
          <PlayoffMatchup equipoA={p4} posA={4} equipoB={p5} posB={5} label="Playoff 2 · #4 vs #5" />
        </div>
      </div>

      {/* Nota de formato */}
      <div className="bg-surface rounded-lg px-4 py-3 border border-line">
        <p className="text-chalk-3 text-xs leading-relaxed">
          Los ganadores del playoff avanzan a semifinales donde se enfrentan a #1 y #2. El formato exacto se define al inicio de la sesión.
        </p>
      </div>

    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type FiltroCancha = "todas" | 1 | 2 | 3;

type Tab = "en-vivo" | "torneo-regular" | "playoff";

export function EnVivoPage() {
  const [tab, setTab]                   = useState<Tab>("en-vivo");
  const [partidos, setPartidos]         = useState<Partido[]>([]);
  const [baseStandings, setBase]        = useState<Standing[]>([]);
  const [goleadores, setGoleadores]     = useState<Goleador[]>([]);
  const [arqueros, setArqueros]         = useState<Arquero[]>([]);
  const [disciplina, setDisciplina]     = useState<JugadorDisciplina[]>([]);
  const [playoffs, setPlayoffs]         = useState<PartidoPlayoff[]>([]);
  const [loadingPlayoffs, setLoadingPlayoffs] = useState(true);
  const [filtro, setFiltro]             = useState<FiltroCancha>("todas");
  const [loadingMatch, setLoadingMatch] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRankings, setLoadingRankings] = useState(true);
  const [lastUpdate, setLastUpdate]     = useState<Date | null>(null);
  const { sede, sedeId, edicionActual, numeroSede }  = useSede();
  const { equipos, sede_id: sedeDeLosEquipos, locales: catalogo, colorDe, loading: loadingEquipos } =
    useEquiposEdicion(edicionActual);

  /**
   * Una edición recién abierta existe pero todavía no tiene equipos: no hay
   * partidos que mirar ni clasificación que calcular. Se distingue de «no hay
   * edición» porque aquí la liga sí va a empezar.
   *
   * Se comprueba de qué sede son los equipos cargados, y no solo si hay
   * alguno: al cambiar de ciudad hay un render en que `edicionActual` ya es la
   * nueva pero `equipos` todavía son los de la anterior. Sin este contraste se
   * dispara una tanda de peticiones contra una edición que no ha empezado.
   */
  const edicionArrancada =
    edicionActual != null && sedeDeLosEquipos === sedeId && equipos.length > 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelRef = useRef<any>(null);

  async function fetchActivos(edicion: number) {
    try {
      const { enVivo } = await partidosApi.getEnVivo(edicion);
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

  async function fetchStandings(edicion: number) {
    try {
      const { standings } = await statsApi.clasificacion(edicion);
      setBase(standings);
    } catch {
      // silent
    } finally {
      setLoadingStats(false);
    }
  }

  async function fetchRankings(edicion: number) {
    try {
      const [{ goleadores: g }, { arqueros: a }, { disciplina: d }] = await Promise.all([
        statsApi.goleadores(edicion),
        statsApi.arqueros(edicion),
        statsApi.disciplina(edicion),
      ]);
      setGoleadores(g);
      setArqueros(a);
      setDisciplina(d);
    } catch {
      // silent
    } finally {
      setLoadingRankings(false);
    }
  }

  /**
   * El cuadro final se pide aparte y solo con la pestaña abierta: sale de
   * `/historico`, que es una consulta bastante más pesada que las del directo
   * y no tendría sentido repetirla cada 8s para una pantalla que nadie mira.
   */
  useEffect(() => {
    if (!edicionArrancada || tab !== "playoff") return;

    const edicion = edicionActual;
    let vigente = true;

    const traer = async () => {
      try {
        const historico = await edicionesApi.historico(edicion);
        if (vigente) setPlayoffs(historico.playoffs ?? []);
      } catch {
        // silent
      } finally {
        if (vigente) setLoadingPlayoffs(false);
      }
    };

    traer();
    const intervalo = setInterval(traer, 10_000);
    return () => {
      vigente = false;
      clearInterval(intervalo);
    };
  }, [edicionActual, edicionArrancada, tab]);

  useEffect(() => {
    // Si la ciudad no está jugando no se pide nada, no se hace polling cada 8s
    // y no se abre el canal de Realtime. Antes esta pantalla sondeaba la API
    // indefinidamente aunque no hubiera absolutamente nada que mostrar.
    if (!edicionArrancada) {
      setPartidos([]);
      setBase([]);
      setGoleadores([]);
      setArqueros([]);
      setDisciplina([]);
      setPlayoffs([]);
      setLoadingMatch(false);
      setLoadingStats(false);
      setLoadingRankings(false);
      setLoadingPlayoffs(false);
      return;
    }

    const edicion = edicionActual;
    const refrescar = () => {
      fetchActivos(edicion);
      fetchStandings(edicion);
      fetchRankings(edicion);
    };

    refrescar();

    // Polling fallback cada 8s — garantiza actualizaciones aunque Realtime se caiga
    const intervalo = setInterval(refrescar, 8_000);

    // Realtime: notifica cambios al instante cuando el canal está estable
    if (supabase) {
      channelRef.current = supabase
        .channel("en-vivo")
        .on("postgres_changes", { event: "*", schema: "public", table: "partidos" }, refrescar)
        .subscribe();
    }

    return () => {
      clearInterval(intervalo);
      channelRef.current?.unsubscribe();
    };
  }, [edicionActual, edicionArrancada]);

  // Canchas numeradas por orden de inicio
  const canchas = partidos.slice(0, 3);
  const standings = mergeStandings(baseStandings, canchas, catalogo);

  // Which cancha cards to show
  const visibles: { partido: Partido; numero: number }[] =
    filtro === "todas"
      ? canchas.map((p, i) => ({ partido: p, numero: i + 1 }))
      : canchas
          .map((p, i) => ({ partido: p, numero: i + 1 }))
          .filter((c) => c.numero === filtro);

  const CanchaFilter = (
    <div className="flex gap-1 bg-surface rounded-md p-1 border border-line w-fit">
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
              active ? "bg-surface text-chalk shadow"
              : disponible ? "text-chalk-3 hover:text-chalk"
              : "text-chalk-2 cursor-not-allowed"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  const hayPartidos = loadingMatch || visibles.length > 0;

  const MatchCards = hayPartidos ? (
    <div className="space-y-3">
      {loadingMatch
        ? [1, 2, 3].map((i) => <div key={i} className="h-36 bg-surface rounded-lg animate-pulse" />)
        : visibles.map(({ partido, numero }) => (
            <CanchaCard key={partido.id} partido={partido} numero={numero} />
          ))}
    </div>
  ) : null;

  const Tabs = (
    <div className="flex gap-1 bg-surface rounded-md p-1 border border-line w-fit">
      <button
        onClick={() => setTab("en-vivo")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          tab === "en-vivo" ? "bg-surface text-chalk shadow" : "text-chalk-3 hover:text-chalk"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-vivo animate-pulse" />
        En Vivo
      </button>
      <button
        onClick={() => setTab("torneo-regular")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          tab === "torneo-regular" ? "bg-surface text-chalk shadow" : "text-chalk-3 hover:text-chalk"
        }`}
      >
        Torneo Regular
      </button>
      <button
        onClick={() => setTab("playoff")}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          tab === "playoff" ? "bg-surface text-chalk shadow" : "text-chalk-3 hover:text-chalk"
        }`}
      >
        Playoff
      </button>
    </div>
  );

  // Sin liga en marcha no hay en vivo, ni clasificación, ni rankings: pintar la
  // pantalla entera con tablas vacías haría creer que algo falló.
  if (!edicionArrancada && !loadingEquipos) {
    const sinEdicion = edicionActual == null;
    return (
      <div className="min-h-full bg-ink p-4 md:p-6">
        <div className="mx-auto mt-16 max-w-md rounded-md border border-line bg-surface px-4 py-6 text-center">
          <p className="font-cond text-base text-chalk">
            {sinEdicion
              ? `${sede?.nombre ?? "Esta ciudad"} no tiene una edición en curso`
              : `La edición de ${sede?.nombre ?? "esta ciudad"} todavía no ha arrancado`}
          </p>
          <p className="mt-2 text-sm text-chalk-3">
            {sinEdicion
              ? "Cuando arranque la liga aquí, los partidos aparecerán en esta pantalla."
              : "Faltan los equipos. En cuanto se registren y empiece la primera jornada, los partidos aparecerán aquí."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <EquiposCtx.Provider value={{ equipos: catalogo, colorDe }}>
    <div className="min-h-full bg-ink p-4 md:p-6 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {Tabs}
        {tab === "en-vivo" && lastUpdate && (
          <span className="text-chalk-2 text-xs">
            Actualizado · {lastUpdate.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        )}
      </div>

      {tab === "en-vivo" && (
        <>
          {/* Filtro visible solo en mobile cuando hay partidos */}
          {hayPartidos && <div className="lg:hidden">{CanchaFilter}</div>}

          {/* ── Mobile / Tablet: columna única ── */}
          <div className="flex flex-col gap-4 lg:hidden">
            {hayPartidos && MatchCards}
            <TablaClasificacion standings={standings} loading={loadingStats} />
            <div className="grid grid-cols-2 gap-4">
              <TablaGoleadores goleadores={goleadores} loading={loadingRankings} />
              <TablaArqueros   arqueros={arqueros}     loading={loadingRankings} />
            </div>
            <TopGolesRapidos    goleadores={goleadores} loading={loadingRankings} />
            <TopGolesSalvadores goleadores={goleadores} loading={loadingRankings} />
            <TablaDisciplina    disciplina={disciplina} loading={loadingRankings} />
          </div>

          {/* ── Desktop: 3 cols con partidos / 2 cols sin partidos ── */}
          <div className={`hidden lg:grid lg:gap-5 lg:items-start ${hayPartidos ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>

            {/* Col 1 — Clasificación + Disciplina */}
            <div className="space-y-4">
              <TablaClasificacion standings={standings} loading={loadingStats} />
              <TablaDisciplina disciplina={disciplina} loading={loadingRankings} />
            </div>

            {/* Col 2 — Partidos en vivo (solo cuando hay) */}
            {hayPartidos && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-chalk-3 text-xs uppercase tracking-wider font-semibold">Partidos</span>
                  {CanchaFilter}
                </div>
                {MatchCards}
              </div>
            )}

            {/* Col 3 (o Col 2 sin partidos) — Goleadores + Top rápidos + Arqueros */}
            <div className="space-y-4">
              <TablaGoleadores  goleadores={goleadores} loading={loadingRankings} />
              <TopGolesRapidos    goleadores={goleadores} loading={loadingRankings} />
              <TopGolesSalvadores goleadores={goleadores} loading={loadingRankings} />
              <TablaArqueros      arqueros={arqueros}     loading={loadingRankings} />
            </div>

          </div>
        </>
      )}

      {tab === "torneo-regular" && (
        <TorneoRegularSection
          standings={standings}
          disciplina={disciplina}
          loading={loadingStats || loadingRankings}
        />
      )}

      {tab === "playoff" && (
        <PlayoffSection
          standings={standings}
          llaves={playoffs}
          numeroSede={numeroSede}
          loading={loadingStats || loadingPlayoffs}
        />
      )}
    </div>
    </EquiposCtx.Provider>
  );
}
