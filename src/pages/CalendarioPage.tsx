import React, { useState } from "react";
import { TEAM_COLORS } from "../constants/DATOS_LIGAS";
import { TeamCircle } from "../components/sections/TablaGeneral";
import { LIGA_14 } from "../constants/DATOS_LIGAS";

const JORNADAS = [
  {
    id: "jornada1",
    nombre: "Jornada 1",
    fecha: "Jueves 10 de julio",
    canchas: [
      {
        nombre: "Cancha 1",
        numero: 1,
        anotador: "Daniel Donado",
        equipos: [
          { badge: "B", color: "bg-yellow-400 text-black", nombre: "Brasil" },
          {
            badge: "E",
            color: "bg-blue-500 text-white",
            nombre: "Equipo Rocket",
          },
          {
            badge: "R",
            color: "bg-white text-black border border-gray-300",
            nombre: "River Plate",
          },
        ],
      },
      {
        nombre: "Cancha 2",
        numero: 2,
        anotador: "Lucas Benjumea",
        equipos: [
          {
            badge: "F",
            color: "bg-purple-500 text-white",
            nombre: "Fiorentina",
          },
          {
            badge: "W",
            color: "bg-orange-500 text-white",
            nombre: "Wolverhampton",
          },
          {
            badge: "E",
            color: "bg-black text-white",
            nombre: "E. Frankfurt",
          },
        ],
      },
      {
        nombre: "Cancha 3",
        numero: 3,
        anotador: "Oscar P y Luis Pabon",
        equipos: [
          { badge: "J", color: "bg-red-600 text-white", nombre: "Junior" },
          { badge: "P", color: "bg-pink-300 text-white", nombre: "Palermo FC" },
          {
            badge: "V",
            color: "bg-green-500 text-white",
            nombre: "VfL Wolfsburgo",
          },
        ],
      },
    ],
  },
  {
    id: "jornada2",
    nombre: "Jornada 2",
    fecha: "Jueves 17 de julio",
    canchas: [
      {
        nombre: "Cancha 1",
        color: "border-blue-500",
        anotador: "Lucas Benjumea",
        equipos: [
          {
            badge: "R",
            color: "bg-white text-black border border-gray-300",
            nombre: "River Plate",
          },
          {
            badge: "E",
            color: "bg-black text-white",
            nombre: "E. Frankfurt",
          },
          { badge: "J", color: "bg-red-600 text-white", nombre: "Junior" },
        ],
      },
      {
        nombre: "Cancha 2",
        color: "border-purple-500",
        anotador: "Oscar P y Luis Pabon",
        equipos: [
          {
            badge: "E",
            color: "bg-blue-500 text-white",
            nombre: "Equipo Rocket",
          },
          {
            badge: "W",
            color: "bg-orange-500 text-white",
            nombre: "Wolverhampton",
          },
          {
            badge: "V",
            color: "bg-green-500 text-white",
            nombre: "VfL Wolfsburgo",
          },
        ],
      },
      {
        nombre: "Cancha 3",
        color: "border-red-500",
        anotador: "Daniel Donado",
        equipos: [
          { badge: "B", color: "bg-yellow-400 text-black", nombre: "Brasil" },
          {
            badge: "F",
            color: "bg-purple-500 text-white",
            nombre: "Fiorentina",
          },
          { badge: "P", color: "bg-pink-300 text-white", nombre: "Palermo FC" },
        ],
      },
    ],
  },
  {
    id: "jornada3",
    nombre: "Jornada 3",
    fecha: "Jueves 24 de julio",
    canchas: [
      {
        nombre: "Cancha 1",
        color: "border-blue-500",
        equipos: [
          { badge: "B", color: "bg-yellow-400 text-black", nombre: "Brasil" },
          {
            badge: "W",
            color: "bg-orange-500 text-white",
            nombre: "Wolverhampton",
          },
          { badge: "J", color: "bg-red-600 text-white", nombre: "Junior" },
        ],
      },
      {
        nombre: "Cancha 2",
        color: "border-purple-500",
        equipos: [
          {
            badge: "F",
            color: "bg-purple-500 text-white",
            nombre: "Fiorentina",
          },
          {
            badge: "R",
            color: "bg-white text-black border border-gray-300",
            nombre: "River Plate",
          },
          {
            badge: "V",
            color: "bg-green-500 text-white",
            nombre: "VfL Wolfsburgo",
          },
        ],
      },
      {
        nombre: "Cancha 3",
        color: "border-red-500",
        equipos: [
          { badge: "P", color: "bg-pink-300 text-white", nombre: "Palermo FC" },
          {
            badge: "E",
            color: "bg-blue-500 text-white",
            nombre: "Equipo Rocket",
          },
          {
            badge: "E",
            color: "bg-black text-white",
            nombre: "E. Frankfurt",
          },
        ],
      },
    ],
  },
  {
    id: "jornada4",
    nombre: "Jornada 4",
    fecha: "Jueves 31 de julio",
    canchas: [
      {
        nombre: "Cancha 1",
        color: "border-blue-500",
        equipos: [
          {
            badge: "W",
            color: "bg-orange-500 text-white",
            nombre: "Wolverhampton",
          },
          {
            badge: "R",
            color: "bg-white text-black border border-gray-300",
            nombre: "River Plate",
          },
          { badge: "P", color: "bg-pink-300 text-white", nombre: "Palermo FC" },
        ],
      },
      {
        nombre: "Cancha 2",
        color: "border-purple-500",
        equipos: [
          { badge: "B", color: "bg-yellow-400 text-black", nombre: "Brasil" },
          {
            badge: "E",
            color: "bg-black text-white",
            nombre: "E. Frankfurt",
          },
          {
            badge: "V",
            color: "bg-green-500 text-white",
            nombre: "VfL Wolfsburgo",
          },
        ],
      },
      {
        nombre: "Cancha 3",
        color: "border-red-500",
        equipos: [
          { badge: "J", color: "bg-red-600 text-white", nombre: "Junior" },
          {
            badge: "F",
            color: "bg-purple-500 text-white",
            nombre: "Fiorentina",
          },
          {
            badge: "E",
            color: "bg-blue-500 text-white",
            nombre: "Equipo Rocket",
          },
        ],
      },
    ],
  },
  {
    id: "jornada5",
    nombre: "Jornada 5",
    fecha: "Jueves 14 de agosto",
    canchas: [
      {
        nombre: "Cancha 1",
        color: "border-blue-500",
        equipos: [
          {
            badge: "W",
            color: "bg-orange-500 text-white",
            nombre: "Wolverhampton",
          },
          {
            badge: "E",
            color: "bg-blue-500 text-white",
            nombre: "Equipo Rocket",
          },
          {
            badge: "E",
            color: "bg-black text-white",
            nombre: "E. Frankfurt",
          },
        ],
      },
      {
        nombre: "Cancha 2",
        color: "border-purple-500",
        equipos: [
          {
            badge: "R",
            color: "bg-white text-black border border-gray-300",
            nombre: "River Plate",
          },
          { badge: "J", color: "bg-red-600 text-white", nombre: "Junior" },
          {
            badge: "V",
            color: "bg-green-500 text-white",
            nombre: "VfL Wolfsburgo",
          },
        ],
      },
      {
        nombre: "Cancha 3",
        color: "border-red-500",
        equipos: [
          { badge: "B", color: "bg-yellow-400 text-black", nombre: "Brasil" },
          { badge: "P", color: "bg-pink-300 text-white", nombre: "Palermo FC" },
          {
            badge: "F",
            color: "bg-purple-500 text-white",
            nombre: "Fiorentina",
          },
        ],
      },
    ],
  },
  {
    id: "jornada6",
    nombre: "Jornada 6",
    fecha: "Jueves 21 de agosto",
    canchas: [
      {
        nombre: "Cancha 1",
        color: "border-blue-500",
        equipos: [
          { badge: "J", color: "bg-red-600 text-white", nombre: "Junior" },
          { badge: "P", color: "bg-pink-300 text-white", nombre: "Palermo FC" },
          {
            badge: "E",
            color: "bg-black text-white",
            nombre: "E. Frankfurt",
          },
        ],
      },
      {
        nombre: "Cancha 2",
        color: "border-purple-500",
        equipos: [
          { badge: "B", color: "bg-yellow-400 text-black", nombre: "Brasil" },
          {
            badge: "R",
            color: "bg-white text-black border border-gray-300",
            nombre: "River Plate",
          },
          {
            badge: "W",
            color: "bg-orange-500 text-white",
            nombre: "Wolverhampton",
          },
        ],
      },
      {
        nombre: "Cancha 3",
        color: "border-red-500",
        equipos: [
          {
            badge: "V",
            color: "bg-green-500 text-white",
            nombre: "VfL Wolfsburgo",
          },
          {
            badge: "E",
            color: "bg-blue-500 text-white",
            nombre: "Equipo Rocket",
          },
          {
            badge: "F",
            color: "bg-purple-500 text-white",
            nombre: "Fiorentina",
          },
        ],
      },
    ],
  },
];

const EQUIPOS = [
  {
    badge: "B",
    color: "bg-yellow-400 text-black",
    nombre: "Brasil",
    integrantes: [
      "Jefferson Almanza (C)",
      "🧤Fernando Gómez (A)",
      "Cristian Trujillo",
      "Andres Salazar",
      "Ian Need",
      "Jesús Pertuz",
      "José Mosquera",
      "Kevin Pineda",
    ],
  },
  {
    badge: "E",
    color: "bg-blue-500 text-white",
    nombre: "Equipo Rocket",
    integrantes: [
      "Mariano Amaris (C)",
      "🧤Brayan Cadena (A)",
      "Alexander Benitez",
      "David Carballo",
      "Eudes Pavajeau",
      "Keiler Fonseca",
      "Nadim Camall",
      "Sergio Barrera",
    ],
  },
  {
    badge: "R",
    color: "bg-white text-black border border-gray-300",
    nombre: "River Plate",
    integrantes: [
      "Juan Mora (C)",
      "🧤Nicolás Baute",
      "Andy Córdoba (Pingui)",
      "Dario Daza",
      "Elías Lacera",
      "Jürgen Hassler",
      "Narent Rojas",
      "Nico Yamal",
    ],
  },
  {
    badge: "F",
    color: "bg-purple-500 text-white",
    nombre: "Fiorentina",
    integrantes: [
      "Juanse Pinedo (C)",
      "🧤Pipe Castillejo",
      "Dairo Martínez",
      "Esteban Hinojosa",
      "Jairo Galván",
      "Juan Tellez",
      "Juan Vargas",
      "Ronald Andrade",
    ],
  },
  {
    badge: "W",
    color: "bg-orange-500 text-white",
    nombre: "Wolverhampton",
    integrantes: [
      "Omar Peralta (C)",
      "🧤Santiago Sánchez",
      "Carlos Armenta",
      "Jeysson Henríquez",
      "José Henao 2",
      "Juan Dybala",
      "Julio Ochoa",
      "Miguel Guerra",
    ],
  },
  {
    badge: "E",
    color: "bg-black text-white",
    nombre: "E. Frankfurt",
    integrantes: [
      "Camilo Torres (C)",
      "🧤Carlos Barraza",
      "Carlos Romero",
      "Emanuel Celedón",
      "Emanuel Navarro (Goat)",
      "Frederick Molina",
      "Frank Ramirez",
      "Juanse Tibaduiza",
    ],
  },
  {
    badge: "J",
    color: "bg-red-600 text-white",
    nombre: "Junior",
    integrantes: [
      "José Hernández (C)",
      "🧤Leonardo Cadena",
      "Arnold Castillo",
      "Henry Hernandez",
      "Hernán Medrano",
      "Jhonnier DLC",
      "Juan DLC",
      "Alejandro Macherna",
    ],
  },
  {
    badge: "P",
    color: "bg-pink-300 text-white",
    nombre: "Palermo FC",
    integrantes: [
      "Cristian Benjumea (C)",
      "🧤Brayan Ospino",
      "Daniel Cuadros",
      "Fabricio Rizo",
      "Jose Viña",
      "Keni Contreras",
      "Óscar DLC",
      "Santiago Corzo",
    ],
  },
  {
    badge: "V",
    color: "bg-green-500 text-white",
    nombre: "VfL Wolfsburgo",
    integrantes: [
      "🧤Camilo Laborde (C)",
      "Andrés Farfán",
      "Carlos Vega",
      "Bryan Pallares",
      "Edward Brito (Titi)",
      "Jeison Santa",
      "Ronald Rojas",
      "Sergio Blanchar",
    ],
  },
];

const TABS = [...JORNADAS.map((j) => ({ id: j.id, label: j.nombre }))];

export const CalendarioPage: React.FC = () => {
  const [tab, setTab] = useState(JORNADAS[0].id);
  const [equiposExpandidos, setEquiposExpandidos] = useState<Set<string>>(
    new Set()
  );

  const toggleEquipo = (nombreEquipo: string) => {
    const nuevosExpandidos = new Set(equiposExpandidos);
    if (nuevosExpandidos.has(nombreEquipo)) {
      nuevosExpandidos.delete(nombreEquipo);
    } else {
      nuevosExpandidos.add(nombreEquipo);
    }
    setEquiposExpandidos(nuevosExpandidos);
  };

  const TEAM_STATS = React.useMemo(() => {
    const stats: Record<
      string,
      { victorias: number; derrotas: number; empates: number; puntos: number }
    > = {};
    LIGA_14.tablaGeneral.forEach((eq) => {
      stats[eq.equipo] = {
        victorias: eq.victorias || 0,
        derrotas: eq.derrotas || 0,
        empates: eq.empates || 0,
        puntos: eq.puntos || 0,
      };
    });
    return stats;
  }, []);

  return (
    <div className="container px-2 py-6 mx-auto md:py-8">
      <div className="max-w-sm mx-auto md:max-w-6xl">
        {/* Header Negro con Logo */}
        <div className="flex items-center justify-center p-6 mb-8 bg-black shadow-lg rounded-xl">
          <img
            src="/PPT.png"
            alt="Logo Liga PPT"
            className="object-contain w-20 h-20 md:w-24 md:h-24"
          />
        </div>

        {/* Header */}
        <div className="mb-8 text-center md:mb-10">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">
            Liga PPT #14
          </h1>
          <p className="text-gray-600">Calendario Oficial de Enfrentamientos</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex mb-6 overflow-x-auto bg-white rounded-lg shadow-md md:mb-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn px-6 cursor-pointer py-3 font-medium border-b-2 transition-all whitespace-nowrap ${
                tab === t.id
                  ? "text-blue-600 border-blue-500"
                  : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-500"
              }`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {JORNADAS.map(
          (j) =>
            tab === j.id && (
              <div
                key={j.id}
                className="overflow-hidden bg-white shadow-lg rounded-xl"
              >
                <div className="p-6">
                  <h2 className="flex items-center mb-6 text-2xl font-bold text-gray-800">
                    {j.nombre}
                    {j.fecha && (
                      <span className="ml-3 px-2 py-0.5 text-xs font-semibold rounded bg-gray-200 text-gray-700 border border-gray-300 align-middle">
                        {j.fecha}
                      </span>
                    )}
                  </h2>
                  <div className="grid gap-6 md:grid-cols-3">
                    {j.canchas.map((cancha) => {
                      const anotador =
                        (cancha as any).anotador ?? "Por definir";
                      return (
                        <div
                          key={cancha.nombre}
                          className="p-3 mb-6 bg-white border border-gray-200 shadow-md match-card md:p-5 rounded-2xl"
                        >
                          <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center justify-between w-full">
                              <span className="inline-block px-2 py-1 rounded bg-gray-100 text-xs font-semibold mr-2 truncate max-w-[90px] md:max-w-none">
                                {cancha.nombre}
                              </span>
                              <span className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none ml-auto">
                                Anotador: <b>{anotador}</b>
                              </span>
                            </div>
                          </div>
                          <div className="mb-2 space-y-2">
                            {cancha.equipos.map((eq, i) => {
                              const stats = TEAM_STATS[eq.nombre] || {
                                puntos: 0,
                              };
                              const pos =
                                LIGA_14.tablaGeneral.findIndex(
                                  (e) => e.equipo === eq.nombre
                                ) + 1;
                              return (
                                <div
                                  className={`flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 p-1 md:p-2 rounded hover:bg-gray-50 transition ${
                                    i !== cancha.equipos.length - 1
                                      ? "border-b border-gray-100"
                                      : ""
                                  }`}
                                  key={i}
                                >
                                  <TeamCircle
                                    equipo={eq.nombre}
                                    TEAM_COLORS={TEAM_COLORS}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <span className="block text-xs font-medium text-gray-800 truncate md:text-base">
                                      {eq.nombre}
                                    </span>
                                    <span className="block md:hidden text-[11px] text-gray-500 mt-0.5">
                                      Pos: <b>{pos > 0 ? pos : "-"}</b>{" "}
                                      &nbsp;|&nbsp; Pts: <b>{stats.puntos}</b>
                                    </span>
                                  </div>
                                  <span className="hidden gap-2 ml-auto text-xs text-gray-600 md:flex">
                                    <span>
                                      Pos: <b>{pos > 0 ? pos : "-"}</b>
                                    </span>
                                    <span>
                                      Pts: <b>{stats.puntos}</b>
                                    </span>
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center text-xl font-bold text-gray-800">
                      <span className="mr-2">
                        <i className="text-blue-500 fas fa-info-circle" />
                      </span>
                      Equipos Participantes
                    </h3>
                    <div>
                      <button
                        onClick={() => {
                          if (equiposExpandidos.size === EQUIPOS.length) {
                            setEquiposExpandidos(new Set());
                          } else {
                            setEquiposExpandidos(
                              new Set(EQUIPOS.map((eq) => eq.nombre))
                            );
                          }
                        }}
                        className={`px-3 py-1 cursor-pointer text-xs font-medium rounded transition-colors ${
                          equiposExpandidos.size === EQUIPOS.length
                            ? "text-gray-700 bg-gray-200 hover:bg-gray-300"
                            : "text-white bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {equiposExpandidos.size === EQUIPOS.length
                          ? "Cerrar todos"
                          : "Abrir todos"}
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {EQUIPOS.map((eq, i) => (
                      <div key={i}>
                        <div
                          className="flex items-center p-2 transition-colors rounded cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleEquipo(eq.nombre)}
                        >
                          <TeamCircle
                            equipo={eq.nombre}
                            TEAM_COLORS={TEAM_COLORS}
                          />
                          <span className="font-medium text-gray-700">
                            {eq.nombre}
                          </span>
                          <span className="ml-auto text-gray-400">
                            {equiposExpandidos.has(eq.nombre) ? "−" : "+"}
                          </span>
                        </div>
                        {equiposExpandidos.has(eq.nombre) && (
                          <div className="p-3 mt-2 ml-8 rounded-lg bg-gray-50">
                            <div className="space-y-1 text-sm text-gray-600">
                              {eq.integrantes.map((integrante, idx) => (
                                <div key={idx} className="flex items-center">
                                  <span className="text-xs">•</span>
                                  <span className="ml-2">{integrante}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};
