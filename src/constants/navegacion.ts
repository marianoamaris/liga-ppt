import type { IconType } from "react-icons";
import { GiSoccerKick, GiWhistle } from "react-icons/gi";
import { FaHome } from "react-icons/fa";
import {
  FaBullhorn,
  FaEllipsis,
  FaHandshake,
  FaMedal,
  FaRankingStar,
  FaSignal,
  FaUserPlus,
} from "react-icons/fa6";

export interface Destino {
  id: string;
  label: string;
  path: string;
  Icono: IconType;
}

export interface GrupoNav {
  id: string;
  /** Título del grupo. El primero no lleva, es lo que se usa a diario. */
  titulo?: string;
  destinos: Destino[];
}

/**
 * Navegación agrupada por frecuencia de uso, no por orden de creación.
 *
 * El primer grupo es lo que se consulta durante o justo después de un partido:
 * son los únicos que caben en la barra inferior del móvil. El resto vive
 * detrás de «Más» en móvil y en bloques separados en escritorio.
 */
export const NAVEGACION: GrupoNav[] = [
  {
    id: "diario",
    destinos: [
      { id: "inicio", label: "Inicio", path: "/", Icono: FaHome },
      { id: "en-vivo", label: "En vivo", path: "/en-vivo", Icono: FaSignal },
      {
        id: "clasificacion",
        label: "Clasificación",
        path: "/clasificacion",
        Icono: FaRankingStar,
      },
    ],
  },
  {
    id: "liga",
    titulo: "La liga",
    destinos: [
      { id: "historia", label: "Historia", path: "/historia", Icono: GiWhistle },
      { id: "logros", label: "Logros", path: "/logros", Icono: FaMedal },
    ],
  },
  {
    id: "comunidad",
    titulo: "Comunidad",
    destinos: [
      { id: "anuncios", label: "Anuncios", path: "/anuncios", Icono: FaBullhorn },
      {
        id: "patrocinadores",
        label: "Patrocinadores",
        path: "/patrocinadores",
        Icono: FaHandshake,
      },
      {
        id: "participar",
        label: "Participar",
        path: "/participa-en-la-liga-ppt",
        Icono: FaUserPlus,
      },
      { id: "contacto", label: "Contacto", path: "/contacto", Icono: GiSoccerKick },
    ],
  },
];

/** Los tres destinos que caben en la barra inferior, más el cajón. */
export const DESTINOS_MOVIL = NAVEGACION[0].destinos;

/** Todo lo que queda detrás de «Más». */
export const GRUPOS_SECUNDARIOS = NAVEGACION.slice(1);

export const ICONO_MAS = FaEllipsis;

/** Escudo de la liga, servido desde `public/`. */
export const ESCUDO = "/ligaPPT-escudo.png";
