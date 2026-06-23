export interface FixtureGrupo {
  cancha: number;
  lugar?: string;
  equiposIds: string[];
}

export interface FixtureJornada {
  jornada?: number;
  fecha?: string;
  grupos: FixtureGrupo[];
}

export const PROXIMA_JORNADA_LIGA19: FixtureJornada = {
  jornada: 5,
  fecha: "Jueves 25 de Junio",
  grupos: [
    { lugar: "La Jugada", cancha: 4, equiposIds: ["francia", "noruega", "mexico"] },
    { lugar: "O. Geles",  cancha: 2, equiposIds: ["argentina", "corea-del-sur", "brasil"] },
    { lugar: "O. Geles",  cancha: 3, equiposIds: ["portugal", "paises-bajos", "alemania"] },
  ],
};
