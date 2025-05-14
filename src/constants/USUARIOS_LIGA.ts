export type Posicion = "arquero" | "defensa" | "mediocampista" | "delantero";

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

export const USUARIOS_LIGA: UsuarioLiga[] = [
  {
    name: "Mariano Amaris",
    username: "sirama",
    avatar: null,
    ligasJugadas: 13,
    esFundador: true,
    ligasGanadas: 4,
    esAdmin: true,
    golesTotales: 57,
    posicion: "mediocampista",
  },
  {
    name: "Juan de la Cruz",
    username: "jdlc",
    avatar: null,
    ligasJugadas: 13,
    esFundador: true,
    ligasGanadas: 1,
    esAdmin: true,
    golesTotales: 99,
    posicion: "delantero",
  },
  {
    name: "Juan Mora",
    username: "jmora",
    avatar: null,
    ligasJugadas: 13,
    esFundador: true,
    ligasGanadas: 3,
    esAdmin: true,
    golesTotales: 99,
    posicion: "delantero",
  },

  {
    name: "Elias Lacera",
    username: "elacera",
    avatar: null,
    ligasJugadas: 13,
    esFundador: true,
    ligasGanadas: 1,
    esAdmin: true,
    golesTotales: 19,
    posicion: "mediocampista",
  },
  {
    name: "Andy Cordoba",
    username: "acordoba",
    avatar: null,
    ligasJugadas: 7,
    esFundador: false,
    ligasGanadas: 3,
    esAdmin: true,
    golesTotales: 27,
    posicion: "mediocampista",
  },
  {
    name: "Jesús Pertuz",
    username: "jpertuz",
    avatar: null,
    ligasJugadas: 4,
    esFundador: false,
    ligasGanadas: 0,
    esAdmin: true,
    golesTotales: 14,
    posicion: "defensa",
  },
  {
    name: "Eudes Pavajeau",
    username: "epavajeau",
    avatar: null,
    ligasJugadas: 10,
    esFundador: false,
    ligasGanadas: 3,
    esAdmin: true,
    golesTotales: 37,
    posicion: "delantero",
  },
];
