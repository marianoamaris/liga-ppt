import { useState, useEffect } from "react";
import { MarcadorVivo } from "./MarcadorVivo";
import { AmarillaModal } from "./AmarillaModal";
import {
  getColor,
  formatElapsed,
  makeId,
  computeScores,
  amarillasPorJugador,
  DURACION_PARTIDO,
} from "./utils";
import type {
  EquipoEnCancha,
  Evento,
  EventoGol,
  EventoAutogol,
  EventoEmpate,
  EventoAmarilla,
  ModoPartido,
  RazonAmarilla,
  PartidoVivo,
} from "./types";

const PAIRS: [number, number][] = [[0, 1], [0, 2], [1, 2]];

const RAZON_LABEL: Record<RazonAmarilla, string> = {
  "llegada-tarde": "Llegada tarde",
  falta: "Falta",
  "falta-respeto": "Falta de respeto",
};

interface Props {
  partido: PartidoVivo;
  onUpdatePartido: (p: PartidoVivo) => void;
  onFinalizar: () => void;
}

type TargetAmarilla = { jugador: string; equipoIdx: number } | null;

// ── Player column ─────────────────────────────────────────────────────────────
interface ColProps {
  eq: EquipoEnCancha;
  eqIdx: number;
  contrarioId: string;
  modo: ModoPartido;
  scores: Map<string, { victorias: number; empates: number; derrotas: number; puntos: number }>;
  amarillas: Record<string, number>;
  onGol: (goleador: string, goleadorEquipoId: string, arqueroEquipoId: string) => void;
  onAutogol: (equipoAutogolId: string, equipoGanadorId: string) => void;
  onAmarilla: (jugador: string, eqIdx: number) => void;
}

function PlayerColumn({ eq, eqIdx, contrarioId, modo, scores, amarillas, onGol, onAutogol, onAmarilla }: ColProps) {
  const color = getColor(eq.equipo.id);
  const s = scores.get(eq.equipo.id) ?? { victorias: 0, empates: 0, derrotas: 0, puntos: 0 };
  const esPlayoff = modo !== "jornada";

  return (
    <div className="flex flex-col gap-2">
      {/* Team header */}
      <div
        className="rounded-xl py-2.5 px-2 text-center"
        style={{ background: `${color}18`, border: `1px solid ${color}40` }}
      >
        <div className="font-bold text-sm leading-tight truncate" style={{ color }}>
          {eq.equipo.nombre}
        </div>
        {!esPlayoff && (
          <>
            <div className="text-white font-black text-lg leading-none tabular-nums mt-0.5">
              {s.puntos}
              <span className="text-gray-500 text-xs font-normal ml-0.5">pts</span>
            </div>
            <div className="text-gray-600 text-[10px] leading-none mt-0.5">
              {s.victorias}V · {s.empates}E · {s.derrotas}D
            </div>
          </>
        )}
      </div>

      {/* Players */}
      {eq.jugadores.map((j) => {
        const cards = amarillas[j.nombre] ?? 0;
        return (
          <div key={j.nombre} className="flex gap-1.5">
            <button
              onClick={() => onGol(j.nombre, eq.equipo.id, contrarioId)}
              className="flex-1 min-h-[52px] px-2.5 bg-gray-900 hover:bg-gray-800 active:bg-gray-700 active:scale-95 rounded-xl text-left transition-all"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <div className="flex items-center gap-1 leading-tight">
                {j.nombre === eq.arqueroDesignado && (
                  <span className="text-[13px] shrink-0">🧤</span>
                )}
                <span className="text-white text-sm font-medium leading-tight line-clamp-2">
                  {j.nombre}
                </span>
              </div>
              {cards > 0 && (
                <div className="text-xs mt-0.5">{"🟨".repeat(Math.min(cards, 3))}</div>
              )}
            </button>
            <button
              onClick={() => onAmarilla(j.nombre, eqIdx)}
              className="min-h-[52px] w-11 shrink-0 flex items-center justify-center bg-gray-900 hover:bg-yellow-600/20 active:bg-yellow-600/35 rounded-xl transition-colors border border-transparent hover:border-yellow-600/30 text-lg"
              aria-label={`Tarjeta a ${j.nombre}`}
            >
              🟨
            </button>
          </div>
        );
      })}

      {/* Autogol */}
      <button
        onClick={() => onAutogol(eq.equipo.id, contrarioId)}
        className="w-full min-h-[44px] mt-1 rounded-xl text-sm font-semibold transition-all border border-red-900/30 bg-red-900/10 hover:bg-red-900/20 active:bg-red-900/30 active:scale-[0.98] text-red-400/80 hover:text-red-400"
      >
        🥅 Autogol
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function PartidoEnVivo({ partido, onUpdatePartido, onFinalizar }: Props) {
  const [pairIdx, setPairIdx] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(DURACION_PARTIDO);
  const [corriendo, setCorriendo] = useState(false);
  const [targetAmarilla, setTargetAmarilla] = useState<TargetAmarilla>(null);
  const [logAbierto, setLogAbierto] = useState(false);
  const [confirmFinalizar, setConfirmFinalizar] = useState(false);

  const { config, eventos } = partido;
  const { modo, equipos } = config;
  const esPlayoff = modo !== "jornada";

  // Countdown (only relevant for jornada)
  useEffect(() => {
    if (esPlayoff || !corriendo || tiempoRestante <= 0) {
      if (!esPlayoff && tiempoRestante <= 0 && corriendo) setCorriendo(false);
      return;
    }
    const t = setTimeout(() => setTiempoRestante((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(t);
  }, [corriendo, tiempoRestante, esPlayoff]);

  // Current pair for jornada
  const [idxA, idxB] = esPlayoff ? [0, 1] : PAIRS[pairIdx];
  const equipoA = equipos[idxA];
  const equipoB = equipos[idxB];
  const colorA = getColor(equipoA.equipo.id);
  const colorB = getColor(equipoB.equipo.id);

  const scores = computeScores(equipos, eventos);
  const amarillas = amarillasPorJugador(eventos);

  // Elapsed seconds from server's iniciado_en (what the backend expects)
  const elapsedSec = () => Math.floor((Date.now() - partido.iniciadoEn) / 1000);

  function pushEvento(ev: Evento) {
    onUpdatePartido({ ...partido, eventos: [...eventos, ev] });
  }

  function handleGol(goleador: string, equipoGoleadorId: string, equipoArqueroId: string) {
    const data: EventoGol = {
      id: makeId(), goleador, equipoGoleadorId, equipoArqueroId,
      tiempoEnMarcador: elapsedSec(),
    };
    pushEvento({ tipo: "gol", data });

    if (!esPlayoff) {
      // Reset and pause timer
      setTiempoRestante(DURACION_PARTIDO);
      setCorriendo(false);
      // Auto-rotate: winner stays, loser exits, waiting team comes in
      const winnerIdx = equipos.findIndex((e) => e.equipo.id === equipoGoleadorId);
      const loserIdx = equipos.findIndex((e) => e.equipo.id === equipoArqueroId);
      const waiterIdx = ([0, 1, 2] as const).find(
        (i) => i !== winnerIdx && i !== loserIdx
      )!;
      const nextPairIdx = PAIRS.findIndex(
        ([a, b]) =>
          (a === winnerIdx && b === waiterIdx) ||
          (a === waiterIdx && b === winnerIdx)
      );
      if (nextPairIdx !== -1) setPairIdx(nextPairIdx);
    }
  }

  function handleAutogol(equipoAutogolId: string, equipoGanadorId: string) {
    const data: EventoAutogol = {
      id: makeId(), equipoAutogolId, equipoGanadorId,
      tiempoEnMarcador: elapsedSec(),
    };
    pushEvento({ tipo: "autogol", data });

    if (!esPlayoff) {
      setTiempoRestante(DURACION_PARTIDO);
      setCorriendo(false);
      const winnerIdx = equipos.findIndex((e) => e.equipo.id === equipoGanadorId);
      const loserIdx = equipos.findIndex((e) => e.equipo.id === equipoAutogolId);
      const waiterIdx = ([0, 1, 2] as const).find(
        (i) => i !== winnerIdx && i !== loserIdx
      )!;
      const nextPairIdx = PAIRS.findIndex(
        ([a, b]) =>
          (a === winnerIdx && b === waiterIdx) ||
          (a === waiterIdx && b === winnerIdx)
      );
      if (nextPairIdx !== -1) setPairIdx(nextPairIdx);
    }
  }

  function handleEmpate() {
    const data: EventoEmpate = {
      id: makeId(),
      equipoAId: equipoA.equipo.id,
      equipoBId: equipoB.equipo.id,
      tiempoEnMarcador: elapsedSec(),
    };
    pushEvento({ tipo: "empate", data });
  }

  function handleAmarilla(razon: RazonAmarilla) {
    if (!targetAmarilla) return;
    const eq = equipos[targetAmarilla.equipoIdx];
    const data: EventoAmarilla = {
      id: makeId(),
      jugador: targetAmarilla.jugador,
      equipoId: eq.equipo.id,
      razon,
      tiempoEnMarcador: elapsedSec(),
    };
    pushEvento({ tipo: "amarilla", data });
    setTargetAmarilla(null);
  }

  function handleDeshacer() {
    if (!eventos.length) return;
    onUpdatePartido({ ...partido, eventos: eventos.slice(0, -1) });
  }

  const golesCount = eventos.filter((e) => e.tipo === "gol" || e.tipo === "autogol").length;
  const amarillasCount = eventos.filter((e) => e.tipo === "amarilla").length;
  const empatesCount = eventos.filter((e) => e.tipo === "empate").length;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <MarcadorVivo
        modo={modo}
        equipos={equipos}
        eventos={eventos}
        jornada={config.jornada}
        tiempoRestante={tiempoRestante}
        corriendo={corriendo}
        onToggle={() => setCorriendo((c) => !c)}
        onReiniciar={() => { setCorriendo(false); setTiempoRestante(DURACION_PARTIDO); }}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3 pb-8">

          {/* ── Pair selector (jornada only) ── */}
          {!esPlayoff && (
            <div className="bg-gray-900 rounded-2xl p-3">
              <p className="text-gray-600 text-[10px] uppercase tracking-wider font-semibold mb-2 text-center">
                Jugando ahora
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPairIdx((p) => (p + 2) % 3)}
                  className="min-h-[52px] min-w-[44px] flex items-center justify-center bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-xl text-gray-300 text-2xl transition-colors shrink-0"
                >‹</button>

                <div className="flex-1 text-center space-y-1">
                  <div className="flex items-center justify-center gap-3">
                    <div>
                      <div className="font-bold text-base leading-tight" style={{ color: colorA }}>
                        {equipoA.equipo.nombre}
                      </div>
                      <div className="text-gray-600 text-[11px]">
                        {scores.get(equipoA.equipo.id)?.puntos ?? 0} pts
                      </div>
                    </div>
                    <span className="text-gray-700 text-sm font-light">vs</span>
                    <div>
                      <div className="font-bold text-base leading-tight" style={{ color: colorB }}>
                        {equipoB.equipo.nombre}
                      </div>
                      <div className="text-gray-600 text-[11px]">
                        {scores.get(equipoB.equipo.id)?.puntos ?? 0} pts
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-2 pt-1">
                    {[0, 1, 2].map((pi) => (
                      <button
                        key={pi}
                        onClick={() => setPairIdx(pi)}
                        className={`h-2 rounded-full transition-all ${
                          pairIdx === pi ? "w-5 bg-green-500" : "w-2 bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setPairIdx((p) => (p + 1) % 3)}
                  className="min-h-[52px] min-w-[44px] flex items-center justify-center bg-gray-800 hover:bg-gray-700 active:bg-gray-600 rounded-xl text-gray-300 text-2xl transition-colors shrink-0"
                >›</button>
              </div>
            </div>
          )}

          {/* ── Player columns ── */}
          <div className="grid grid-cols-2 gap-2">
            <PlayerColumn
              eq={equipoA} eqIdx={idxA} contrarioId={equipoB.equipo.id}
              modo={modo} scores={scores} amarillas={amarillas}
              onGol={handleGol}
              onAutogol={handleAutogol}
              onAmarilla={(jugador, eqIdx) => setTargetAmarilla({ jugador, equipoIdx: eqIdx })}
            />
            <PlayerColumn
              eq={equipoB} eqIdx={idxB} contrarioId={equipoA.equipo.id}
              modo={modo} scores={scores} amarillas={amarillas}
              onGol={handleGol}
              onAutogol={handleAutogol}
              onAmarilla={(jugador, eqIdx) => setTargetAmarilla({ jugador, equipoIdx: eqIdx })}
            />
          </div>

          {/* ── Empate (jornada only) ── */}
          {!esPlayoff && (
            <button
              onClick={handleEmpate}
              className="w-full min-h-[52px] py-3 rounded-2xl font-bold text-yellow-400 text-sm border border-yellow-600/30 bg-yellow-600/10 hover:bg-yellow-600/18 active:bg-yellow-600/25 active:scale-[0.98] transition-all"
            >
              🤝 Empate —{" "}
              <span style={{ color: colorA }}>{equipoA.equipo.nombre}</span>
              <span className="text-gray-600 mx-1">vs</span>
              <span style={{ color: colorB }}>{equipoB.equipo.nombre}</span>
            </button>
          )}

          {/* ── Event log (collapsible) ── */}
          {eventos.length > 0 && (
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              <button
                onClick={() => setLogAbierto((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-300 font-semibold">Registro</span>
                  <span className="flex gap-1.5 text-xs text-gray-500">
                    {golesCount > 0 && <span>⚽{golesCount}</span>}
                    {empatesCount > 0 && <span>🤝{empatesCount}</span>}
                    {amarillasCount > 0 && <span>🟨{amarillasCount}</span>}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeshacer(); }}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    ↩ Deshacer
                  </button>
                  <span className="text-gray-600 text-lg leading-none">
                    {logAbierto ? "▴" : "▾"}
                  </span>
                </div>
              </button>

              {logAbierto && (
                <div className="border-t border-gray-800 max-h-72 overflow-y-auto divide-y divide-gray-800">
                  {[...eventos].reverse().map((ev) => {
                    if (ev.tipo === "gol") {
                      const eqGol = equipos.find((e) => e.equipo.id === ev.data.equipoGoleadorId);
                      const color = getColor(ev.data.equipoGoleadorId);
                      return (
                        <div key={ev.data.id} className="flex items-center gap-2.5 px-4 py-3">
                          <span className="text-gray-500 text-[11px] w-11 shrink-0 font-mono tabular-nums">
                            {formatElapsed(ev.data.tiempoEnMarcador)}
                          </span>
                          <span className="text-base shrink-0">⚽</span>
                          <div className="min-w-0">
                            <span className="font-semibold text-sm" style={{ color }}>
                              {ev.data.goleador}
                            </span>
                            <span className="text-gray-600 text-xs"> · {eqGol?.equipo.nombre}</span>
                          </div>
                        </div>
                      );
                    } else if (ev.tipo === "autogol") {
                      const eqAuto = equipos.find((e) => e.equipo.id === ev.data.equipoAutogolId);
                      const color = getColor(ev.data.equipoAutogolId);
                      return (
                        <div key={ev.data.id} className="flex items-center gap-2.5 px-4 py-3">
                          <span className="text-gray-500 text-[11px] w-11 shrink-0 font-mono tabular-nums">
                            {formatElapsed(ev.data.tiempoEnMarcador)}
                          </span>
                          <span className="text-base shrink-0">🥅</span>
                          <div className="min-w-0">
                            <span className="font-semibold text-sm" style={{ color }}>
                              Autogol
                            </span>
                            <span className="text-gray-600 text-xs"> · {eqAuto?.equipo.nombre}</span>
                          </div>
                        </div>
                      );
                    } else if (ev.tipo === "empate") {
                      const eqA = equipos.find((e) => e.equipo.id === ev.data.equipoAId);
                      const eqB = equipos.find((e) => e.equipo.id === ev.data.equipoBId);
                      return (
                        <div key={ev.data.id} className="flex items-center gap-2.5 px-4 py-3">
                          <span className="text-gray-500 text-[11px] w-11 shrink-0 font-mono tabular-nums">
                            {formatElapsed(ev.data.tiempoEnMarcador)}
                          </span>
                          <span className="text-base shrink-0">🤝</span>
                          <span className="text-yellow-500 text-sm">
                            {eqA?.equipo.nombre} vs {eqB?.equipo.nombre}
                          </span>
                        </div>
                      );
                    } else {
                      const eqAm = equipos.find((e) => e.equipo.id === ev.data.equipoId);
                      const color = getColor(ev.data.equipoId);
                      return (
                        <div key={ev.data.id} className="flex items-center gap-2.5 px-4 py-3">
                          <span className="text-gray-500 text-[11px] w-11 shrink-0 font-mono tabular-nums">
                            {formatElapsed(ev.data.tiempoEnMarcador)}
                          </span>
                          <span className="text-base shrink-0">🟨</span>
                          <div className="min-w-0">
                            <span className="font-semibold text-sm" style={{ color }}>
                              {ev.data.jugador}
                            </span>
                            <span className="text-gray-600 text-xs"> · {eqAm?.equipo.nombre}</span>
                            <div className="text-gray-600 text-xs">{RAZON_LABEL[ev.data.razon]}</div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Finalizar ── */}
          {!confirmFinalizar ? (
            <button
              onClick={() => setConfirmFinalizar(true)}
              className="w-full min-h-[48px] bg-gray-900 hover:bg-gray-800 text-gray-600 rounded-xl font-medium transition-colors text-sm"
            >
              Finalizar
            </button>
          ) : (
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
              <p className="text-white text-center font-semibold">¿Finalizar el partido?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmFinalizar(false)}
                  className="flex-1 min-h-[52px] bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
                >
                  Continuar
                </button>
                <button
                  onClick={onFinalizar}
                  className="flex-1 min-h-[52px] bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors"
                >
                  Sí, finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {targetAmarilla && (
        <AmarillaModal
          jugador={targetAmarilla.jugador}
          equipoId={equipos[targetAmarilla.equipoIdx].equipo.id}
          equipoNombre={equipos[targetAmarilla.equipoIdx].equipo.nombre}
          onConfirmar={handleAmarilla}
          onCancelar={() => setTargetAmarilla(null)}
        />
      )}
    </div>
  );
}
