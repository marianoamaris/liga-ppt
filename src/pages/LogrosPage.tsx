import React, { useState } from "react";
import { Card } from "../components/common/Card";
import { USUARIOS_LIGA } from "../constants/USUARIOS_LIGA";
import { UserCard } from "../components/common/UserCard";

export const LogrosPage: React.FC = () => {
  const RECORDS = [
    { id: "mas_goles_liga", label: "Más goles en una liga" },
    { id: "menos_goles_recibidos", label: "Menos goles recibidos en una liga" },
    {
      id: "mas_puntos_equipo",
      label: "Más puntos hechos por un equipo en una liga",
    },
    {
      id: "menos_puntos_equipo",
      label: "Menos puntos hechos por un equipo en una liga",
    },
  ] as const;
  type RecordId = (typeof RECORDS)[number]["id"];
  const [selectedRecord, setSelectedRecord] =
    useState<RecordId>("mas_goles_liga");

  const recordsData = {
    mas_goles_liga: {
      podium: [
        USUARIOS_LIGA.find((u) => u.username === "enavarro") ?? {
          name: "Emanuel Navarro",
          username: "enavarro",
          ligasJugadas: 11,
          ligasGanadas: 0,
          golesTotales: 118,
          esAdmin: false,
          posicion: "delantero",
        },
        USUARIOS_LIGA.find((u) => u.username === "jhernandez") ?? {
          name: "José Hernández",
          username: "jhernandez",
          ligasJugadas: 3,
          ligasGanadas: 1,
          golesTotales: 106,
          esAdmin: false,
          posicion: "delantero",
        },
        USUARIOS_LIGA.find((u) => u.username === "jhernandez") ?? {
          name: "José Hernández",
          username: "jhernandez",
          ligasJugadas: 3,
          ligasGanadas: 1,
          golesTotales: 106,
          esAdmin: false,
          posicion: "delantero",
        },
      ],
      goles: [33, 31, 29],
      label: "Más goles en una liga",
      type: "user",
    },
    menos_goles_recibidos: {
      podium: [
        USUARIOS_LIGA.find((u) => u.username === "jlaborde") ?? {
          name: "José Laborde",
          username: "jlaborde",
          ligasJugadas: 2,
          ligasGanadas: 1,
          golesTotales: 22,
          esAdmin: false,
          posicion: "arquero",
        },
        USUARIOS_LIGA.find((u) => u.username === "bospino") ?? {
          name: "Brayan Ospino",
          username: "bospino",
          ligasJugadas: 1,
          ligasGanadas: 0,
          golesTotales: 28,
          esAdmin: false,
          posicion: "arquero",
        },
        USUARIOS_LIGA.find((u) => u.username === "nbaute") ?? {
          name: "Nicolás Baute",
          username: "nbaute",
          ligasJugadas: 1,
          ligasGanadas: 0,
          golesTotales: 33,
          esAdmin: false,
          posicion: "arquero",
        },
      ],
      goles: [22, 28, 33],
      label: "Menos goles recibidos en una liga",
      type: "user",
    },
    mas_puntos_equipo: {
      podium: [
        {
          equipo: "Greenworld",
          color: "#22c55e",
          puntos: 186,
          temporada: 7,
          victorias: 85,
          empates: 16,
          derrotas: 28,
        },
        {
          equipo: "Liverpool FC",
          color: "#ef4444",
          puntos: 160,
          temporada: 2,
          victorias: 76,
          empates: 6,
          derrotas: 0,
        },
        {
          equipo: "Sport Boys",
          color: "#FF69B4",
          puntos: 150,
          temporada: 13,
          victorias: 67,
          empates: 16,
          derrotas: 39,
        },
      ],
      label: "Más puntos hechos por un equipo en una liga",
      type: "equipo",
    },
    menos_puntos_equipo: {
      podium: [
        {
          equipo: "Panathinaikos FC",
          color: "#22c55e",
          puntos: 63,
          temporada: 10,
          victorias: 26,
          empates: 11,
          derrotas: 41,
        },
        {
          equipo: "San Marino",
          color: "#f59e42",
          puntos: 69,
          temporada: 11,
          victorias: 26,
          empates: 17,
          derrotas: 53,
        },
        {
          equipo: "Shakhtar Donetsk",
          color: "#f59e42",
          puntos: 77,
          temporada: 9,
          victorias: 31,
          empates: 15,
          derrotas: 52,
        },
      ],
      label: "Menos puntos hechos por un equipo en una liga",
      type: "equipo",
    },
  } as const;
  const data = recordsData[selectedRecord];

  // Card visual para equipos
  const EquipoCard = ({
    equipo,
    color,
    puntos,
    temporada,
    victorias,
    empates,
    derrotas,
  }: {
    equipo: string;
    color: string;
    puntos: number;
    temporada: number;
    victorias?: number;
    empates?: number;
    derrotas?: number;
  }) => {
    // Calcular partidos jugados y % victoria
    const pj = (victorias ?? 0) + (empates ?? 0) + (derrotas ?? 0);
    const porcentaje = pj > 0 ? Math.round(((victorias ?? 0) / pj) * 100) : 0;
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-gray-200 border-2 border-gray-200 rounded-2xl shadow-2xl min-h-[220px] min-w-[220px] px-8 py-6 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="inline-block w-5 h-5 border-2 border-white rounded-full shadow"
            style={{ background: color }}
          />
          <span className="text-lg font-bold text-gray-800">{equipo}</span>
        </div>
        <div className="mb-1 text-xs text-gray-500">Temporada {temporada}</div>
        <div className="mb-3 text-2xl font-extrabold text-blue-700">
          {puntos} pts
        </div>
        <div className="flex flex-col w-full gap-1 mb-2 text-sm font-medium">
          <div className="flex items-center justify-between w-full gap-2">
            <span className="flex items-center gap-1 text-blue-900">
              <span className="text-base">🥅</span> Victorias
            </span>
            <span className="font-bold text-green-700">{victorias ?? 0}</span>
          </div>
          <div className="flex items-center justify-between w-full gap-2">
            <span className="flex items-center gap-1 text-yellow-700">
              <span className="text-base">🟡</span> Empates
            </span>
            <span className="font-bold text-yellow-700">{empates ?? 0}</span>
          </div>
          <div className="flex items-center justify-between w-full gap-2">
            <span className="flex items-center gap-1 text-red-700">
              <span className="text-base">🔴</span> Derrotas
            </span>
            <span className="font-bold text-red-700">{derrotas ?? 0}</span>
          </div>
        </div>
        <div className="relative mt-1 text-xs text-gray-600 cursor-pointer group">
          <span className="font-bold text-blue-700">{porcentaje}%</span> %
          Victoria
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="text-gray-900 bg-white">
        <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-center md:text-left">
            Récords
          </h3>
          <select
            className="w-full px-3 py-1 text-sm font-semibold text-blue-700 transition bg-white border-2 border-blue-500 rounded-lg md:w-3xs focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-700"
            value={selectedRecord}
            onChange={(e) => setSelectedRecord(e.target.value as RecordId)}
          >
            {RECORDS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        {/* Podio visual para usuarios o equipos */}
        {data.type === "user" && data.podium.length > 0 ? (
          <>
            <div className="flex flex-wrap items-end justify-center gap-4 py-6">
              {/* 1er lugar */}
              <div className="flex flex-col items-center">
                <span className="mb-1 text-xl">🏆</span>
                <UserCard
                  user={
                    data.podium[0] ?? {
                      name: "Desconocido",
                      username: "desconocido",
                      ligasJugadas: 0,
                      ligasGanadas: 0,
                      golesTotales: 0,
                      esAdmin: false,
                      posicion: "delantero",
                    }
                  }
                />
                <div className="mt-3 text-xs text-center">
                  <div className="font-semibold text-gray-700">
                    {data.podium[0]?.name}
                  </div>
                  <div className="text-gray-500">{data.goles?.[0]} goles</div>
                </div>
              </div>
              {/* 2do lugar */}
              <div className="flex flex-col items-center">
                <UserCard
                  user={
                    data.podium[1] ?? {
                      name: "Desconocido",
                      username: "desconocido",
                      ligasJugadas: 0,
                      ligasGanadas: 0,
                      golesTotales: 0,
                      esAdmin: false,
                      posicion: "delantero",
                    }
                  }
                />
                <div className="mt-3 text-xs text-center">
                  <div className="font-semibold text-gray-700">
                    {data.podium[1]?.name}
                  </div>
                  <div className="text-gray-500">{data.goles?.[1]} goles</div>
                </div>
              </div>
              {/* 3er lugar */}
              <div className="flex flex-col items-center">
                <UserCard
                  user={
                    data.podium[2] ?? {
                      name: "Desconocido",
                      username: "desconocido",
                      ligasJugadas: 0,
                      ligasGanadas: 0,
                      golesTotales: 0,
                      esAdmin: false,
                      posicion: "delantero",
                    }
                  }
                />
                <div className="mt-3 text-xs text-center">
                  <div className="font-semibold text-gray-700">
                    {data.podium[2]?.name}
                  </div>
                  <div className="text-gray-500">{data.goles?.[2]} goles</div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {data.type === "equipo" && data.podium.length > 0 ? (
          <>
            <div className="flex flex-wrap items-end justify-center gap-4 py-6">
              {/* 1er lugar */}
              <div className="flex flex-col items-center">
                <span className="mb-1 text-xl">🏆</span>
                <EquipoCard {...data.podium[0]} />
                <div className="mt-3 text-xs text-center">
                  <div className="font-semibold text-gray-700">
                    {data.podium[0]?.equipo}
                  </div>
                  <div className="text-gray-500">
                    {data.podium[0]?.puntos} pts
                  </div>
                </div>
              </div>
              {/* 2do lugar */}
              <div className="flex flex-col items-center">
                <EquipoCard {...data.podium[1]} />
                <div className="mt-3 text-xs text-center">
                  <div className="font-semibold text-gray-700">
                    {data.podium[1]?.equipo}
                  </div>
                  <div className="text-gray-500">
                    {data.podium[1]?.puntos} pts
                  </div>
                </div>
              </div>
              {/* 3er lugar */}
              <div className="flex flex-col items-center">
                <EquipoCard {...data.podium[2]} />
                <div className="mt-3 text-xs text-center">
                  <div className="font-semibold text-gray-700">
                    {data.podium[2]?.equipo}
                  </div>
                  <div className="text-gray-500">
                    {data.podium[2]?.puntos} pts
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Card>
    </div>
  );
};
