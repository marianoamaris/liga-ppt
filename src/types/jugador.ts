/** Tipos del catálogo servido por la API (tablas jugadores / ediciones). */

export type Posicion = "arquero" | "defensa" | "mediocampista" | "delantero";

/** Fila de la tabla `jugadores`, tal cual la devuelve la API. */
export interface Jugador {
  id: string;
  slug: string;
  nombre: string;
  apodo: string | null;
  username: string | null;
  posicion: Posicion;
  es_fundador: boolean;
  es_admin: boolean;
  activo: boolean;
  /** Nombre del archivo en `assets/FOTOS_JUGADORES/`; puede no existir. */
  foto_archivo: string | null;
  ligas_jugadas: number;
  ligas_ganadas: number;
  goles_historicos: number;
  identidad_incierta: boolean;
}

export interface Edicion {
  numero: number;
  nombre: string | null;
  tematica: string | null;
  descripcion: string | null;
  estado: "historica" | "activa" | "proxima";
  total_jornadas: number;
  campeon_slug: string | null;
  subcampeon_slug: string | null;
  /** `partidos` = derivable de eventos; `agregados` = totales heredados. */
  fuente_datos: "partidos" | "agregados";
}

export interface EdicionEquipo {
  edicion: number;
  slug: string;
  nombre: string;
  color_hex: string | null;
  color_hex_2: string | null;
  color_slug: string | null;
  imagen: string | null;
  orden: number | null;
}

export interface PlantillaJugador {
  nombre: string;
  esArquero: boolean;
  esCapitan: boolean;
  jugador: Pick<Jugador, "slug" | "nombre" | "posicion" | "foto_archivo"> | null;
}

export interface EquipoConPlantilla extends EdicionEquipo {
  jugadores: PlantillaJugador[];
  arqueroDesignado: string | null;
  capitan: string | null;
}

/**
 * Forma que consumían los componentes cuando los datos vivían en
 * `constants/USUARIOS_LIGA.ts`. Se mantiene para que la migración no obligue a
 * reescribir cada vista de golpe.
 */
export interface UsuarioLiga {
  name: string;
  username: string;
  avatar?: string | null;
  ligasJugadas: number;
  esFundador?: boolean;
  ligasGanadas: number;
  esAdmin: boolean;
  golesTotales: number;
  posicion: Posicion;
}

export function jugadorAUsuarioLiga(j: Jugador): UsuarioLiga {
  return {
    name: j.nombre,
    username: j.username ?? j.slug,
    avatar: null,
    ligasJugadas: j.ligas_jugadas,
    esFundador: j.es_fundador,
    ligasGanadas: j.ligas_ganadas,
    esAdmin: j.es_admin,
    golesTotales: j.goles_historicos,
    posicion: j.posicion,
  };
}
