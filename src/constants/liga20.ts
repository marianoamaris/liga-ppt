import imgAmarillo from "../assets/LIGA_20/Amarillo.png";
import imgAzul from "../assets/LIGA_20/Azul.png";
import imgBlanco from "../assets/LIGA_20/Blanco.png";
import imgMorado from "../assets/LIGA_20/Morado.png";
import imgNaranja from "../assets/LIGA_20/Naranja.png";
import imgNegro from "../assets/LIGA_20/Negro.png";
import imgRojo from "../assets/LIGA_20/Rojo.png";
import imgRosado from "../assets/LIGA_20/Rosado.png";
import imgVerde from "../assets/LIGA_20/Verde.png";

export type Liga20Equipo = {
  /** Slug del club (imagen en `assets/LIGA_20/` según color de camiseta) */
  id: string;
  /** Club en la Edición Premier League */
  nombre: string;
  imagen: string;
};

/**
 * Liga #20 – club según color de camiseta:
 * amarillo→Brighton, azul→Manchester City, blanco→Tottenham Hotspur,
 * morado→Aston Villa, naranja→Hull City, negro→Newcastle,
 * rojo→Arsenal, rosado→Crystal Palace, verde→Liverpool
 */
// IDs coinciden exactamente con los del backend
export const LIGA_20_EQUIPOS: Liga20Equipo[] = [
  { id: "brighton",        nombre: "Brighton",         imagen: imgAmarillo },
  { id: "manchester-city", nombre: "Manchester City",  imagen: imgAzul },
  { id: "liverpool",       nombre: "Liverpool",        imagen: imgVerde },
  { id: "newcastle",       nombre: "Newcastle",        imagen: imgNegro },
  { id: "crystal-palace",  nombre: "Crystal Palace",   imagen: imgRosado },
  { id: "tottenham",       nombre: "Tottenham Hotspur", imagen: imgBlanco },
  { id: "aston-villa",     nombre: "Aston Villa",      imagen: imgMorado },
  { id: "hull-city",       nombre: "Hull City",        imagen: imgNaranja },
  { id: "arsenal",         nombre: "Arsenal",          imagen: imgRojo },
];

export const LIGA_20_DESTACADO = {
  titulo: "Edición #20 · Premier League",
  subtitulo: "Nueva temporada Liga PPT",
  descripcion:
    "¡Arranca la temporada 20 con temática Premier League! Nueve clubes ingleses, nuevas plantillas y todo desde cero. Conoce a los equipos de esta edición.",
} as const;
