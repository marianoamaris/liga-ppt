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
  jornadas: [
    {
      nombre: "Jornada 1",
      resultados: [
        { equipo: "Brasil",        pj: 20, v: 11, e: 4, d: 5, puntos: 26, porcentajeVictorias: 55.0 },
        { equipo: "Corea del Sur", pj: 18, v:  9, e: 1, d: 8, puntos: 19, porcentajeVictorias: 50.0 },
        { equipo: "Francia",       pj: 15, v:  8, e: 2, d: 5, puntos: 18, porcentajeVictorias: 53.3 },
        { equipo: "Argentina",     pj: 16, v:  8, e: 1, d: 7, puntos: 17, porcentajeVictorias: 50.0 },
        { equipo: "México",        pj: 18, v:  7, e: 2, d: 9, puntos: 16, porcentajeVictorias: 38.9 },
        { equipo: "Alemania",      pj: 16, v:  6, e: 4, d: 6, puntos: 16, porcentajeVictorias: 37.5 },
        { equipo: "Noruega",       pj: 16, v:  7, e: 1, d: 8, puntos: 15, porcentajeVictorias: 43.8 },
        { equipo: "Portugal",      pj: 15, v:  5, e: 2, d: 8, puntos: 12, porcentajeVictorias: 33.3 },
        { equipo: "Países Bajos",  pj: 14, v:  3, e: 3, d: 8, puntos:  9, porcentajeVictorias: 21.4 },
      ],
    },
    {
      nombre: "Jornada 2",
      resultados: [
        { equipo: "México",        pj: 25, v: 15, e: 1, d:  9, puntos: 31, porcentajeVictorias: 60.0 },
        { equipo: "Noruega",       pj: 23, v: 10, e: 3, d: 10, puntos: 23, porcentajeVictorias: 43.5 },
        { equipo: "Brasil",        pj: 20, v: 10, e: 2, d:  8, puntos: 22, porcentajeVictorias: 50.0 },
        { equipo: "Portugal",      pj: 19, v:  9, e: 1, d:  9, puntos: 19, porcentajeVictorias: 47.4 },
        { equipo: "Corea del Sur", pj: 15, v:  7, e: 4, d:  4, puntos: 18, porcentajeVictorias: 46.7 },
        { equipo: "Argentina",     pj: 19, v:  8, e: 1, d: 10, puntos: 17, porcentajeVictorias: 42.1 },
        { equipo: "Alemania",      pj: 14, v:  6, e: 4, d:  4, puntos: 16, porcentajeVictorias: 42.9 },
        { equipo: "Francia",       pj: 22, v:  7, e: 2, d: 13, puntos: 16, porcentajeVictorias: 31.8 },
        { equipo: "Países Bajos",  pj: 13, v:  2, e: 4, d:  7, puntos:  8, porcentajeVictorias: 15.4 },
      ],
    },
    {
      nombre: "Jornada 3",
      resultados: [
        { equipo: "Corea del Sur", pj: 18, v: 11, e: 4, d:  3, puntos: 26, porcentajeVictorias: 61.1 },
        { equipo: "Argentina",     pj: 19, v:  8, e: 4, d:  7, puntos: 20, porcentajeVictorias: 42.1 },
        { equipo: "Noruega",       pj: 17, v: 10, e: 0, d:  7, puntos: 20, porcentajeVictorias: 58.8 },
        { equipo: "Francia",       pj: 17, v:  7, e: 3, d:  7, puntos: 17, porcentajeVictorias: 41.2 },
        { equipo: "México",        pj: 13, v:  5, e: 5, d:  3, puntos: 15, porcentajeVictorias: 38.5 },
        { equipo: "Países Bajos",  pj: 16, v:  6, e: 3, d:  7, puntos: 15, porcentajeVictorias: 37.5 },
        { equipo: "Brasil",        pj: 13, v:  4, e: 6, d:  3, puntos: 14, porcentajeVictorias: 30.8 },
        { equipo: "Alemania",      pj: 10, v:  1, e: 5, d:  4, puntos:  7, porcentajeVictorias: 10.0 },
        { equipo: "Portugal",      pj: 13, v:  2, e: 1, d: 10, puntos:  5, porcentajeVictorias: 15.4 },
      ],
    },
    ...Array.from({ length: 3 }, (_, i) => ({
      nombre: `Jornada ${i + 4}`,
      resultados: EQUIPOS_L19.map(filaJornadaCero),
    })),
  ],
  goleadoresTotales: [
    { jugador: "Luis Rico",           goles: 6 },
    { jugador: "Andrés Farfán",       goles: 5 },
    { jugador: "José Hernández",      goles: 4 },
    { jugador: "Camilo Yepes",        goles: 4 },
    { jugador: "Jaime Machado",       goles: 3 },
    { jugador: "Juanda Dybala",       goles: 3 },
    { jugador: "Jesús Bullones",      goles: 3 },
    { jugador: "Víctor Castilla",     goles: 3 },
    { jugador: "Carlos Romero",       goles: 3 },
    { jugador: "Nico Yamal",          goles: 3 },
    { jugador: "Juanse López",        goles: 3 },
    { jugador: "Cristian Benjumea",   goles: 2 },
    { jugador: "Jürgen Hassler",      goles: 2 },
    { jugador: "Fabricio Rizo",       goles: 2 },
    { jugador: "Héctor Duque",        goles: 2 },
    { jugador: "Santiago Corzo",      goles: 2 },
    { jugador: "Sebastián Castaño",   goles: 2 },
    { jugador: "Ruber Martínez",      goles: 2 },
    { jugador: "Arnold Castillo",     goles: 2 },
    { jugador: "Eduardo Sarmiento",   goles: 1 },
    { jugador: "Luis Suárez",         goles: 1 },
    { jugador: "Jesús Vergara",       goles: 1 },
    { jugador: "Breiner Corzo",       goles: 1 },
    { jugador: "Jairo Galván",        goles: 1 },
    { jugador: "David Carballo",      goles: 1 },
    { jugador: "Jeison Santa",        goles: 1 },
    { jugador: "Kevin Pineda",        goles: 1 },
  ],
  arqueros: [
    { arquero: "Fernando Gómez",   golesRecibidos: 5 },
    { arquero: "Brayan Cadena",    golesRecibidos: 5 },
    { arquero: "Luis Fonseca",     golesRecibidos: 6 },
    { arquero: "Brayan Ospino",    golesRecibidos: 7 },
    { arquero: "Leonardo Cadena",  golesRecibidos: 8 },
    { arquero: "Hernán García",    golesRecibidos: 8 },
    { arquero: "Santiago Sánchez", golesRecibidos: 8 },
    { arquero: "Pipe Castillejo",  golesRecibidos: 8 },
    { arquero: "Keyner Vides",     golesRecibidos: 9 },
  ],
  cuartos: [] as string[],
  semifinales: [] as string[],
  final: "Por definir",
  ganador: "—",
};
