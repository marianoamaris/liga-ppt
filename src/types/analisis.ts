/**
 * Lo que devuelven `/analisis/:numero` y `/jugadores/:slug/perfil`.
 *
 * Un «cruce» es un mini-partido dentro de una sesión de jornada: lo cierra el
 * primer gol (2 puntos) o el empate a los ocho minutos (1 punto a cada uno).
 * Los tiempos son segundos dentro del cruce, y vienen a null cuando la sesión
 * se anotó sin reloj: el resultado cuenta, pero no dice cuánto duró.
 */

export type Resultado = "V" | "E" | "D";

export interface JugadorRef {
  /** Slug del padrón; null si el nombre no tiene perfil. */
  slug: string | null;
  nombre: string;
  equipoId: string;
}

export interface ResumenJornada {
  jornada: number;
  sesiones: number;
  cruces: number;
  goles: number;
  empates: number;
  amarillas: number;
  rojas: number;
  tabla: {
    equipoId: string;
    puntos: number;
    victorias: number;
    empates: number;
    derrotas: number;
  }[];
  goleadores: (JugadorRef & { goles: number })[];
  golMasRapido: (JugadorRef & { vsEquipoId: string; segundos: number }) | null;
  vallaMenosVencida: { equipoId: string; recibidos: number; cruces: number } | null;
}

export interface AnalisisEquipo {
  equipoId: string;
  nombre: string;
  evolucion: { jornada: number; puntos: number; posicion: number }[];
  forma: { resultado: Resultado; rivalId: string; jornada: number }[];
  rachaActual: { resultado: Resultado; cruces: number } | null;
  mejorRachaVictorias: number;
  mejorRachaInvicto: number;
  golesFavor: number;
  golesContra: number;
  tiempoMedioGol: number | null;
  tiempoMedioRecibido: number | null;
  cruces: number;
}

export interface EstadisticaJugador extends JugadorRef {
  equipoNombre: string;
  foto_archivo: string | null;
  /** Partidos de su equipo mientras él estaba en la plantilla (el PJ de la tabla). */
  partidos: number;
  goles: number;
  golMasRapido: number | null;
  tiempoMedioGol: number | null;
  tiemposGol: number[];
  amarillas: number;
  rojas: number;
  puntosEquipo: number;
  arquero: { cruces: number; recibidos: number; segundosPorGol: number | null } | null;
}

export interface AnalisisEdicion {
  edicion: number;
  jornadas: ResumenJornada[];
  equipos: AnalisisEquipo[];
  jugadores: EstadisticaJugador[];
}

export interface TramoTrayectoria {
  edicion: number;
  numero_sede: number;
  sede_id: string;
  tematica: string | null;
  estado: "historica" | "activa" | "proxima";
  equipo: { slug: string; nombre: string; color_hex: string | null } | null;
  es_arquero: boolean;
  es_capitan: boolean;
  campeon: boolean;
  goles: number;
  posicion_goleo: number | null;
  /** Goles que recibió como arquero esa edición; null si no fue arquero. */
  recibidos: number | null;
  /** Una fila por equipo; más de una si cambió de equipo a mitad de edición. */
  stats: EstadisticaJugador[];
}

export interface PerfilJugador {
  jugador: import("./jugador").Jugador;
  sedes: {
    sede_id: string;
    ligas_jugadas: number;
    ligas_ganadas: number;
    goles_historicos: number;
    activo: boolean;
    desde: string | null;
  }[];
  palmares: { tipo: string; cantidad: number; detalle: string | null; sede_id: string }[];
  titulos: { tipo: "liga" | "champions" | "mundial"; edicion: number | null; sede_id: string }[];
  trayectoria: TramoTrayectoria[];
}

/** 83 → "1:23". Los cruces duran como mucho ocho minutos. */
export function mmss(segundos: number | null | undefined): string {
  if (segundos == null) return "—";
  const m = Math.floor(segundos / 60);
  const s = Math.round(segundos % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Si la edición tiene partidos anotados; las heredadas llegan vacías. */
export function hayAnalisis(a: AnalisisEdicion | null): a is AnalisisEdicion {
  return !!a && a.jornadas.length > 0;
}
