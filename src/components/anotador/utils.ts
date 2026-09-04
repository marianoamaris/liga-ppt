import type { EquipoEnCancha, Evento, ModoPartido, RazonAmarilla, TeamScore } from "./types";

/**
 * Cómo se lee cada motivo de amarilla. Vive aquí porque no lo usa solo el
 * anotador: el cuadro de playoffs muestra las mismas tarjetas mucho después,
 * y la etiqueta tiene que decir lo mismo en los dos sitios.
 */
export const RAZON_LABEL: Record<RazonAmarilla, string> = {
  "halar-peto":      "Halar peto",
  "falta-temeraria": "Falta temeraria",
  "falta-tactica":   "Falta táctica o normal",
  "llegada-tarde":   "Llegada tarde",
  "falta":           "Falta",
  "falta-respeto":   "Falta de respeto",
};

export const LIGA20_COLORES: Record<string, string> = {
  brighton:          "#FFD700",
  "manchester-city": "#1565C0",
  liverpool:         "#2E7D32",
  newcastle:         "#212121",
  "crystal-palace":  "#E91E8C",
  tottenham:         "#F5F5F5",
  "aston-villa":     "#7B1FA2",
  "hull-city":       "#E65100",
  arsenal:           "#C62828",
};

export const DURACION_PARTIDO = 8 * 60; // 480 segundos

/** Lo que se muestra cuando un evento no guardó en qué minuto ocurrió. */
export const SIN_TIEMPO = "—";

/**
 * Duración reglamentaria de cada modo, en segundos.
 *
 * La jornada son mini-partidos de 8 minutos que se reinician con cada gol; los
 * playoffs se juegan a un solo tiempo corrido, y la final dura diez minutos más
 * que las rondas previas.
 */
export const DURACION_POR_MODO: Record<ModoPartido, number> = {
  jornada: DURACION_PARTIDO,
  cuartos: 50 * 60,
  semifinal: 50 * 60,
  final: 60 * 60,
};

export function getColor(id: string): string {
  return LIGA20_COLORES[id] ?? "#4B5563";
}

export function getTextColor(id: string): string {
  return ["tottenham", "brighton"].includes(id) ? "#111827" : "#ffffff";
}

export function makeId(): string {
  return crypto.randomUUID();
}

export function formatCountdown(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Format elapsed seconds as "M'SS"" (e.g. 1'23" = 83 seconds) */
/**
 * Minuto y segundo del marcador.
 *
 * Acepta que no haya tiempo: hay eventos guardados antes de que el reloj
 * viajara con ellos —las expulsiones, sobre todo— y formatearlos a ciegas
 * pintaba un `NaN'NaN"` en el feed y en el resumen.
 */
export function formatElapsed(secs: number | null | undefined): string {
  if (typeof secs !== "number" || !Number.isFinite(secs)) return SIN_TIEMPO;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}'${String(s).padStart(2, "0")}"`;
}


export function computeScores(
  equipos: EquipoEnCancha[],
  eventos: Evento[]
): Map<string, TeamScore> {
  const map = new Map<string, TeamScore>(
    equipos.map((eq) => [
      eq.equipo.id,
      { victorias: 0, empates: 0, derrotas: 0, puntos: 0 },
    ])
  );
  for (const ev of eventos) {
    if (ev.tipo === "gol") {
      const g = map.get(ev.data.equipoGoleadorId);
      if (g) { g.victorias++; g.puntos += 2; }
      const d = map.get(ev.data.equipoArqueroId);
      if (d) d.derrotas++;
    } else if (ev.tipo === "autogol") {
      const g = map.get(ev.data.equipoGanadorId);
      if (g) { g.victorias++; g.puntos += 2; }
      const d = map.get(ev.data.equipoAutogolId);
      if (d) d.derrotas++;
    } else if (ev.tipo === "empate") {
      const a = map.get(ev.data.equipoAId);
      if (a) { a.empates++; a.puntos++; }
      const b = map.get(ev.data.equipoBId);
      if (b) { b.empates++; b.puntos++; }
    }
    // amarillas no afectan puntos
  }
  return map;
}

export function amarillasPorJugador(eventos: Evento[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const ev of eventos) {
    if (ev.tipo === "amarilla") {
      counts[ev.data.jugador] = (counts[ev.data.jugador] ?? 0) + 1;
    }
  }
  return counts;
}
