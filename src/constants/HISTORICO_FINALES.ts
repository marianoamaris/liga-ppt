/** Color de camiseta del equipo en la final (para resumen de victorias). */
export type ColorCamiseta =
  | "azul"
  | "rojo"
  | "verde"
  | "morado"
  | "negro"
  | "rosado"
  | "blanco"
  | "naranja"
  | "amarillo";

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

export type ResultadoFinal = "1" | "2" | "empate" | "pendiente";

export interface FinalHistorica {
  temporada: number;
  equipo1: string;
  equipo2: string;
  goles1: number | null;
  goles2: number | null;
  color1: ColorCamiseta;
  color2: ColorCamiseta;
  resultado: ResultadoFinal;
  /** Texto opcional bajo el marcador (ej. definición por tabla o penales). */
  notaMarcador?: string;
}

/** Resultados históricos de finales por temporada (actualizado según registro oficial de la liga). */
export const FINALES_HISTORICAS: FinalHistorica[] = [
  {
    temporada: 1,
    equipo1: "Boca Juniors",
    equipo2: "Borussia Dortmund",
    goles1: 7,
    goles2: 5,
    color1: "azul",
    color2: "negro",
    resultado: "1",
  },
  {
    temporada: 2,
    equipo1: "Liverpool FC",
    equipo2: "Newcastle UFC",
    goles1: 6,
    goles2: 4,
    color1: "rojo",
    color2: "negro",
    resultado: "1",
  },
  {
    temporada: 3,
    equipo1: "SSC Napoli",
    equipo2: "Inter de Miami",
    goles1: 7,
    goles2: 3,
    color1: "azul",
    color2: "rojo",
    resultado: "1",
  },
  {
    temporada: 4,
    equipo1: "Porto FC",
    equipo2: "AC Milan",
    goles1: 9,
    goles2: 2,
    color1: "azul",
    color2: "rojo",
    resultado: "1",
  },
  {
    temporada: 5,
    equipo1: "Inter de Milán",
    equipo2: "SE Palmeiras",
    goles1: 7,
    goles2: 4,
    color1: "azul",
    color2: "verde",
    resultado: "1",
  },
  {
    temporada: 6,
    equipo1: "Blessed",
    equipo2: "Verdolagas",
    goles1: 4,
    goles2: 6,
    color1: "azul",
    color2: "verde",
    resultado: "2",
  },
  {
    temporada: 7,
    equipo1: "DLC team",
    equipo2: "Greenworld",
    goles1: 2,
    goles2: 11,
    color1: "azul",
    color2: "verde",
    resultado: "2",
  },
  {
    temporada: 8,
    equipo1: "Ferxx100",
    equipo2: "Colsafistas",
    goles1: 14,
    goles2: 3,
    color1: "verde",
    color2: "azul",
    resultado: "1",
  },
  {
    temporada: 9,
    equipo1: "ACF Fiorentina",
    equipo2: "Alianza FC",
    goles1: 9,
    goles2: 8,
    color1: "morado",
    color2: "azul",
    resultado: "1",
  },
  {
    temporada: 10,
    equipo1: "Orlando City SC",
    equipo2: "América de Cali",
    goles1: 7,
    goles2: 5,
    color1: "morado",
    color2: "rojo",
    resultado: "1",
  },
  {
    temporada: 11,
    equipo1: "LUSP",
    equipo2: "Liverpool FC",
    goles1: 9,
    goles2: 5,
    color1: "morado",
    color2: "rojo",
    resultado: "1",
  },
  {
    temporada: 12,
    equipo1: "Real Valladolid",
    equipo2: "Club León",
    goles1: 11,
    goles2: 4,
    color1: "morado",
    color2: "verde",
    resultado: "1",
  },
  {
    temporada: 13,
    equipo1: "Sport Boys",
    equipo2: "Holanda",
    goles1: 4,
    goles2: 4,
    color1: "rosado",
    color2: "naranja",
    resultado: "1",
    notaMarcador: "Campeón Sport Boys por mejor posición en tabla general",
  },
  {
    temporada: 14,
    equipo1: "VfL Wolfsburgo",
    equipo2: "Brasil",
    goles1: 3,
    goles2: 3,
    color1: "verde",
    color2: "amarillo",
    resultado: "2",
    notaMarcador: "Campeón Brasil en penales",
  },
  {
    temporada: 15,
    equipo1: "Luton Town",
    equipo2: "DC United",
    goles1: 5,
    goles2: 10,
    color1: "naranja",
    color2: "negro",
    resultado: "2",
  },
  {
    temporada: 16,
    equipo1: "Borussia Dortmund",
    equipo2: "Palermo FC",
    goles1: 2,
    goles2: 4,
    color1: "amarillo",
    color2: "rosado",
    resultado: "2",
  },
  {
    temporada: 17,
    equipo1: "Girona F.C.",
    equipo2: "Olympique de Marsella",
    goles1: 5,
    goles2: 7,
    color1: "rojo",
    color2: "blanco",
    resultado: "2",
  },
  {
    temporada: 18,
    equipo1: "Sporting de Lisboa",
    equipo2: "Tottenham Hotspur",
    goles1: null,
    goles2: null,
    color1: "verde",
    color2: "blanco",
    resultado: "pendiente",
  },
];

/** Cuenta finales ganadas por color de camiseta (no cuenta empates ni partidos pendientes). */
export function resumenVictoriasPorColor(): { color: ColorCamiseta; finales: number }[] {
  const map = new Map<ColorCamiseta, number>();
  for (const c of Object.keys(ETIQUETA_COLOR) as ColorCamiseta[]) {
    map.set(c, 0);
  }
  for (const f of FINALES_HISTORICAS) {
    if (f.resultado === "empate" || f.resultado === "pendiente") continue;
    const ganador =
      f.resultado === "1"
        ? f.color1
        : f.resultado === "2"
          ? f.color2
          : null;
    if (ganador) map.set(ganador, (map.get(ganador) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([color, finales]) => ({ color, finales }))
    .filter((x) => x.finales > 0)
    .sort((a, b) => b.finales - a.finales || a.color.localeCompare(b.color));
}
