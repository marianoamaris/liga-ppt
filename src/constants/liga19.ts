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

const filaTablaCero = (equipo: string) => ({
  equipo,
  pj: 0,
  victorias: 0,
  empates: 0,
  derrotas: 0,
  porcentajeVictorias: 0,
  puntos: 0,
});

const filaJornadaCero = (equipo: string) => ({
  equipo,
  pj: 0,
  v: 0,
  e: 0,
  d: 0,
  puntos: 0,
  porcentajeVictorias: 0,
});

/** Datos de clasificación Liga #19 (inicio de temporada — todo en cero). */
export const LIGA_19 = {
  tablaGeneral: EQUIPOS_L19.map(filaTablaCero),
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
