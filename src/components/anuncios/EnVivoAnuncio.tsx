import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaShareAlt, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { AnnouncementCard } from "../common/AnnouncementCard";

const ANCHOR = "en-vivo-feature";
const TITLE = "📡 Liga PPT ahora es En Vivo";
const SHORT =
  "Cualquier persona puede seguir los partidos en tiempo real desde su celular: marcador, clasificación, goleadores y mejor arquero — todo sin necesidad de iniciar sesión.";

export const EnVivoAnuncio: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
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
        {/* Header oscuro con gradiente */}
        <div className="relative flex items-center justify-center p-8 bg-gray-950 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white font-black text-2xl tracking-wider uppercase">
                En Vivo
              </span>
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            </div>
            <img
              src="/PPT.png"
              alt="Logo Liga PPT"
              className="object-contain w-20 h-20 opacity-90"
            />
            <span className="text-green-400 text-xs font-semibold tracking-widest uppercase">
              Tiempo Real · Liga PPT
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
              {TITLE}
            </h2>
            <div className="flex flex-shrink-0 items-center gap-2 self-end sm:self-auto">
              <span className="hidden text-sm text-gray-500 sm:block">
                23 de mayo de 2026
              </span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-green-600 transition rounded-full bg-green-50 hover:bg-green-100 hover:text-green-800"
                title="Compartir en WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-blue-600 transition rounded-full bg-blue-50 hover:bg-blue-100 hover:text-blue-800"
                title="Compartir en Facebook"
              >
                <FaFacebookF size={16} />
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="p-2 text-gray-500 transition bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-700"
                title="Compartir anuncio"
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
          <p className="mt-3 text-sm text-gray-600 sm:text-base">{SHORT}</p>
          <span className="mt-2 text-xs text-gray-500 sm:hidden">
            23 de mayo de 2026
          </span>

          {isExpanded && (
            <div className="pt-5 mt-5 space-y-5 text-sm leading-relaxed text-gray-700 border-t border-gray-200 sm:text-base">
              <p>
                A partir de hoy, la Liga PPT tiene una página{" "}
                <strong className="text-gray-900">En Vivo</strong> accesible para
                cualquier persona — sin registros, sin contraseñas. Basta con entrar
                al sitio y tocar <strong className="text-gray-900">En Vivo</strong> en
                el menú.
              </p>

              <section>
                <h3 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
                  ¿Qué puedes ver en tiempo real?
                </h3>
                <ul className="pl-1 space-y-3 list-none">
                  <li className="flex gap-3">
                    <span aria-hidden className="text-lg">⚽</span>
                    <span>
                      <strong className="text-gray-900">Marcador de cada cancha</strong> — goles, autogoles, empates y
                      tarjetas registrados al instante por el anotador del partido.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden className="text-lg">🏆</span>
                    <span>
                      <strong className="text-gray-900">Clasificación en vivo</strong> — la tabla general se actualiza
                      automáticamente con los puntos que se van sumando en cada partido activo,
                      sin esperar a que termine la jornada.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden className="text-lg">👟</span>
                    <span>
                      <strong className="text-gray-900">Tabla de goleadores</strong> — quién lleva más goles en la
                      temporada, actualizado en tiempo real.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden className="text-lg">🧤</span>
                    <span>
                      <strong className="text-gray-900">Valla menos vencida</strong> — el ranking de arqueros según
                      goles recibidos, también en tiempo real.
                    </span>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 text-base font-bold text-gray-900 sm:text-lg">
                  ¿Cómo funciona?
                </h3>
                <p>
                  Cada jornada tiene un <strong className="text-gray-900">anotador designado</strong> que registra
                  los eventos del partido desde una pantalla especial. Cada gol, empate o
                  tarjeta que anota aparece en la vista En Vivo en cuestión de segundos,
                  para todos los que estén conectados.
                </p>
                <p className="mt-3">
                  La página se actualiza <strong className="text-gray-900">automáticamente cada 10 segundos</strong> y
                  además escucha cambios en tiempo real — no hace falta recargar.
                </p>
              </section>

              <p className="pt-1 text-base font-semibold text-gray-900">
                La Liga PPT no es solo un partido de fútbol — es una experiencia
                que ahora cualquiera puede seguir desde donde esté. 📱🔥
              </p>
            </div>
          )}

          <div className="mt-4 text-right">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg">
              Liga #19 · Feature En Vivo
            </span>
          </div>
        </div>
      </AnnouncementCard>
    </div>
  );
};
