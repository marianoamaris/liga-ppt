import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaShareAlt, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { FaUserPlus, FaUsers, FaFutbol, FaClock } from "react-icons/fa6";
import { AnnouncementCard } from "../common/AnnouncementCard";
import { useNavigate } from "react-router-dom";

const ANCHOR = "grupo-reservas";
const TITLE = "⚽ ¿Quieres jugar en la Liga PPT?";
const SHORT =
  "Abrimos el Grupo de Reservas: una lista de espera oficial para quienes quieran unirse a la liga. Inscríbete, completa tu perfil y sé el primero en entrar cuando haya un cupo disponible.";

export const GrupoReservasAnuncio: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/anuncios#${ANCHOR}`
      : `/anuncios#${ANCHOR}`;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: TITLE, text: SHORT, url });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${TITLE}\n\n${SHORT}\n\n${url}`
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div id={ANCHOR} className="mb-8 scroll-mt-24">
      <AnnouncementCard onClick={() => setIsExpanded(!isExpanded)}>
        {/* Header */}
        <div className="relative flex items-center justify-center overflow-hidden p-8 bg-gray-950">
          <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-gray-950 to-black" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <FaUsers className="text-green-400" size={22} />
              <span className="text-white font-black text-2xl tracking-wider uppercase">
                Grupo de Reservas
              </span>
              <FaUsers className="text-green-400" size={22} />
            </div>
            <img
              src="/PPT.png"
              alt="Logo Liga PPT"
              className="object-contain w-20 h-20 opacity-90"
            />
            <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">
              Lista de espera oficial · Liga PPT
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                NUEVO
              </span>
              <h2 className="text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                {TITLE}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden text-sm text-gray-500 sm:block">
                26 de mayo de 2026
              </span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-green-50 p-2 text-green-600 transition hover:bg-green-100 hover:text-green-800"
                title="Compartir en WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded-full bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100 hover:text-blue-800"
                title="Compartir en Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <button
                onClick={handleShare}
                className="rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
                title="Compartir"
              >
                <FaShareAlt size={18} />
              </button>
              <IoIosArrowDown
                className={`text-gray-500 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
                size={20}
              />
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600">{SHORT}</p>
          <span className="mt-1 block text-xs text-gray-500 sm:hidden">
            26 de mayo de 2026
          </span>

          {isExpanded && (
            <div className="mt-4 border-t border-gray-200 pt-4 space-y-4">
              <p className="text-sm text-gray-700">
                La Liga PPT tiene <strong>72 jugadores activos</strong> y actualmente{" "}
                <strong>no hay cupos disponibles</strong>. Para que el proceso de ingreso sea
                justo y organizado, creamos el <strong>Grupo de Reservas</strong>: una lista
                de espera oficial donde puedes registrarte y esperar tu turno.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1.5 rounded-xl border border-green-100 bg-green-50 p-3">
                  <div className="flex items-center gap-2">
                    <FaUserPlus className="text-green-600" size={16} />
                    <span className="text-sm font-bold text-green-800">Inscripción fácil</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Solo necesitas tu nombre, edad, WhatsApp y posición preferida. Sin
                    requisitos complicados.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 rounded-xl border border-blue-100 bg-blue-50 p-3">
                  <div className="flex items-center gap-2">
                    <FaFutbol className="text-blue-600" size={16} />
                    <span className="text-sm font-bold text-blue-800">Partidos internos</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Ocasionalmente se organizan partidos dentro del grupo de reservas para
                    que te mantengas activo.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 rounded-xl border border-amber-100 bg-amber-50 p-3">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-amber-600" size={16} />
                    <span className="text-sm font-bold text-amber-800">Ingreso rápido</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Cuando haya un cupo, ya tienes tu perfil listo. La administración te
                    asigna nivel y posición sin demoras.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900 mb-1">Único requisito</p>
                <p>
                  Estar disponible <strong>todos los jueves a las 6:00 PM</strong> para las
                  jornadas. Si no puedes comprometerte con ese horario, la liga probablemente
                  no es para ti — y eso está bien.
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/participa-en-la-liga-ppt");
                }}
                className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700 active:scale-95"
              >
                Quiero inscribirme al Grupo de Reservas →
              </button>
            </div>
          )}
        </div>
      </AnnouncementCard>
    </div>
  );
};
