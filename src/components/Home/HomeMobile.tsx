import React from "react";
import {
  FaRankingStar,
  FaMedal,
  FaGavel,
  FaBullhorn,
  FaHandshake,
} from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Card } from "../common/Card";
import Liga18DestacadoCarousel from "./Liga18DestacadoCarousel";

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
      </Card>
      <Liga18DestacadoCarousel />
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
            className="flex flex-col items-start p-3 shadow rounded-xl bg-teal-50 hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => navigate("/patrocinadores")}
          >
            <div className="flex items-center gap-2 mb-1">
              <FaHandshake className="text-teal-600" size={20} />
              <span className="text-xs font-bold text-teal-800">
                Patrocinadores
              </span>
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Marcas que apoyan la liga y enlaces a sus redes.
            </div>
            <span
              className="text-xs font-semibold text-teal-600 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/patrocinadores");
              }}
            >
              Ver patrocinadores &rarr;
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
