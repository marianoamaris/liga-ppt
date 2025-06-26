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
    version: "1.2.3",
    date: "26 de Junio, 2025",
    title: "Fix vista Clasificación en celulares",
    description: "La web ahora se adapta perfectamente a celulares.",
    changes: [
      {
        type: "FIX",
        description:
          "El menú de ligas ahora es horizontal, scrolleable y sticky en mobile, evitando cortes y mejorando la navegación.",
      },
    ],
  },
  {
    version: "1.2.2",
    date: "23 de Junio, 2025",
    title: "Nuevo canal de contacto oficial",
    description:
      "Se habilita una nueva sección de contacto y un correo oficial para mejorar la comunicación directa entre la liga y cualquier persona interesada.",
    changes: [
      {
        type: "MEJORA",
        description:
          "Nueva forma de comunicación directa entre la liga y nuevos aspirantes, espectadores o cualquier persona interesada en saber más sobre la Liga PPT.",
      },
      {
        type: "NUEVO",
        description:
          "Nuevo correo para comunicación oficial con la liga, manejado por el consejo administrativo: contacto@ligappt.com.",
      },
    ],
  },
  {
    version: "1.2.1",
    date: "23 de Junio, 2025",
    title: "Mejoras de SEO y Favicon",
    description:
      "Se han optimizado las etiquetas 'meta' para mejorar cómo se muestra la web al compartirla y se ha solucionado el problema de visualización del ícono en la pestaña del navegador.",
    changes: [
      {
        type: "MEJORA",
        description:
          "Se han actualizado las etiquetas meta (Open Graph y Twitter) para asegurar que el título, la descripción y la imagen de vista previa sean correctos al compartir el enlace ligappt.com.",
      },
      {
        type: "FIX",
        description:
          "Se ha creado un nuevo favicon.svg con fondo negro para solucionar el problema de visualización del logo en las pestañas del navegador.",
      },
      {
        type: "MEJORA",
        description:
          "Se ha establecido el idioma principal del sitio a español (lang='es') en el index.html.",
      },
      {
        type: "NUEVO",
        description:
          "Se ha configurado y verificado el dominio 'https://ligappt.com', asegurando que el sitio opere con certificado de seguridad (HTTPS) y una URL profesional.",
      },
    ],
  },
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
