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


/** Datos de clasificación Liga #19 — finalizado tras Jornada 6. */
export const LIGA_19 = {
  tablaGeneral: [
    { equipo: "México",        pj: 131, victorias: 67, empates: 10, derrotas: 54, puntos: 144, porcentajeVictorias: 51.1 },
    { equipo: "Corea del Sur", pj: 111, victorias: 64, empates:  9, derrotas: 38, puntos: 137, porcentajeVictorias: 57.7 },
    { equipo: "Brasil",        pj: 111, victorias: 51, empates: 21, derrotas: 39, puntos: 123, porcentajeVictorias: 45.9 },
    { equipo: "Francia",       pj: 112, victorias: 51, empates: 13, derrotas: 48, puntos: 115, porcentajeVictorias: 45.5 },
    { equipo: "Países Bajos",  pj: 109, victorias: 44, empates: 18, derrotas: 47, puntos: 106, porcentajeVictorias: 40.4 },
    { equipo: "Noruega",       pj: 107, victorias: 44, empates: 11, derrotas: 52, puntos:  99, porcentajeVictorias: 41.1 },
    { equipo: "Alemania",      pj:  98, victorias: 38, empates: 23, derrotas: 37, puntos:  99, porcentajeVictorias: 38.8 },
    { equipo: "Argentina",     pj:  96, victorias: 35, empates: 12, derrotas: 49, puntos:  82, porcentajeVictorias: 36.5 },
    { equipo: "Portugal",      pj:  97, victorias: 30, empates:  7, derrotas: 60, puntos:  67, porcentajeVictorias: 30.9 },
  ],
  jornadas: [
    {
      nombre: "Jornada 1",
      resultados: [
        { equipo: "Brasil",        pj: 20, v: 11, e: 4, d:  5, puntos: 26, porcentajeVictorias: 55.0 },
        { equipo: "Corea del Sur", pj: 18, v:  9, e: 1, d:  8, puntos: 19, porcentajeVictorias: 50.0 },
        { equipo: "Francia",       pj: 15, v:  8, e: 2, d:  5, puntos: 18, porcentajeVictorias: 53.3 },
        { equipo: "Argentina",     pj: 16, v:  8, e: 1, d:  7, puntos: 17, porcentajeVictorias: 50.0 },
        { equipo: "México",        pj: 18, v:  7, e: 2, d:  9, puntos: 16, porcentajeVictorias: 38.9 },
        { equipo: "Alemania",      pj: 16, v:  6, e: 4, d:  6, puntos: 16, porcentajeVictorias: 37.5 },
        { equipo: "Noruega",       pj: 16, v:  7, e: 1, d:  8, puntos: 15, porcentajeVictorias: 43.8 },
        { equipo: "Portugal",      pj: 15, v:  5, e: 2, d:  8, puntos: 12, porcentajeVictorias: 33.3 },
        { equipo: "Países Bajos",  pj: 14, v:  3, e: 3, d:  8, puntos:  9, porcentajeVictorias: 21.4 },
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
        { equipo: "Corea del Sur", pj: 18, v: 11, e: 1, d:  6, puntos: 23, porcentajeVictorias: 61.1 },
        { equipo: "Noruega",       pj: 17, v: 10, e: 0, d:  7, puntos: 20, porcentajeVictorias: 58.8 },
        { equipo: "Argentina",     pj: 19, v:  8, e: 4, d:  7, puntos: 20, porcentajeVictorias: 42.1 },
        { equipo: "Francia",       pj: 17, v:  7, e: 3, d:  7, puntos: 17, porcentajeVictorias: 41.2 },
        { equipo: "México",        pj: 13, v:  5, e: 5, d:  3, puntos: 15, porcentajeVictorias: 38.5 },
        { equipo: "Países Bajos",  pj: 16, v:  6, e: 3, d:  7, puntos: 15, porcentajeVictorias: 37.5 },
        { equipo: "Brasil",        pj: 13, v:  4, e: 6, d:  3, puntos: 14, porcentajeVictorias: 30.8 },
        { equipo: "Alemania",      pj: 10, v:  1, e: 5, d:  4, puntos:  7, porcentajeVictorias: 10.0 },
        { equipo: "Portugal",      pj: 13, v:  2, e: 1, d: 10, puntos:  5, porcentajeVictorias: 15.4 },
      ],
    },
    {
      nombre: "Jornada 4",
      resultados: [
        { equipo: "Brasil",        pj: 24, v: 15, e: 4, d:  5, puntos: 34, porcentajeVictorias: 62.5 },
        { equipo: "México",        pj: 20, v: 12, e: 0, d:  8, puntos: 24, porcentajeVictorias: 60.0 },
        { equipo: "Corea del Sur", pj: 20, v: 11, e: 1, d:  8, puntos: 23, porcentajeVictorias: 55.0 },
        { equipo: "Francia",       pj: 17, v:  9, e: 5, d:  3, puntos: 23, porcentajeVictorias: 52.9 },
        { equipo: "Países Bajos",  pj: 18, v:  7, e: 4, d:  7, puntos: 18, porcentajeVictorias: 38.9 },
        { equipo: "Argentina",     pj: 14, v:  4, e: 3, d:  7, puntos: 11, porcentajeVictorias: 28.6 },
        { equipo: "Portugal",      pj: 13, v:  4, e: 2, d:  7, puntos: 10, porcentajeVictorias: 30.8 },
        { equipo: "Alemania",      pj: 16, v:  4, e: 1, d: 11, puntos:  9, porcentajeVictorias: 25.0 },
        { equipo: "Noruega",       pj: 14, v:  2, e: 0, d: 12, puntos:  4, porcentajeVictorias: 14.3 },
      ],
    },
    {
      nombre: "Jornada 5",
      resultados: [
        { equipo: "Francia",       pj: 24, v: 15, e: 0, d:  9, puntos: 30, porcentajeVictorias: 62.5 },
        { equipo: "Alemania",      pj: 23, v: 13, e: 3, d:  7, puntos: 29, porcentajeVictorias: 56.5 },
        { equipo: "Corea del Sur", pj: 18, v: 12, e: 1, d:  5, puntos: 25, porcentajeVictorias: 66.7 },
        { equipo: "México",        pj: 23, v: 11, e: 2, d: 10, puntos: 24, porcentajeVictorias: 47.8 },
        { equipo: "Argentina",     pj: 17, v:  7, e: 2, d:  8, puntos: 16, porcentajeVictorias: 41.2 },
        { equipo: "Países Bajos",  pj: 14, v:  6, e: 3, d:  5, puntos: 15, porcentajeVictorias: 42.9 },
        { equipo: "Noruega",       pj: 19, v:  5, e: 2, d: 12, puntos: 12, porcentajeVictorias: 26.3 },
        { equipo: "Brasil",        pj: 15, v:  3, e: 3, d:  9, puntos:  9, porcentajeVictorias: 20.0 },
        { equipo: "Portugal",      pj:  9, v:  1, e: 0, d:  8, puntos:  2, porcentajeVictorias: 11.1 },
      ],
    },
    {
      nombre: "Jornada 6",
      resultados: [
        { equipo: "Países Bajos",  pj: 34, v: 20, e: 1, d: 13, puntos: 41, porcentajeVictorias: 58.8 },
        { equipo: "México",        pj: 32, v: 17, e: 0, d: 15, puntos: 34, porcentajeVictorias: 53.1 },
        { equipo: "Corea del Sur", pj: 22, v: 14, e: 1, d:  7, puntos: 29, porcentajeVictorias: 63.6 },
        { equipo: "Noruega",       pj: 18, v: 10, e: 5, d:  3, puntos: 25, porcentajeVictorias: 55.6 },
        { equipo: "Alemania",      pj: 19, v:  8, e: 6, d:  5, puntos: 22, porcentajeVictorias: 42.1 },
        { equipo: "Portugal",      pj: 28, v:  9, e: 1, d: 18, puntos: 19, porcentajeVictorias: 32.1 },
        { equipo: "Brasil",        pj: 19, v:  8, e: 2, d:  9, puntos: 18, porcentajeVictorias: 42.1 },
        { equipo: "Francia",       pj: 17, v:  5, e: 1, d: 11, puntos: 11, porcentajeVictorias: 29.4 },
        { equipo: "Argentina",     pj: 11, v:  0, e: 1, d: 10, puntos:  1, porcentajeVictorias:  0.0 },
      ],
    },
  ],
  goleadoresTotales: [
    { jugador: "Jürgen Hassler",      goles: 29 },
    { jugador: "Eduardo Sarmiento",   goles: 27 },
    { jugador: "Ruber Martínez",      goles: 23 },
    { jugador: "Luis Rico",           goles: 20 },
    { jugador: "José Hernández",      goles: 17 },
    { jugador: "Juanda Dybala",       goles: 15 },
    { jugador: "Jesús Bullones",      goles: 15 },
    { jugador: "Sebastián Castaño",   goles: 14 },
    { jugador: "Andrés Farfán",       goles: 14 },
    { jugador: "Víctor Castilla",     goles: 14 },
    { jugador: "Santiago Corzo",      goles: 12 },
    { jugador: "Camilo Yepes",        goles: 12 },
    { jugador: "Jairo Galván",        goles: 12 },
    { jugador: "Fabricio Rizo",       goles: 11 },
    { jugador: "Jesús Vergara",       goles: 10 },
    { jugador: "Hernán Medrano",      goles: 10 },
    { jugador: "Arnold Castillo",     goles: 10 },
    { jugador: "Juan DLC",            goles: 10 },
    { jugador: "Esteban Hinojosa",    goles:  9 },
    { jugador: "Jaime Machado",       goles:  9 },
    { jugador: "Víctor López",        goles:  8 },
    { jugador: "Breiner Corzo",       goles:  8 },
    { jugador: "Henry Hernández",     goles:  7 },
    { jugador: "Orlando Díaz",        goles:  7 },
    { jugador: "Nico Yamal",          goles:  7 },
    { jugador: "Kevin Pineda",        goles:  6 },
    { jugador: "Juanse López",        goles:  6 },
    { jugador: "Óscar Mendoza",       goles:  5 },
    { jugador: "Carlos Romero",       goles:  5 },
    { jugador: "Héctor Vanegas Jr",   goles:  5 },
    { jugador: "Keiler Fonseca",      goles:  4 },
    { jugador: "José Mosquera",       goles:  4 },
    { jugador: "Luis Suárez",         goles:  4 },
    { jugador: "Eudes Pavajeau",      goles:  4 },
    { jugador: "Matías Ojeda",        goles:  4 },
    { jugador: "Keyner Vides",        goles:  3 },
    { jugador: "Jereimy Niebles",     goles:  3 },
    { jugador: "Cristian Benjumea",   goles:  3 },
    { jugador: "Héctor Duque",        goles:  3 },
    { jugador: "Andrés Paez",         goles:  3 },
    { jugador: "Ronald Rojas",        goles:  3 },
    { jugador: "Andrés Blanco",       goles:  2 },
    { jugador: "Jesús De La Barrera", goles:  2 },
    { jugador: "Juanse Pinedo",       goles:  2 },
    { jugador: "Carlos Armenta",      goles:  2 },
    { jugador: "Juan Mora",           goles:  2 },
    { jugador: "Frederick Molina",    goles:  2 },
    { jugador: "Narent Rojas",        goles:  1 },
    { jugador: "Edwin Martínez",      goles:  1 },
    { jugador: "Luis Serje",          goles:  1 },
    { jugador: "Ian Nedd",            goles:  1 },
    { jugador: "Andy Córdoba",        goles:  1 },
    { jugador: "David Carballo",      goles:  1 },
    { jugador: "Jeison Santa",        goles:  1 },
    { jugador: "Darío Daza",          goles:  1 },
    { jugador: "Ernesto Lacera",      goles:  1 },
    { jugador: "Carlos Vega",         goles:  1 },
  ],
  arqueros: [
    { arquero: "Luis Fonseca",     golesRecibidos: 37, pj:  98 },
    { arquero: "Leonardo Cadena",  golesRecibidos: 38, pj: 111 },
    { arquero: "Fernando Gómez",   golesRecibidos: 39, pj: 111 },
    { arquero: "Santiago Sánchez", golesRecibidos: 47, pj: 109 },
    { arquero: "Jherson Orozco",   golesRecibidos: 48, pj: 112 },
    { arquero: "Brayan Ospino",    golesRecibidos: 49, pj:  96 },
    { arquero: "Hernán García",    golesRecibidos: 52, pj: 107 },
    { arquero: "Keyner Vides",     golesRecibidos: 54, pj: 131 },
    { arquero: "Pipe Castillejo",  golesRecibidos: 60, pj:  97 },
  ],
  cuartos: [] as string[],
  semifinales: [] as string[],
  final: "Por definir",
  ganador: "—",
};
