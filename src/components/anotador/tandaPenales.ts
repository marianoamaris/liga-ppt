import type { TiroPenal } from "./types";

/**
 * Reglas de la tanda de penales: al mejor de tres y, si siguen iguales,
 * muerte súbita.
 *
 * Vive aparte de la pantalla porque es lo único del anotador con reglas de
 * verdad: quién cobra ahora, si la tanda ya está decidida aunque queden tiros
 * por cobrar, y cuándo se entra en muerte súbita. Contar solo los convertidos
 * no bastaba: un 1-1 con tres cobros por lado ya es muerte súbita, y un 2-0 con
 * un tiro pendiente ya está decidido.
 */

export const TIROS_TANDA = 3;

export interface EstadoTanda {
  golesA: number;
  golesB: number;
  tirosA: number;
  tirosB: number;
  /** A quién le toca cobrar; null si la tanda ya terminó. */
  turno: "A" | "B" | null;
  /** Número del cobro dentro de su equipo, para rotular «Tiro 2 de 3». */
  numeroDelTurno: number;
  /** Ya no quedan tiros que puedan cambiar el resultado. */
  decidida: boolean;
  ganador: "A" | "B" | null;
  /** Los tres cobros de cada lado quedaron iguales: se sigue de a un par. */
  muerteSubita: boolean;
}

/**
 * Se cobra alternando, empezando por el equipo A. En muerte súbita se sigue
 * alternando: el par tiene que estar completo antes de declarar ganador.
 */
export function estadoTanda(tiros: TiroPenal[], equipoAId: string): EstadoTanda {
  const deA = tiros.filter((t) => t.equipoId === equipoAId);
  const deB = tiros.filter((t) => t.equipoId !== equipoAId);

  const golesA = deA.filter((t) => t.convertido).length;
  const golesB = deB.filter((t) => t.convertido).length;
  const tirosA = deA.length;
  const tirosB = deB.length;

  const enSubita = tirosA >= TIROS_TANDA && tirosB >= TIROS_TANDA;

  // Durante los tres primeros, la ventaja decide antes de tiempo si al rival no
  // le alcanzan los cobros que le quedan.
  const faltanA = Math.max(0, TIROS_TANDA - tirosA);
  const faltanB = Math.max(0, TIROS_TANDA - tirosB);

  let ganador: "A" | "B" | null = null;
  if (enSubita) {
    // Solo con el par cerrado: si A convierte y B todavía no cobró, no hay nada.
    if (tirosA === tirosB && golesA !== golesB) ganador = golesA > golesB ? "A" : "B";
  } else {
    if (golesA > golesB + faltanB) ganador = "A";
    else if (golesB > golesA + faltanA) ganador = "B";
  }

  const decidida = ganador != null;
  const turno = decidida ? null : tirosA <= tirosB ? "A" : "B";

  return {
    golesA,
    golesB,
    tirosA,
    tirosB,
    turno,
    numeroDelTurno: (turno === "A" ? tirosA : tirosB) + 1,
    decidida,
    ganador,
    muerteSubita: enSubita,
  };
}
