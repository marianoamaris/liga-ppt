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
  subtitulo: string | null;
  tematica: string | null;
  descripcion: string | null;
  estado: "historica" | "activa" | "proxima";
  total_jornadas: number;
  campeon_slug: string | null;
  subcampeon_slug: string | null;
  /** Resueltos por la API a partir del slug; solo en el listado de ediciones. */
  campeon_nombre?: string | null;
  campeon_color?: string | null;
  /** `partidos` = derivable de eventos; `agregados` = totales heredados. */
  fuente_datos: "partidos" | "agregados";
}

/**
 * Equipo tal como lo consumen las vistas de partido: identificador, nombre y
 * camiseta ya resuelta. Es la forma que antes exportaba `constants/liga20.ts`.
 */
export interface EquipoLocal {
  id: string;
  nombre: string;
  imagen: string;
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

/** Color de camiseta del equipo en una final. */
export type ColorCamiseta =
  | "azul"
  | "rojo"
  | "verde"
  | "morado"
  | "negro"
  | "rosado"
  | "blanco"
  | "naranja"
  | "amarillo";

export type ResultadoFinal = "1" | "2" | "empate" | "pendiente";

/** Fila de `edicion_finales`, tal cual la devuelve la API. */
export interface EdicionFinal {
  edicion: number;
  equipo1_slug: string;
  equipo2_slug: string;
  equipo1_nombre: string;
  equipo2_nombre: string;
  goles1: number | null;
  goles2: number | null;
  color1: ColorCamiseta | null;
  color2: ColorCamiseta | null;
  resultado: ResultadoFinal;
  nota_marcador: string | null;
}

/** Forma que consumía la vista cuando los datos vivían en `HISTORICO_FINALES.ts`. */
export interface FinalHistorica {
  temporada: number;
  equipo1: string;
  equipo2: string;
  goles1: number | null;
  goles2: number | null;
  color1: ColorCamiseta;
  color2: ColorCamiseta;
  resultado: ResultadoFinal;
  notaMarcador?: string;
}

export function finalAHistorica(f: EdicionFinal): FinalHistorica {
  return {
    temporada: f.edicion,
    equipo1: f.equipo1_nombre,
    equipo2: f.equipo2_nombre,
    goles1: f.goles1,
    goles2: f.goles2,
    // La base guarda el color como texto libre; si faltara, "blanco" es el
    // chip neutro y la fila sigue siendo legible.
    color1: f.color1 ?? "blanco",
    color2: f.color2 ?? "blanco",
    resultado: f.resultado,
    ...(f.nota_marcador ? { notaMarcador: f.nota_marcador } : {}),
  };
}

/** Fila de clasificación. Las ediciones antiguas solo registraban puntos. */
export interface FilaClasificacion {
  edicion: number;
  equipo_slug: string;
  posicion: number;
  pj: number | null;
  victorias: number | null;
  empates: number | null;
  derrotas: number | null;
  puntos: number;
}

export interface JornadaEdicion {
  jornada: number;
  resultados: FilaClasificacion[];
}

export interface GoleadorEdicion {
  jugador_nombre: string;
  jugador_id: string | null;
  /** Solo viene en las ediciones derivadas de partidos. */
  equipo_slug?: string | null;
  goles: number;
  posicion: number;
}

export interface ArqueroEdicion {
  jugador_nombre: string;
  jugador_id: string | null;
  equipo_slug: string | null;
  goles_recibidos: number;
  pj: number | null;
}

/** Respuesta de `/historico/:numero`, ya sea de agregados o de partidos. */
export interface HistoricoEdicion {
  edicion: Edicion;
  equipos: EdicionEquipo[];
  clasificacion: FilaClasificacion[];
  jornadas: JornadaEdicion[];
  goleadores: GoleadorEdicion[];
  arqueros: ArqueroEdicion[];
  final: EdicionFinal | null;
  origen: "agregados" | "partidos";
}

export type TipoPalmares =
  | "bota_oro"
  | "guante_oro"
  | "mvp_liga"
  | "mvp_final"
  | "capitan_campeon"
  | "goles_historicos";

/** Referencia mínima al jugador que devuelve la API junto a cada récord. */
export type JugadorRef = Pick<
  Jugador,
  "slug" | "nombre" | "apodo" | "foto_archivo"
> & { posicion?: Posicion };

export interface FilaPalmares {
  jugador_nombre: string;
  tipo: TipoPalmares;
  cantidad: number;
  /** En capitanes, las temporadas en que ganó con el brazalete. */
  detalle: string | null;
  jugadores: JugadorRef | null;
}

export interface JugadorTitulos {
  jugador_nombre: string;
  jugador: JugadorRef | null;
  ligas: number[];
  champions: number;
  mundial: number;
  total: number;
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
