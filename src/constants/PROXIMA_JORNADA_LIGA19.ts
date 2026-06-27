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
  jornada: 6,
  fecha: "Jueves 2 de Julio",
  grupos: [
    { lugar: "La Jugada", cancha: 4, equiposIds: ["noruega", "argentina", "alemania"] },
    { lugar: "O. Geles",  cancha: 2, equiposIds: ["mexico", "paises-bajos", "francia"] },
    { lugar: "O. Geles",  cancha: 3, equiposIds: ["brasil", "corea-del-sur", "portugal"] },
  ],
};
