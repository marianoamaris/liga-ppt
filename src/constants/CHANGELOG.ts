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
    version: "1.2.0",
    date: "23 de Junio, 2025",
    title: "Actualización de Datos y Módulo de Anuncios",
    description:
      "Se actualiza la base de datos de jugadores con los goleadores históricos y se añade este nuevo módulo para comunicar los cambios.",
    changes: [
      {
        type: "NUEVO",
        description:
          "Se añade un nuevo módulo de 'Anuncios' para centralizar la comunicación de cambios y mejoras en la plataforma.",
      },
      {
        type: "MEJORA",
        description:
          "Se actualizan los goles históricos de todos los jugadores en la sección 'Historia' con los últimos datos proporcionados.",
      },
      {
        type: "MEJORA",
        description:
          "Se añaden nuevos jugadores a la base de datos: Víctor Castilla (Toto), Pipe New y Breiner Corzo (Mene).",
      },
      {
        type: "FIX",
        description:
          "Se corrigen inconsistencias en los nombres de varios jugadores para unificar sus estadísticas (Ej: Juan DLC -> Juan de la Cruz).",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "22 de Junio, 2025",
    title: "Playoffs Liga #13 y Correcciones",
    description:
      "Se añade la información de los Playoffs de la Liga #13 en la página de inicio y se corrigen errores en la visualización de la tabla de clasificación.",
    changes: [
      {
        type: "NUEVO",
        description:
          "Se añade un bracket interactivo en la página principal con los enfrentamientos de los Playoffs de la Liga #13.",
      },
      {
        type: "FIX",
        description:
          "Corregido un error que impedía que se mostraran correctamente las estadísticas (V, E, D, Puntos) en la tabla general de la Liga #13.",
      },
      {
        type: "MEJORA",
        description:
          "Actualización completa de todos los datos de la Liga #13, incluyendo tabla general, jornadas, goleadores y arqueros.",
      },
    ],
  },
];
