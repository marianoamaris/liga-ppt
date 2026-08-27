import type { Sede } from "../types/jugador";

/**
 * Cómo se anuncia el horario de juego de una ciudad.
 *
 * Valledupar juega los jueves de 6 a 8 y Bogotá lunes y jueves de 7 a 9, así
 * que ninguna frase sirve para las dos. El dato vive en `sedes` y aquí solo se
 * redacta.
 */

/** Numeración ISO, la misma que guarda la base: 1 = lunes … 7 = domingo. */
const DIAS = [
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
  "domingo",
];

export function nombreDia(iso: number): string {
  return DIAS[iso - 1] ?? "";
}

/** "lunes y jueves", "lunes, miércoles y viernes", "jueves". */
export function listaDias(dias: number[]): string {
  const nombres = [...dias].sort((a, b) => a - b).map(nombreDia).filter(Boolean);
  if (nombres.length <= 1) return nombres[0] ?? "";
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`;
}

/** "18:00:00" → { hora: "6:00", meridiem: "PM" } */
function partirHora(hhmmss: string): { hora: string; meridiem: string } {
  const [h, m] = hhmmss.split(":");
  const horas = Number(h);
  const meridiem = horas >= 12 ? "PM" : "AM";
  const doce = horas % 12 === 0 ? 12 : horas % 12;
  return { hora: `${doce}:${m}`, meridiem };
}

/**
 * "de 6:00 a 8:00 PM". El meridiem se repite solo cuando cambia dentro del
 * rango; decir «de 6:00 PM a 8:00 PM» es ruido en el caso normal.
 */
export function rangoHorario(inicio: string, fin: string): string {
  const a = partirHora(inicio);
  const b = partirHora(fin);
  return a.meridiem === b.meridiem
    ? `de ${a.hora} a ${b.hora} ${b.meridiem}`
    : `de ${a.hora} ${a.meridiem} a ${b.hora} ${b.meridiem}`;
}

/** "los lunes y jueves de 7:00 a 9:00 PM" */
export function horarioDeSede(sede: Pick<Sede, "dias_jornada" | "hora_inicio" | "hora_fin">): string {
  return `los ${listaDias(sede.dias_jornada)} ${rangoHorario(sede.hora_inicio, sede.hora_fin)}`;
}
