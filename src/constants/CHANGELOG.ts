export type ChangeType = "NUEVO" | "MEJORA" | "FIX";

export interface Change {
  type: ChangeType;
  description: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: Change[];
}

export const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    version: "1.1",
    date: "3 de Julio, 2025",
    title: "Anuncio #2: Sistema de Tarjetas y Reglas de Faltas",
    description:
      "A partir de las instancias finales de la Liga PPT #14, se introducen nuevas reglas para la gestión de faltas y sanciones. Estos cambios aplicarán parcialmente en la Liga #14 y aplicarán por completo desde la jornada 1 de la Liga #15 y siguientes temporadas.",
    changes: [
      {
        type: "NUEVO",
        description:
          "Se implementará un nuevo sistema disciplinario basado en tarjetas: Amarilla, Azul y Roja. Este reemplazará el sistema actual de sanciones por anotaciones individuales. Entrará en vigencia desde la fase eliminatoria, es decir, playoff - semis y final de la Liga #14 y se aplicará desde el inicio en la Liga #15 en su jornada #1 hasta su finalización.",
      },
      {
        type: "NUEVO",
        description:
          "A partir de la Liga #14, solo el jugador que reciba la falta y el capitán de su equipo podrán 'cantar' o reportar la falta. Las validaciones posteriores se mantienen según el protocolo habitual.",
      },
    ],
  },

  {
    version: "1",
    date: "2 de Julio, 2025",
    title: "Anuncio #1 - Liga PPT #14",
    description: "Actualizaciones de reglamento, inicio de liga y demás.",
    changes: [
      {
        type: "NUEVO",
        description:
          "Viernes 4 de Julio se realizará el draft para saber cuáles serán los nuevos equipos para esta temporada.",
      },
      {
        type: "NUEVO",
        description:
          "Se prohíbe el uso de guayos con taches grandes (goma, plástico o aluminio). Solo se permitirá el uso de zapatillas para cancha sintética o tenis deportivos sin taches grandes. Quienes no cumplan con esta norma NO podrán jugar hasta tener el calzado adecuado.",
      },
      {
        type: "NUEVO",
        description:
          "Formato de desempate en playoffs: En cuartos, el empate se resuelve por mejor posición en tabla. En semis y final se definirá por penales: 3 tiros por equipo y si ambos aciertan todos, se continuará 1 vs 1 hasta que uno falle.",
      },
      {
        type: "NUEVO",
        description:
          "Actualización en reglas de transferencia: un jugador puede pedir cambio, pero no es obligación del capitán realizarlo. Si el jugador juega mal a propósito o no se presenta para forzar su salida, el capitán podrá removerlo de la liga y reemplazarlo por jugadores en reserva.",
      },
      {
        type: "NUEVO",
        description:
          "Si un jugador amenaza con jugar mal para ser considerado transferible o buscar salida del equipo, podrá ser expulsado directamente y su participación será vetada por 3 ligas.",
      },
    ],
  },
];
