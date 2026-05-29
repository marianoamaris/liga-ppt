import imgAmarillo from "../assets/LIGA_19/Amarillo.png";
import imgAzul from "../assets/LIGA_19/Azul.png";
import imgBlanco from "../assets/LIGA_19/Blanco.png";
import imgMorado from "../assets/LIGA_19/Morado.png";
import imgNaranja from "../assets/LIGA_19/Naranja.png";
import imgNegro from "../assets/LIGA_19/Negro.png";
import imgRojo from "../assets/LIGA_19/Rojo.png";
import imgRosado from "../assets/LIGA_19/Rosado.png";
import imgVerde from "../assets/LIGA_19/Verde.png";

export type Liga19Equipo = {
  /** Slug del color de camiseta (archivo en `assets/LIGA_19/`) */
  id: string;
  /** Selección / país en la Edición Mundial */
  nombre: string;
  imagen: string;
};

/**
 * Liga #19 – selección según color de camiseta:
 * amarillo→Brasil, azul→Argentina, verde→México, negro→Alemania,
 * rosado→Noruega, blanco→Francia, morado→Corea del Sur, naranja→Países Bajos, rojo→Portugal
 */
// IDs coinciden exactamente con los del backend
export const LIGA_19_EQUIPOS: Liga19Equipo[] = [
  { id: "brasil",        nombre: "Brasil",        imagen: imgAmarillo },
  { id: "argentina",     nombre: "Argentina",     imagen: imgAzul },
  { id: "mexico",        nombre: "México",        imagen: imgVerde },
  { id: "alemania",      nombre: "Alemania",      imagen: imgNegro },
  { id: "noruega",       nombre: "Noruega",       imagen: imgRosado },
  { id: "francia",       nombre: "Francia",       imagen: imgBlanco },
  { id: "corea-del-sur", nombre: "Corea del Sur", imagen: imgMorado },
  { id: "paises-bajos",  nombre: "Países Bajos",  imagen: imgNaranja },
  { id: "portugal",      nombre: "Portugal",      imagen: imgRojo },
];

export const LIGA_19_DESTACADO = {
  titulo: "Edición #19 · Mundial",
  subtitulo: "Destacado Liga PPT",
  descripcion:
    "La temporada 19 llega con temática Copa del Mundo 2026: equipos con nombres de selecciones clasificadas y premios especiales. Conoce a los equipos de esta edición.",
} as const;

const EQUIPOS_L19 = LIGA_19_EQUIPOS.map((e) => e.nombre);


const filaJornadaCero = (equipo: string) => ({
  equipo,
  pj: 0,
  v: 0,
  e: 0,
  d: 0,
  puntos: 0,
  porcentajeVictorias: 0,
});

/** Datos de clasificación Liga #19 — actualizado tras Jornada 1. */
export const LIGA_19 = {
  tablaGeneral: [
    { equipo: "Brasil",        pj: 20, victorias: 11, empates: 4, derrotas: 5, puntos: 26, porcentajeVictorias: 55.0 },
    { equipo: "Corea del Sur", pj: 18, victorias:  9, empates: 1, derrotas: 8, puntos: 19, porcentajeVictorias: 50.0 },
    { equipo: "Francia",       pj: 15, victorias:  8, empates: 2, derrotas: 5, puntos: 18, porcentajeVictorias: 53.3 },
    { equipo: "Argentina",     pj: 16, victorias:  8, empates: 1, derrotas: 7, puntos: 17, porcentajeVictorias: 50.0 },
    { equipo: "México",        pj: 18, victorias:  7, empates: 2, derrotas: 9, puntos: 16, porcentajeVictorias: 38.9 },
    { equipo: "Alemania",      pj: 16, victorias:  6, empates: 4, derrotas: 6, puntos: 16, porcentajeVictorias: 37.5 },
    { equipo: "Noruega",       pj: 16, victorias:  7, empates: 1, derrotas: 8, puntos: 15, porcentajeVictorias: 43.8 },
    { equipo: "Portugal",      pj: 15, victorias:  5, empates: 2, derrotas: 8, puntos: 12, porcentajeVictorias: 33.3 },
    { equipo: "Países Bajos",  pj: 14, victorias:  3, empates: 3, derrotas: 8, puntos:  9, porcentajeVictorias: 21.4 },
  ],
  jornadas: Array.from({ length: 6 }, (_, i) => ({
    nombre: `Jornada ${i + 1}`,
    resultados: EQUIPOS_L19.map(filaJornadaCero),
  })),
  goleadoresTotales: [] as { jugador: string; goles: number }[],
  arqueros: [] as { arquero: string; golesRecibidos: number }[],
  cuartos: [] as string[],
  semifinales: [] as string[],
  final: "Por definir",
  ganador: "—",
};
