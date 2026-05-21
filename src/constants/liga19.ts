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
  id: string;
  /** Nombre visible en la home (camiseta / color del equipo) */
  nombre: string;
  imagen: string;
};

/** Equipos Liga #19 – Edición Mundial (fotos en `assets/LIGA_19/`). */
export const LIGA_19_EQUIPOS: Liga19Equipo[] = [
  { id: "amarillo", nombre: "Amarillo", imagen: imgAmarillo },
  { id: "azul", nombre: "Azul", imagen: imgAzul },
  { id: "blanco", nombre: "Blanco", imagen: imgBlanco },
  { id: "morado", nombre: "Morado", imagen: imgMorado },
  { id: "naranja", nombre: "Naranja", imagen: imgNaranja },
  { id: "negro", nombre: "Negro", imagen: imgNegro },
  { id: "rojo", nombre: "Rojo", imagen: imgRojo },
  { id: "rosado", nombre: "Rosado", imagen: imgRosado },
  { id: "verde", nombre: "Verde", imagen: imgVerde },
];

export const LIGA_19_DESTACADO = {
  titulo: "Edición #19 · Mundial",
  subtitulo: "Destacado Liga PPT",
  descripcion:
    "La temporada 19 llega con temática Copa del Mundo 2026: equipos con nombres de selecciones clasificadas y premios especiales. Conoce a los equipos de esta edición.",
} as const;
