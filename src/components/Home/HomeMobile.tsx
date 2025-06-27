import React from "react";
import { FaRankingStar, FaMedal, FaGavel, FaBullhorn } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NEXT_MATCH_DATE, useCountdown } from "../../utils/utilities";
import { Card } from "../common/Card";
import { PlayoffsBracket } from "../sections/PlayoffsBracket";

const HomeMobile: React.FC = () => {
  const navigate = useNavigate();
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
          <div className="text-xs text-white/70">Falta para semifinales:</div>
          <div className="px-4 py-1 font-mono text-base font-extrabold text-white bg-black border-2 rounded-xl border-white/20">
            {useCountdown(NEXT_MATCH_DATE)}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs font-medium">
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
          <div className="mt-1 text-xs text-center text-white/90">
            <b>Semifinales:</b> Viernes 27 de junio
          </div>
        </div>
      </Card>
      {/* Bracket y resultados */}
      <PlayoffsBracket />
      <Card className="w-full p-3 mb-4 bg-white">
        <h2 className="mb-1 text-lg font-bold text-center">
          Resultados Playoffs Liga #13
        </h2>
        <div className="mb-2 text-xs text-center text-gray-700">
          <b>Cuartos de Final:</b>
          <div className="flex flex-col items-center gap-1 mt-1 mb-1">
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
            <span>
              ⚪️ Inglaterra <b>5</b> - <b>2</b> ⚫️ Alemania
            </span>
          </div>
          <b>¡Felicitaciones a los clasificados!</b>
        </div>
      </Card>
      {/* Módulos principales */}
      <Card className="w-full p-2 mb-4 bg-white">
        <div className="flex flex-col gap-2">
          <div
            className="flex flex-row items-center gap-2 p-2 shadow rounded-xl bg-blue-50"
            onClick={() => navigate("/clasificacion")}
          >
            {" "}
            <FaRankingStar className="text-blue-600" size={20} />{" "}
            <span className="text-xs font-bold text-blue-700">
              Clasificación
            </span>{" "}
          </div>
          <div
            className="flex flex-row items-center gap-2 p-2 shadow rounded-xl bg-yellow-50"
            onClick={() => navigate("/historia")}
          >
            {" "}
            <FaHistory className="text-yellow-600" size={20} />{" "}
            <span className="text-xs font-bold text-yellow-700">Historia</span>{" "}
          </div>
          <div
            className="flex flex-row items-center gap-2 p-2 shadow rounded-xl bg-green-50"
            onClick={() => navigate("/logros")}
          >
            {" "}
            <FaMedal className="text-green-600" size={20} />{" "}
            <span className="text-xs font-bold text-green-700">Logros</span>{" "}
          </div>
          <div
            className="flex flex-row items-center gap-2 p-2 bg-gray-100 shadow rounded-xl"
            onClick={() => navigate("/reglamento")}
          >
            {" "}
            <FaGavel className="text-gray-600" size={20} />{" "}
            <span className="text-xs font-bold text-gray-700">Reglamento</span>{" "}
          </div>
          <div
            className="flex flex-row items-center gap-2 p-2 shadow rounded-xl bg-purple-50"
            onClick={() => navigate("/anuncios")}
          >
            {" "}
            <FaBullhorn className="text-purple-600" size={20} />{" "}
            <span className="text-xs font-bold text-purple-700">Anuncios</span>{" "}
          </div>
          <div
            className="flex flex-row items-center gap-2 p-2 shadow rounded-xl bg-pink-50"
            onClick={() => navigate("/contacto")}
          >
            {" "}
            <FaRegEnvelope className="text-pink-600" size={24} />{" "}
            <span className="text-xs font-bold text-pink-700">Contacto</span>{" "}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomeMobile;
