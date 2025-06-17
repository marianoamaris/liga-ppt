import React from "react";
import { Card } from "../components/common/Card";
import { FaRankingStar, FaMedal, FaGavel } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getPosColor,
  getTopColor,
  NEXT_MATCH_DATE,
  useCountdown,
} from "../utils/utilities";
import { ARQUEROS, EQUIPOS_FULL, GOLEADORES } from "../constants_HOME/HOME";

export const Home: React.FC = () => {
  const countdown = useCountdown(NEXT_MATCH_DATE);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-2 md:px-0">
      {/* Card principal de bienvenida, estilo negro */}
      <Card className="flex flex-col items-center justify-center w-full max-w-5xl p-0 mb-8 overflow-hidden text-white bg-black border border-black">
        <div className="flex flex-col items-center justify-center w-full gap-4 p-8">
          <img
            src="/PPT.png"
            alt="Logo Liga PPT"
            className="w-40 h-40 shadow-xl "
          />
          <div className="mb-2 text-3xl font-bold text-white">
            ¡Bienvenido a la Liga PPT!
          </div>
          <div className="max-w-2xl mb-4 text-base text-center text-white/90">
            La <b>Liga PPT</b> es una liga de fútbol 6 aficionado donde la
            pasión, la competencia sana y la amistad se viven cada semana. Aquí
            podrás seguir el avance de la liga, consultar estadísticas,
            historia, logros y el reglamento oficial. ¡Tanto si eres jugador,
            fan o curioso, esta plataforma es para ti!
          </div>
          <div className="flex flex-col items-center justify-center w-full gap-8 mt-2 md:flex-row">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-1 text-xs text-white/70">
                Falta para la jornada 6/6:
              </div>
              <div className="px-6 py-2 font-mono text-3xl font-extrabold text-white bg-black border-2 shadow rounded-xl border-white/20">
                {countdown}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="flex flex-wrap justify-center gap-4 text-base font-medium">
                <span className="text-white/80">
                  Liga <b className="text-white">#13</b>
                </span>
                <span className="text-white/80">
                  Jornada <b className="text-white">5/6</b>
                </span>
                <span className="text-white/80">
                  Equipos: <b className="text-white">9</b>
                </span>
                <span className="text-white/80">
                  Total jornadas: <b className="text-white">6</b>
                </span>
              </div>
              <div className="mt-2 text-sm text-center text-white/90">
                <b>Próxima jornada:</b> Jueves 19 de junio de 2025
                <br />
                <b>Playoffs:</b> Domingo 22 de junio
              </div>
            </div>
          </div>
        </div>
      </Card>
      {/* Info en vivo de premios individuales y tablas */}
      <div className="flex flex-col items-center w-full max-w-5xl mb-8">
        <div className="flex items-center justify-center gap-2 mb-4 text-lg font-bold text-center text-blue-900">
          Sigue la información en vivo de los datos a premios individuales
          <span className="flex items-center gap-2 px-2 py-0.5 text-xs font-bold uppercase bg-black text-white rounded-md border border-black ml-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            DATOS EN VIVO
          </span>
        </div>
        <div className="flex flex-col items-start justify-center w-full gap-4 md:flex-row">
          {/* Tabla de equipos */}
          <div className="flex-1 min-w-[180px]">
            <div className="mb-2 text-sm font-bold text-center text-gray-800">
              Tabla de equipos
            </div>
            <table className="w-full overflow-hidden text-xs bg-white border shadow-lg rounded-2xl">
              <thead>
                <tr className="h-8 text-gray-700 bg-gray-50">
                  <th className="px-2 py-1">P</th>
                  <th className="px-2 py-1">C</th>
                  <th className="px-2 py-1 text-left">Equipo</th>
                  <th className="px-2 py-1">PJ</th>
                  <th className="px-2 py-1">V</th>
                  <th className="px-2 py-1">E</th>
                  <th className="px-2 py-1">D</th>
                  <th className="px-2 py-1">%V</th>
                  <th className="px-2 py-1">PTS</th>
                </tr>
              </thead>
              <tbody>
                {EQUIPOS_FULL.map((eq, i) => (
                  <tr key={eq.nombre} className="h-8 border-b last:border-b-0">
                    <td
                      className={`px-2 py-1 text-base font-bold text-center align-middle ${getPosColor(
                        i
                      )}`}
                    >
                      {i + 1}
                    </td>
                    <td className="px-2 py-1 text-center align-middle">
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 14,
                          background: eq.color,
                          borderRadius: "50%",
                          border: "1px solid #888",
                          verticalAlign: "middle",
                        }}
                      />
                    </td>
                    <td className="px-2 py-1 font-semibold text-left align-middle">
                      {eq.nombre}
                    </td>
                    <td className="px-2 py-1 font-mono italic text-center align-middle">
                      {eq.pj}
                    </td>
                    <td className="px-2 py-1 font-mono italic text-center align-middle">
                      {eq.v}
                    </td>
                    <td className="px-2 py-1 font-mono italic text-center align-middle">
                      {eq.e}
                    </td>
                    <td className="px-2 py-1 font-mono italic text-center align-middle">
                      {eq.d}
                    </td>
                    <td className="px-2 py-1 font-mono italic text-center align-middle">
                      {eq.perc}
                    </td>
                    <td className="px-2 py-1 font-bold text-center text-black align-middle">
                      {eq.pts}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              {/* Tabla de goleadores */}
              <div className="flex-1 min-w-[160px]">
                <div className="mb-2 text-sm font-bold text-center text-gray-800">
                  Top 5 Goleadores
                </div>
                <table className="w-full overflow-hidden text-xs bg-white border shadow-lg rounded-2xl">
                  <thead>
                    <tr className="h-8 text-gray-700 bg-gray-50">
                      <th className="px-2 py-1">#</th>
                      <th className="px-2 py-1 text-left">Jugador</th>
                      <th className="px-2 py-1 text-center">C</th>
                      <th className="px-2 py-1">Goles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GOLEADORES.map((g, i) => (
                      <tr
                        key={g.nombre}
                        className={`border-b last:border-b-0 ${getTopColor(
                          i
                        )} h-8`}
                      >
                        <td className="px-2 py-1 text-base font-bold text-center align-middle">
                          {i + 1}
                        </td>
                        <td className="px-2 py-1 font-semibold align-middle">
                          {g.nombre}
                        </td>
                        <td className="px-2 py-1 text-center align-middle">
                          <span
                            style={{
                              display: "inline-block",
                              width: 14,
                              height: 14,
                              background: g.color,
                              borderRadius: "50%",
                              border: "1px solid #888",

                              verticalAlign: "middle",
                            }}
                          ></span>
                        </td>
                        <td className="px-2 py-1 text-base font-bold text-center text-gray-800 align-middle">
                          {g.goles}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Tabla de arqueros */}
              <div className="flex-1 min-w-[160px]">
                <div className="mb-2 text-sm font-bold text-center text-gray-800">
                  Top 5 Arqueros (menos goles recibidos)
                </div>
                <table className="w-full overflow-hidden text-xs bg-white border shadow-lg rounded-2xl">
                  <thead>
                    <tr className="h-8 text-gray-700 bg-gray-50">
                      <th className="px-2 py-1">#</th>
                      <th className="px-2 py-1 text-left">Arquero</th>
                      <th className="px-2 py-1 text-center">C</th>
                      <th className="px-2 py-1">Goles Rec.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ARQUEROS.map((a, i) => (
                      <tr
                        key={a.nombre}
                        className={`border-b last:border-b-0 ${getTopColor(
                          i
                        )} h-8`}
                      >
                        <td className="px-2 py-1 text-base font-bold text-center align-middle">
                          {i + 1}
                        </td>
                        <td className="px-2 py-1 font-semibold align-middle">
                          {a.nombre}
                        </td>
                        <td className="px-2 py-1 text-center align-middle">
                          <span
                            style={{
                              display: "inline-block",
                              width: 14,
                              height: 14,
                              background: a.color,
                              border: "1px solid #888",

                              borderRadius: "50%",
                              verticalAlign: "middle",
                            }}
                          ></span>
                        </td>
                        <td className="px-2 py-1 text-base font-bold text-center text-gray-800 align-middle">
                          {a.derrotas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Card de noticias de traspasos */}
            <div className="flex justify-center w-full max-w-5xl mb-8">
              <div className="flex flex-col items-center w-full p-4 text-white bg-black border border-black shadow-lg rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl text-red-600">🚫</span>
                  <span className="text-base font-bold tracking-wide uppercase">
                    Traspasos deshabilitados
                  </span>
                </div>
                <div className="text-sm text-center text-white/90">
                  Los traspasos están cerrados porque el mercado se cierra
                  después de la jornada 3.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Módulos principales */}
      <Card className="w-full max-w-5xl p-2 mb-8 bg-white">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            className="flex flex-col items-start p-4 rounded-2xl shadow-md bg-blue-50 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/clasificacion")}
          >
            <FaRankingStar className="mb-2 text-blue-600" size={28} />
            <div className="mb-1 text-base font-bold text-blue-700">
              Clasificación
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Consulta la tabla de posiciones, resultados de jornadas,
              goleadores y arqueros destacados. Visualiza el bracket de playoff
              y el avance de cada equipo.
            </div>
            <span
              className="text-xs font-semibold text-blue-500 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/clasificacion");
              }}
            >
              Ver tabla y jornadas &rarr;
            </span>
          </div>
          <div
            className="flex flex-col items-start p-4 rounded-2xl shadow-md bg-yellow-50 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/historia")}
          >
            <FaHistory className="mb-2 text-yellow-600" size={28} />
            <div className="mb-1 text-base font-bold text-yellow-700">
              Historia
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Explora la historia de la liga, los jugadores, admins, récords
              históricos y los más ganadores de todas las ediciones.
            </div>
            <span
              className="text-xs font-semibold text-yellow-600 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/historia");
              }}
            >
              Ver historia &rarr;
            </span>
          </div>
          <div
            className="flex flex-col items-start p-4 rounded-2xl shadow-md bg-green-50 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/logros")}
          >
            <FaMedal className="mb-2 text-green-600" size={28} />
            <div className="mb-1 text-base font-bold text-green-700">
              Logros
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Descubre los récords individuales y de equipo: más goles, menos
              goles recibidos, mejores campañas y más.
            </div>
            <span
              className="text-xs font-semibold text-green-600 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/logros");
              }}
            >
              Ver récords &rarr;
            </span>
          </div>
          <div
            className="flex flex-col items-start p-4 rounded-2xl shadow-md bg-gray-100 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/reglamento")}
          >
            <FaGavel className="mb-2 text-gray-600" size={28} />
            <div className="mb-1 text-base font-bold text-gray-700">
              Reglamento
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Consulta el reglamento oficial, reglas de juego, premios,
              sanciones y requisitos para participar en la Liga PPT.
            </div>
            <span
              className="text-xs font-semibold text-gray-600 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/reglamento");
              }}
            >
              Ver reglamento &rarr;
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
