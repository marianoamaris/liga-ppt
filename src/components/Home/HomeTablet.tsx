import React from "react";
import { FaRankingStar, FaMedal, FaGavel, FaBullhorn } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Card } from "../common/Card";
import { NEXT_MATCH_DATE, useCountdown } from "../../utils/utilities";
import { PlayoffsBracket } from "../sections/PlayoffsBracket";

const HomeTablet: React.FC = () => {
  const navigate = useNavigate();
  const countdown = useCountdown(NEXT_MATCH_DATE);
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-6 p-4">
      {/* Card principal de bienvenida */}
      <Card className="flex flex-col items-center justify-center w-full p-6 mb-6 text-white bg-black border border-black">
        <img
          src="/PPT.png"
          alt="Logo Liga PPT"
          className="object-contain w-32 h-32 mb-3 shadow-xl"
        />
        <div className="mb-2 text-2xl font-bold text-center">
          ¡Bienvenido a la Liga PPT!
        </div>
        <div className="mb-3 text-sm text-center text-white/90">
          La <b>Liga PPT</b> es una liga de fútbol 6 aficionado en{" "}
          <b>Valledupar</b>.<br />
          Sigue el avance, consulta estadísticas, historia y más.
        </div>
        <div className="flex flex-col items-center w-full gap-3 mt-2">
          <div className="text-sm text-white/70">Falta para la final:</div>
          <div className="px-6 py-2 font-mono text-lg font-extrabold text-white bg-black border-2 rounded-xl border-white/20">
            {countdown}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-sm font-medium">
            <span className="text-white/80">
              Liga <b className="text-white">#13</b>
            </span>
            <span className="text-white/80">
              Jornada <b className="text-white">6/6</b>
            </span>
            <span className="text-white/80">
              Equipos: <b className="text-white">9</b>
            </span>
          </div>
          <div className="mt-1 text-sm text-center text-white/90">
            <b>Final:</b> Domingo 29 de junio, 7:00pm
          </div>
        </div>
      </Card>
      {/* Bracket y resultados */}
      <PlayoffsBracket />

      {/* Resultados de Semifinales */}
      <Card className="w-full p-4 mb-6 bg-white">
        <h2 className="mb-2 text-xl font-bold text-center">
          Resultados Semifinales Liga #13
        </h2>
        <div className="mb-3 text-sm text-center text-gray-700">
          <b>Semifinales:</b>
          <div className="flex flex-col items-center gap-1 mt-2 mb-2">
            <div className="flex flex-col items-center gap-1">
              <span>
                🌸 Sport Boys <b>10</b> - <b>4</b> ⚪️ Inglaterra
              </span>
              <a
                href="https://www.youtube.com/watch?v=vpXSgT7vjEs&ab_channel=LigaPPT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                📺 Ver partido
              </a>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>
                🟠 Holanda <b>12</b> - <b>7</b> 🟣 Fiorentina
              </span>
            </div>
          </div>
          <b>¡Felicitaciones a los clasificados!</b>
        </div>
      </Card>

      <Card className="w-full p-4 mb-6 bg-white">
        <h2 className="mb-2 text-xl font-bold text-center">
          Resultados Playoffs Liga #13
        </h2>
        <div className="mb-3 text-sm text-center text-gray-700">
          <b>Cuartos de Final:</b>
          <div className="flex flex-col items-center gap-1 mt-2 mb-2">
            <div className="flex flex-col items-center gap-1">
              <span>
                🟣 Fiorentina <b>9</b> - <b>8</b> 🔵 Celta de Vigo
              </span>
              <a
                href="https://www.youtube.com/watch?v=z_kFBRqnwv8&ab_channel=LigaPPT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                📺 Ver partido
              </a>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span>
                ⚪️ Inglaterra <b>5</b> - <b>2</b> ⚫️ Alemania
              </span>
              <a
                href="https://www.youtube.com/watch?v=YZywzjyzcE0&ab_channel=LigaPPT"
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
      <Card className="w-full p-3 mb-6 bg-white">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="flex flex-col items-start p-3 shadow cursor-pointer rounded-xl bg-blue-50"
            onClick={() => navigate("/clasificacion")}
          >
            {" "}
            <FaRankingStar className="mb-1 text-blue-600" size={22} />{" "}
            <span className="text-sm font-bold text-blue-700">
              Clasificación
            </span>{" "}
          </div>
          <div
            className="flex flex-col items-start p-3 shadow cursor-pointer rounded-xl bg-yellow-50"
            onClick={() => navigate("/historia")}
          >
            {" "}
            <FaHistory className="mb-1 text-yellow-600" size={22} />{" "}
            <span className="text-sm font-bold text-yellow-700">Historia</span>{" "}
          </div>
          <div
            className="flex flex-col items-start p-3 shadow cursor-pointer rounded-xl bg-green-50"
            onClick={() => navigate("/logros")}
          >
            {" "}
            <FaMedal className="mb-1 text-green-600" size={22} />{" "}
            <span className="text-sm font-bold text-green-700">Logros</span>{" "}
          </div>
          <div
            className="flex flex-col items-start p-3 bg-gray-100 shadow cursor-pointer rounded-xl"
            onClick={() => navigate("/reglamento")}
          >
            {" "}
            <FaGavel className="mb-1 text-gray-600" size={22} />{" "}
            <span className="text-sm font-bold text-gray-700">Reglamento</span>{" "}
          </div>
          <div
            className="flex flex-col items-start p-3 shadow cursor-pointer rounded-xl bg-purple-50"
            onClick={() => navigate("/anuncios")}
          >
            {" "}
            <FaBullhorn className="mb-1 text-purple-600" size={22} />{" "}
            <span className="text-sm font-bold text-purple-700">Anuncios</span>{" "}
          </div>
          <div
            className="flex flex-col items-start p-3 shadow cursor-pointer rounded-xl bg-pink-50"
            onClick={() => navigate("/contacto")}
          >
            {" "}
            <FaRegEnvelope className="mb-1 text-pink-600" size={26} />{" "}
            <span className="text-sm font-bold text-pink-700">Contacto</span>{" "}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeTablet;
