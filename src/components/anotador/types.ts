import type { EquipoLocal } from "../../types/jugador";

export type ModoPartido = "jornada" | "cuartos" | "semifinal" | "final";

export interface JugadorEnCancha {
  nombre: string;
}

export interface EquipoEnCancha {
  equipo: EquipoLocal;
  jugadores: JugadorEnCancha[];
  arqueroDesignado?: string;
}

export interface EventoGol {
  id: string;
  goleador: string;
  equipoGoleadorId: string;
  equipoArqueroId: string;
  tiempoEnMarcador: number;
}

export interface EventoEmpate {
  id: string;
  equipoAId: string;
  equipoBId: string;
  tiempoEnMarcador: number;
}

export type RazonAmarilla =
  | "llegada-tarde"
  | "halar-peto"
  | "falta-temeraria"
  | "falta-tactica"
  | "falta"
  | "falta-respeto";

export interface EventoAmarilla {
  id: string;
  jugador: string;
  equipoId: string;
  razon: RazonAmarilla;
  tiempoEnMarcador: number;
}

export interface EventoRoja {
  id: string;
  jugador: string;
  equipoId: string;
  /** Opcional: las expulsiones anotadas antes de que el reloj viajara con el
   *  evento se guardaron sin él, y siguen en la base. */
  tiempoEnMarcador?: number;
}

export interface EventoAutogol {
  id: string;
  equipoAutogolId: string; // equipo que se metió el gol en contra
  equipoGanadorId: string; // equipo que recibe la victoria
  tiempoEnMarcador: number;
}

/** Cómo se desempató un playoff que terminó igualado. */
export type MetodoDefinicion = "tabla" | "penales";

/**
 * Desempate de un playoff.
 *
 * Los cuartos igualados los gana el equipo mejor ubicado en la tabla general;
 * semifinal y final van a penales al mejor de tres y, si siguen empatados, a
 * muerte súbita. El marcador del partido no se toca: el desempate no es un gol,
 * así que viaja como su propio evento y de ahí lo lee el cuadro.
 */
/** Un penal de la tanda, en el orden en que se cobró. */
export interface TiroPenal {
  id: string;
  equipoId: string;
  jugador: string;
  convertido: boolean;
}

export interface EventoDefinicion {
  id: string;
  metodo: MetodoDefinicion;
  ganadorId: string;
  /** Penales convertidos por cada equipo, muerte súbita incluida. */
  penales?: {
    equipoAId: string;
    golesA: number;
    equipoBId: string;
    golesB: number;
    /** Cada cobro con su ejecutor; `golesA`/`golesB` son su resumen. */
    tiros?: TiroPenal[];
  };
  tiempoEnMarcador: number;
}

export type Evento =
  | { tipo: "gol"; data: EventoGol }
  | { tipo: "autogol"; data: EventoAutogol }
  | { tipo: "empate"; data: EventoEmpate }
  | { tipo: "amarilla"; data: EventoAmarilla }
  | { tipo: "roja"; data: EventoRoja }
  | { tipo: "definicion"; data: EventoDefinicion };

export interface TeamScore {
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
}

export type PartidoConfig =
  | {
      modo: "jornada";
      jornada: number; // 1-6
      equipos: [EquipoEnCancha, EquipoEnCancha, EquipoEnCancha];
    }
  | {
      modo: "cuartos" | "semifinal" | "final";
      jornada?: never;
      equipos: [EquipoEnCancha, EquipoEnCancha];
    };

export interface PartidoVivo {
  config: PartidoConfig;
  eventos: Evento[];
  iniciadoEn: number;
}
