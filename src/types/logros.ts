/** Récords vivos de una sede: ver `logrosService` en el backend. */

export type IdRecord =
  | "goles_liga"
  | "goles_sesion"
  | "menos_recibidos"
  | "racha_marcando"
  | "gol_rapido"
  | "goles_playoffs"
  | "penales"
  | "amarillas"
  | "puntos_liga"
  | "menos_puntos_liga"
  | "puntos_jornada"
  | "menos_puntos_jornada"
  | "racha_victorias"
  | "racha_invicto"
  | "racha_derrotas"
  | "racha_sin_ganar"
  | "goles_favor"
  | "menos_goles_contra";

export interface Marca {
  /** Empatados comparten puesto: 1, 1, 3. */
  posicion: number;
  valor: number;
  jugador: { slug: string | null; nombre: string; foto_archivo: string | null } | null;
  equipo: { nombre: string; color_hex: string | null } | null;
  edicion: number | null;
  numero_sede: number | null;
  jornada: number | null;
  ronda: string | null;
}

export interface RecordVivo {
  id: IdRecord;
  familia: "jugador" | "equipo";
  ascendente: boolean;
  marcas: Marca[];
}

export interface LogrosSede {
  sede_id: string;
  records: RecordVivo[];
}
