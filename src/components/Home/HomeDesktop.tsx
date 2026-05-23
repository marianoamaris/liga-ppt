import React from "react";
import { Card } from "../common/Card";
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
import Liga19DestacadoCarousel from "./Liga19DestacadoCarousel";
import Liga18DestacadoCarousel from "./Liga18DestacadoCarousel";
import EnVivoDestacado from "./EnVivoDestacado";

const HomeDesktop: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-[370px] md:w-full min-h-screen p-2 md:px-0">
      {/* Card principal de bienvenida, estilo negro */}
      <Card className="flex flex-col items-center justify-center w-full max-w-5xl p-0 mb-8 overflow-hidden text-white bg-black border border-black">
        <div className="flex flex-col items-center justify-center w-full gap-4 p-8">
          <img
            src="/PPT.png"
            alt="Logo Liga PPT"
            className="object-contain w-40 h-40 shadow-xl"
          />
          <div className="mb-2 text-3xl font-bold text-white">
            ¡Bienvenido a la Liga PPT!
          </div>
          <div className="max-w-2xl mb-4 text-base text-center text-white/90">
            La <b>Liga PPT</b> es una liga de fútbol 6 aficionado en{" "}
            <b>Valledupar</b>, donde la pasión, la competencia sana y la amistad
            se viven cada semana. Aquí podrás seguir el avance de la liga,
            consultar estadísticas, historia, logros y el reglamento oficial.
            ¡Tanto si eres jugador, fan o curioso, esta plataforma es para ti!
          </div>
        </div>
      </Card>

      <EnVivoDestacado />
      <Liga19DestacadoCarousel />
      <Liga18DestacadoCarousel />

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
            className="flex flex-col items-start p-4 rounded-2xl shadow-md bg-orange-50 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/calendario")}
          >
            <FaRegCalendarAlt className="mb-2 text-orange-600" size={28} />
            <div className="mb-1 text-base font-bold text-orange-700">
              Calendario
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Consulta el calendario oficial de jornadas, canchas y equipos
              participantes. Explora la fase final y el bracket de la Liga #14.
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
          <div
            className="flex flex-col items-start p-4 rounded-2xl shadow-md bg-purple-50 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/anuncios")}
          >
            <FaBullhorn className="mb-2 text-purple-600" size={28} />
            <div className="mb-1 text-base font-bold text-purple-700">
              Anuncios
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Consulta las últimas noticias, actualizaciones y correcciones de
              errores de la plataforma directamente del equipo de desarrollo.
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
            className="flex flex-col items-start p-4 rounded-2xl shadow-md bg-teal-50 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/patrocinadores")}
          >
            <FaHandshake className="mb-2 text-teal-600" size={28} />
            <div className="mb-1 text-base font-bold text-teal-800">
              Patrocinadores
            </div>
            <div className="mb-2 text-xs text-gray-700">
              Conoce a las marcas que apoyan la liga, sus servicios y enlaces a
              sus redes sociales.
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
            className="flex flex-col items-start p-4 rounded-2xl shadow-md bg-pink-50 hover:scale-[1.03] transition-transform cursor-pointer"
            onClick={() => navigate("/contacto")}
          >
            <FaRegEnvelope className="mb-2 text-pink-600" size={36} />
            <div className="mb-1 text-base font-bold text-pink-700">
              Contacto
            </div>
            <div className="mb-2 text-xs text-gray-700">
              ¿Tienes dudas, sugerencias o quieres saber más sobre la Liga PPT?
              Escríbenos a nuestro correo oficial y te responderemos lo antes
              posible.
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

export default HomeDesktop;
