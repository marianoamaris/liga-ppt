/**
 * Plantillas fijas de la Liga PPT #19 – Edición Mundial.
 * Cada equipo tiene su roster completo y su arquero titular designado.
 * Para modificar: editar jugadores[] y arqueroDesignado de cada entrada.
 */

export interface PlantillaEquipo {
  equipoId: string; // coincide con Liga19Equipo.id
  jugadores: string[];
  arqueroDesignado: string;
}

export const PLANTILLAS_LIGA19: PlantillaEquipo[] = [
  {
    equipoId: "brasil",
    arqueroDesignado: "Brayan Ospino",
    jugadores: [
      "Brayan Ospino",
      "Juan de la Cruz",
      "Eudes Pavajeau",
      "Keni Contreras",
      "Fabricio Rizo",
      "Jeison Santa",
    ],
  },
  {
    equipoId: "argentina",
    arqueroDesignado: "Fernando Gómez",
    jugadores: [
      "Fernando Gómez",
      "Mariano Amaris",
      "Emanuel Celedón",
      "Andy Córdoba",
      "Elias Lacera",
      "Santiago Corzo",
    ],
  },
  {
    equipoId: "mexico",
    arqueroDesignado: "Keyner Vides",
    jugadores: [
      "Keyner Vides",
      "Ronald Rojas",
      "Yassir Fuentes",
      "Jairo Galván",
      "Esteban Galván",
      "Nico Yamal",
    ],
  },
  {
    equipoId: "alemania",
    arqueroDesignado: "Bryan Cadena",
    jugadores: [
      "Bryan Cadena",
      "Juan Mora",
      "Daniel Cuadros",
      "Cristian Benjumea",
      "Frank Ramirez",
      "Henry Hernández",
    ],
  },
  {
    equipoId: "noruega",
    arqueroDesignado: "Pipe Castillejo",
    jugadores: [
      "Pipe Castillejo",
      "Hernán Medrano",
      "Arnold Castillo",
      "Juanda Dybala",
      "Kevin Pineda",
      "Breiner Corzo",
    ],
  },
  {
    equipoId: "francia",
    arqueroDesignado: "Leonardo Cadena",
    jugadores: [
      "Leonardo Cadena",
      "José Hernández",
      "Víctor Castilla",
      "Jaime Medrano",
      "Sergio Barrera",
      "Jhan Martínez",
    ],
  },
  {
    equipoId: "corea-del-sur",
    arqueroDesignado: "Nadim Camall",
    jugadores: [
      "Nadim Camall",
      "José Viña",
      "Jesús Pertuz",
      "Carlos Romero",
      "Jossimar Cujia",
      "Andrés Valle",
    ],
  },
  {
    equipoId: "paises-bajos",
    arqueroDesignado: "Nicolás Baute",
    jugadores: [
      "Nicolás Baute",
      "Andrés Farfán",
      "Omar Peralta",
      "Edwin Martínez",
      "Jürgen Hassler",
      "Alexis Marín",
    ],
  },
  {
    equipoId: "portugal",
    arqueroDesignado: "Santiago Sánchez",
    jugadores: [
      "Santiago Sánchez",
      "José Franco",
      "Steven Cubides",
      "David Carballo",
      "Jhan C. Martínez",
      "Luiska Fonseca",
    ],
  },
];
