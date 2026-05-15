/** Capitanes campeones por temporada (Liga PPT). */
export type CapitanHistorico = {
  /** Posición en el ranking (empates repiten número). */
  rank: number;
  /** Nombre como figura en la liga (puede incluir apodo entre paréntesis). */
  nombre: string;
  titulos: number;
  /** Temporadas en las que ganó como capitán, separadas por coma. */
  temporadas: string;
};

export const CAPITANES_HISTORICOS: CapitanHistorico[] = [
  { rank: 1, nombre: "Keni Contreras", titulos: 3, temporadas: "7, 11, 17" },
  { rank: 2, nombre: "Santiago Corzo", titulos: 2, temporadas: "16, 18" },
  { rank: 3, nombre: "Mariano Amaris", titulos: 2, temporadas: "1, 3" },
  { rank: 4, nombre: "Jesús Pertuz", titulos: 1, temporadas: "14" },
  { rank: 4, nombre: "José Hernández", titulos: 1, temporadas: "13" },
  { rank: 4, nombre: "Carlos Romero", titulos: 1, temporadas: "12" },
  { rank: 4, nombre: "Eudes Pavajeau", titulos: 1, temporadas: "10" },
  { rank: 4, nombre: "Andy Córdoba (Pingui)", titulos: 1, temporadas: "9" },
  { rank: 4, nombre: "Cristian Benjumea", titulos: 1, temporadas: "8" },
  { rank: 4, nombre: "Camilo Laborde", titulos: 1, temporadas: "6" },
  { rank: 4, nombre: "Pier Rizo", titulos: 1, temporadas: "5" },
  { rank: 4, nombre: "Jairo Galván", titulos: 1, temporadas: "4" },
  { rank: 4, nombre: "Henry Hernández", titulos: 1, temporadas: "2" },
];
