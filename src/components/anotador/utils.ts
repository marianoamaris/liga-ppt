import type { EquipoEnCancha, Evento, TeamScore } from "./types";

export const LIGA19_COLORES: Record<string, string> = {
  brasil:          "#FFD700",
  argentina:       "#1565C0",
  mexico:          "#2E7D32",
  alemania:        "#212121",
  noruega:         "#E91E8C",
  francia:         "#F5F5F5",
  "corea-del-sur": "#7B1FA2",
  "paises-bajos":  "#E65100",
  portugal:        "#C62828",
};

export const DURACION_PARTIDO = 7 * 60; // 420 segundos

export function getColor(id: string): string {
  return LIGA19_COLORES[id] ?? "#4B5563";
}

export function getTextColor(id: string): string {
  return ["francia", "brasil"].includes(id) ? "#111827" : "#ffffff";
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
export function formatElapsed(secs: number): string {
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
