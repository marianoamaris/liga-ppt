import type { Liga19Equipo } from "../../constants/liga19";

export type ModoPartido = "jornada" | "cuartos" | "semifinal" | "final";

export interface JugadorEnCancha {
  nombre: string;
}

export interface EquipoEnCancha {
  equipo: Liga19Equipo;
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

export type RazonAmarilla = "llegada-tarde" | "falta" | "falta-respeto";

export interface EventoAmarilla {
  id: string;
  jugador: string;
  equipoId: string;
  razon: RazonAmarilla;
  tiempoEnMarcador: number;
}

export interface EventoAutogol {
  id: string;
  equipoAutogolId: string; // equipo que se metió el gol en contra
  equipoGanadorId: string; // equipo que recibe la victoria
  tiempoEnMarcador: number;
}

export type Evento =
  | { tipo: "gol"; data: EventoGol }
  | { tipo: "autogol"; data: EventoAutogol }
  | { tipo: "empate"; data: EventoEmpate }
  | { tipo: "amarilla"; data: EventoAmarilla };

export interface TeamScore {
  victorias: number;
  empates: number;
  derrotas: number;
  puntos: number;
}

export interface PartidoConfig {
  modo: ModoPartido;
  jornada: number; // 0 para playoff
  equipos: EquipoEnCancha[]; // 3 para jornada, 2 para playoff
}

export interface PartidoVivo {
  config: PartidoConfig;
  eventos: Evento[];
  iniciadoEn: number;
}
