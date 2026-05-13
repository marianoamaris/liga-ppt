import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaShareAlt, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { AnnouncementCard } from "../common/AnnouncementCard";

const ANCHOR = "l19-mundial";
const TITLE = "🌍🏆 Liga PPT #19 - Edición Mundial";
const SHORT =
  "Temática Copa del Mundo 2026, equipos con nombres de selecciones clasificadas y premios especiales para la edición más grande de la liga.";

export const Liga19MundialAnnouncement: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/anuncios#${ANCHOR}`
      : `/anuncios#${ANCHOR}`;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({
        title: TITLE,
        text: SHORT,
        url,
      });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${TITLE}\n\n${SHORT}\n\n${url}`
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;

  return (
    <div id={ANCHOR} className="mb-8 scroll-mt-24">
      <AnnouncementCard onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-center p-6 bg-black">
          <img
            src="/PPT.png"
            alt="Logo Liga PPT"
            className="object-contain w-24 h-24"
          />
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
              {TITLE}
            </h2>
            <div className="flex flex-shrink-0 items-center gap-2 self-end sm:self-auto">
              <span className="hidden text-sm text-gray-500 sm:block">
                12 de mayo de 2026
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
            12 de mayo de 2026
          </span>

          {isExpanded && (
            <div className="pt-5 mt-5 space-y-5 text-sm leading-relaxed text-gray-700 border-t border-gray-200 sm:text-base">
              <p>
                La temporada{" "}
                <strong className="text-gray-900">19</strong> tendrá una
                temática especial inspirada en la{" "}
                <strong className="text-gray-900">Copa del Mundo 2026</strong>.
              </p>
              <p>
                ⚽ Los equipos llevarán exclusivamente{" "}
                <strong className="text-gray-900">
                  nombres de selecciones clasificadas
                </strong>{" "}
                al Mundial 2026, lo que le dará un toque único a esta edición.
              </p>
              <p className="font-semibold text-gray-900">
                Una temporada especial merece premios especiales… 🔥
              </p>

              <section>
                <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg">
                  💰🏆 Premios – Edición Mundial
                </h3>
                <p className="mb-2 font-semibold text-gray-800">
                  Premios por equipo:
                </p>
                <ul className="pl-1 space-y-2 list-none">
                  <li className="flex gap-2">
                    <span aria-hidden>🏆</span>
                    <span>
                      <strong>1er puesto:</strong> $1.800.000 + una salchipapa
                      para 8 personas en Callejeros
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>🥈</span>
                    <span>
                      <strong>2do puesto:</strong> $560.000
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>🥉</span>
                    <span>
                      <strong>3er puesto:</strong> $240.000 (habrá partido por
                      el tercer puesto)
                    </span>
                  </li>
                </ul>
              </section>

              <section>
                <p className="mb-2 font-semibold text-gray-800">
                  Premios individuales:
                </p>
                <ul className="pl-1 space-y-2 list-none">
                  <li className="flex gap-2">
                    <span aria-hidden>⚽</span>
                    <span>
                      <strong>Goleador de la Liga:</strong> $120.000
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>🧤</span>
                    <span>
                      <strong>Mejor Arquero:</strong> $120.000
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>🌟</span>
                    <span>
                      <strong>MVP de la Liga:</strong> $120.000
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>🏅</span>
                    <span>
                      <strong>MVP de la Final:</strong> $120.000
                    </span>
                  </li>
                </ul>
              </section>

              <p className="pt-1 text-base font-semibold text-gray-900">
                La edición más grande en la historia de la Liga PPT está por
                comenzar. 🌍🔥
              </p>
            </div>
          )}

          <div className="mt-4 text-right">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg">
              Liga #19 · Edición Mundial
            </span>
          </div>
        </div>
      </AnnouncementCard>
    </div>
  );
};
