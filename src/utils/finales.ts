import type { ColorCamiseta, FinalHistorica } from "../types/jugador";

/** Etiqueta legible de cada color de camiseta. */
export const ETIQUETA_COLOR: Record<ColorCamiseta, string> = {
  azul: "Azul",
  rojo: "Rojo",
  verde: "Verde",
  morado: "Morado",
  negro: "Negro",
  rosado: "Rosado",
  blanco: "Blanco",
  naranja: "Naranja",
  amarillo: "Amarillo",
};

export interface ResumenColor {
  color: ColorCamiseta;
  ganadas: number;
  disputadas: number;
}

/**
 * Cuenta finales ganadas y disputadas por color de camiseta.
 * Ignora las finales pendientes; los empates suman disputada pero no ganada.
 */
export function resumenVictoriasPorColor(
  finales: FinalHistorica[]
): ResumenColor[] {
  const ganadas = new Map<ColorCamiseta, number>();
  const disputadas = new Map<ColorCamiseta, number>();

  for (const color of Object.keys(ETIQUETA_COLOR) as ColorCamiseta[]) {
    ganadas.set(color, 0);
    disputadas.set(color, 0);
  }

  for (const f of finales) {
    if (f.resultado === "pendiente") continue;
    disputadas.set(f.color1, (disputadas.get(f.color1) ?? 0) + 1);
    disputadas.set(f.color2, (disputadas.get(f.color2) ?? 0) + 1);
    if (f.resultado === "empate") continue;
    const ganador = f.resultado === "1" ? f.color1 : f.color2;
    ganadas.set(ganador, (ganadas.get(ganador) ?? 0) + 1);
  }

  return [...disputadas.entries()]
    .filter(([, d]) => d > 0)
    .map(([color, d]) => ({
      color,
      ganadas: ganadas.get(color) ?? 0,
      disputadas: d,
    }))
    .sort((a, b) => b.ganadas - a.ganadas || a.color.localeCompare(b.color));
}
