import React from "react";
import { FaRankingStar, FaMedal, FaGavel, FaBullhorn } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCurrentJornada } from "../../utils/utilities";
import { Card } from "../common/Card";

const HomeMobile: React.FC = () => {
  const navigate = useNavigate();
  const { jornada, nombre, countdown, totalJornadas, tipo, fase } = useCurrentJornada();

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-4 p-2">
      {/* Card principal de bienvenida */}
      <Card className="flex flex-col items-center justify-center w-full p-4 mb-4 text-white bg-black border border-black">
        <img
          src="/PPT.png"
          alt="Logo Liga PPT"
          className="object-contain w-24 h-24 mb-2 shadow-xl"
        />
        <div className="mb-1 text-xl font-bold text-center">
          ¡Bienvenido a la Liga PPT!
        </div>
        <div className="mb-2 text-xs text-center text-white/90">
          La <b>Liga PPT</b> es una liga de fútbol 6 aficionado en{" "}
          <b>Valledupar</b>.<br />
          Sigue el avance, consulta estadísticas, historia y más.
        </div>
        <div className="flex flex-col items-center w-full gap-2 mt-2">
          <div className="text-xs text-white/70">
            {tipo === "playoff" && fase
              ? `${fase.charAt(0).toUpperCase() + fase.slice(1)} - Liga PPT #15:`
              : `Jornada ${jornada} - Liga PPT #15:`}
          </div>
          <div className="px-4 py-1 font-mono text-base font-extrabold text-white bg-black border-2 rounded-xl border-white/20">
            {countdown}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs font-medium">
            <span className="text-white/80">
              Liga <b className="text-white">#15</b>
            </span>
            <span className="text-white/80">
              {tipo === "playoff" ? "Playoffs" : "Jornada"}{" "}
              <b className="text-white">
                {tipo === "playoff" && fase
                  ? fase
                  : `${jornada}/${totalJornadas}`}
              </b>
            </span>
            <span className="text-white/80">
              Equipos: <b className="text-white">9</b>
            </span>
          </div>
          <div className="mt-1 text-xs text-center text-white/90">
            <b>
              {tipo === "playoff" && fase
                ? `${fase.charAt(0).toUpperCase() + fase.slice(1)}:`
                : `Jornada ${jornada}:`}
            </b>{" "}
            {tipo === "playoff" && fase === "Cuartos de Final" ? (
              <div className="flex flex-col gap-1">
                <div>🟠 Luton Town FC vs 🟢 Deportivo Cali - Domingo 19 Oct 7:00 PM</div>
                <div>⚫ DC United vs 🔴 Al-Ahly - Domingo 19 Oct 8:00 PM</div>
              </div>
            ) : (
              nombre
            )}
          </div>
        </div>
      </Card>
      {/* Info en vivo de premios individuales y tablas */}
      {/* Resultados de Playoffs Liga #14 */}
      <Card className="w-full p-3 mb-4 bg-white">
        <h2 className="mb-1 text-lg font-bold text-center text-blue-700">
          🏆 Gran Final Liga #14
        </h2>
        <div className="mb-2 text-xs text-center text-gray-700">
          <b>Gran Final:</b>
          <div className="flex flex-col items-center justify-center gap-1 mt-2 mb-2">
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-bold">
                🟡 Brasil <b>3</b> - <b>3</b> 🟢 VfL Wolfsburgo
              </span>
              <span className="text-xs text-gray-600">
                Domingo 31 de Agosto - 7:00 PM
              </span>
              <span className="text-xs font-semibold text-green-600">
                🏆 ¡Amarillos ganan 4-3 en penaltis!
              </span>
              <a
                href="https://www.youtube.com/watch?v=Pgfd3efjpQI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                📺 Ver partido
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* Resultados de Semifinales */}
      <Card className="w-full p-3 mb-4 bg-white">
        <h2 className="mb-1 text-lg font-bold text-center text-purple-700">
          🥉 Semifinales Liga #14
        </h2>
        <div className="mb-2 text-xs text-center text-gray-700">
          <b>Semifinales:</b>
          <div className="flex flex-col items-center justify-center gap-1 mt-2 mb-2">
            <div className="flex flex-col items-center gap-1">
              <span>
                🟡 Brasil <b>6</b> - <b>6</b> 🔴 Junior
              </span>
              <span className="text-xs text-gray-600">
                Brasil gana por penales 1-0
              </span>
              <a
                href="https://youtu.be/NSdU__dtG2A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                📺 Ver partido
              </a>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>
                🟢 VfL Wolfsburgo <b>8</b> - <b>4</b> 🟠 Wolverhampton
              </span>
              <a
                href="https://youtu.be/ZPyn0cDfVpU"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                📺 Ver partido
              </a>
            </div>
          </div>
          <b>¡Felicitaciones a los finalistas!</b>
        </div>
      </Card>

      {/* Resultados de Cuartos de Final */}
      <Card className="w-full p-3 mb-4 bg-white">
        <h2 className="mb-1 text-lg font-bold text-center text-green-700">
          🏅 Cuartos de Final Liga #14
        </h2>
        <div className="mb-2 text-xs text-center text-gray-700">
          <b>Cuartos de Final:</b>
          <div className="flex flex-col items-center justify-center gap-1 mt-2 mb-2">
            <div className="flex flex-col items-center gap-1">
              <span>
                🟡 Brasil <b>7</b> - <b>5</b> 🟣 Palermo FC
              </span>
              <a
                href="https://youtu.be/aH2_GvzfRSg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                📺 Ver partido
              </a>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>
                🟠 Wolverhampton <b>7</b> - <b>6</b> 🔵 River Plate
              </span>
              <a
                href="https://youtu.be/QSTIKbthSUo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                📺 Ver partido
              </a>
            </div>
          </div>
          <b>¡Felicitaciones a los clasificados!</b>
        </div>
      </Card>
      {/* Módulos principales */}
      <Card className="w-full p-2 mb-4 bg-white">
        <div className="flex flex-col gap-2">
          <div
            className="flex flex-col items-start p-3 shadow rounded-xl bg-blue-50 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => navigate("/clasificacion")}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaRankingStar className="text-blue-600" size={20} />
              <span className="text-xs font-bold text-blue-700">
                Clasificación
              </span>
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Consulta la tabla de posiciones, resultados de jornadas,
              goleadores y arqueros destacados.
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
            className="flex flex-col items-start p-3 shadow rounded-xl bg-orange-50 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => navigate("/calendario")}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaRegCalendarAlt className="text-orange-600" size={20} />
              <span className="text-xs font-bold text-orange-700">
                Calendario
              </span>
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Consulta el calendario oficial de jornadas, canchas y equipos
              participantes.
            </div>
            <span
              className="text-xs font-semibold text-orange-600 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/calendario");
              }}
            >
              Ver calendario &rarr;
            </span>
          </div>
          <div
            className="flex flex-col items-start p-3 shadow rounded-xl bg-yellow-50 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => navigate("/historia")}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaHistory className="text-yellow-600" size={20} />
              <span className="text-xs font-bold text-yellow-700">
                Historia
              </span>
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Explora la historia de la liga, los jugadores, admins, récords
              históricos.
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
            className="flex flex-col items-start p-3 shadow rounded-xl bg-green-50 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => navigate("/logros")}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaMedal className="text-green-600" size={20} />
              <span className="text-xs font-bold text-green-700">Logros</span>
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Descubre los récords individuales y de equipo: más goles, menos
              goles recibidos.
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
            className="flex flex-col items-start p-3 bg-gray-100 shadow rounded-xl hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => navigate("/reglamento")}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaGavel className="text-gray-600" size={20} />
              <span className="text-xs font-bold text-gray-700">
                Reglamento
              </span>
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Consulta el reglamento oficial, reglas de juego, premios,
              sanciones.
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
          <div
            className="flex flex-col items-start p-3 shadow rounded-xl bg-purple-50 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => navigate("/anuncios")}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaBullhorn className="text-purple-600" size={20} />
              <span className="text-xs font-bold text-purple-700">
                Anuncios
              </span>
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Consulta las últimas noticias, actualizaciones y correcciones de
              errores.
            </div>
            <span
              className="text-xs font-semibold text-purple-600 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/anuncios");
              }}
            >
              Ver anuncios &rarr;
            </span>
          </div>
          <div
            className="flex flex-col items-start p-3 shadow rounded-xl bg-pink-50 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => navigate("/contacto")}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaRegEnvelope className="text-pink-600" size={24} />
              <span className="text-xs font-bold text-pink-700">Contacto</span>
            </div>
            <div className="mb-2 text-xs text-gray-700">
              ¿Tienes dudas, sugerencias o quieres saber más sobre la Liga PPT?
              Escríbenos.
            </div>
            <span className="text-xs font-semibold text-pink-600 cursor-pointer hover:underline">
              contacto@ligappt.com
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeMobile;
