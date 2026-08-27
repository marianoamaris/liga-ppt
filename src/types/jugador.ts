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
  /** Ciudades en las que juega. El padrón es único: alguien puede estar en varias. */
  sedes?: string[];
}

/** Fila de la tabla `sedes`: una ciudad donde se juega la liga. */
export interface Sede {
  id: string;
  nombre: string;
  ciudad: string;
  color_hex: string | null;
  rango_base: number;
  activa: boolean;
  orden: number | null;
  /** Días de jornada en numeración ISO: 1 = lunes … 7 = domingo. */
  dias_jornada: number[];
  /** Hora local, como "19:00:00". */
  hora_inicio: string;
  hora_fin: string;
  /** Edición en curso de esta sede; null si no hay ninguna abierta. */
  edicion_activa: EdicionRef | null;
}

/**
 * Cómo se nombra una edición. `numero` es la clave interna y global con la que
 * se consulta la API; lo que se muestra es `numero_sede` junto a la sede,
 * porque hay una «edición 1» por cada ciudad.
 */
export interface EdicionRef {
  numero: number;
  sede_id: string;
  numero_sede: number;
  nombre?: string | null;
  estado?: "historica" | "activa" | "proxima";
}

export interface Edicion {
  /** Clave interna y global. No mostrar: para eso está `numero_sede`. */
  numero: number;
  sede_id: string;
  /** Número de la edición dentro de su sede; el que ve el usuario. */
  numero_sede: number;
  nombre: string | null;
  subtitulo: string | null;
  tematica: string | null;
  descripcion: string | null;
  estado: "historica" | "activa" | "proxima";
  total_jornadas: number;
  /** Cupo de plantilla de esta edición; Valledupar juega con 8 y Bogotá con 10. */
  jugadores_por_equipo: number;
  campeon_slug: string | null;
  subcampeon_slug: string | null;
  /** Solo en el listado. Cero significa edición abierta pero sin equipos montados. */
  total_equipos?: number;
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
  /** Resueltos por la API a partir de `edicion`; null si la edición no existe. */
  sede_id: string | null;
  numero_sede: number | null;
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
  /** Clave interna y global de la edición; sirve de key, no se muestra. */
  numero: number;
  /** Número visible de la edición dentro de su sede. */
  temporada: number;
  sede_id: string | null;
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
    numero: f.edicion,
    // Las finales anteriores a las sedes se sirven con numero_sede resuelto;
    // el fallback solo cubre una edición huérfana en la base.
    temporada: f.numero_sede ?? f.edicion,
    sede_id: f.sede_id,
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
> & { posicion?: Posicion; username?: string | null };

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
  /** Ediciones ganadas; llegan con sede porque hay una «edición 1» por ciudad. */
  ligas: EdicionRef[];
  champions: number;
  mundial: number;
  total: number;
}

export type TipoRecord =
  | "mas_goles_liga"
  | "mas_goles_jornada"
  | "menos_goles_recibidos"
  | "mas_puntos_equipo"
  | "mas_puntos_jornada"
  | "menos_puntos_jornada"
  | "menos_puntos_equipo";

/**
 * Un puesto del podio de un récord. Conviven dos familias en la misma forma:
 * los de jugador traen `jugador_nombre`, los de equipo `equipo_nombre` y su
 * balance. Nunca las dos a la vez — la base lo garantiza con un CHECK.
 */
export interface FilaRecord {
  sede_id: string;
  tipo: TipoRecord;
  posicion: number;
  valor: number;

  jugador_nombre: string | null;
  jugadores: JugadorRef | null;

  equipo_nombre: string | null;
  equipo_color: string | null;
  victorias: number | null;
  empates: number | null;
  derrotas: number | null;

  /** Clave interna; para mostrar está `numero_sede`. */
  edicion: number | null;
  numero_sede: number | null;
}

/** Un jugador dentro de la plantilla que se está armando en Crear Liga. */
export interface EntradaPlantilla {
  nombre: string;
  /** Presente si salió del padrón; null si es un nombre nuevo aún sin crear. */
  jugador_id: string | null;
  es_arquero: boolean;
  es_capitan: boolean;
}

export interface EquipoBorrador {
  nombre: string;
  color_slug: string;
  jugadores: EntradaPlantilla[];
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
