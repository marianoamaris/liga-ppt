import React, { useState } from "react";
import {
  CHANGELOG_DATA,
  type ChangelogEntry,
  type ChangeType,
} from "../constants/CHANGELOG";
import { IoIosArrowDown } from "react-icons/io";
import { FaShareAlt, FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { AnnouncementCard } from "../components/common/AnnouncementCard";

const getBadgeClass = (type: ChangeType) => {
  switch (type) {
    case "NUEVO":
      return "bg-green-100 text-green-800";
    case "MEJORA":
      return "bg-blue-100 text-blue-800";
    case "FIX":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ChangelogItem: React.FC<{ entry: ChangelogEntry }> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const url = `${window.location.origin}/anuncios#${entry.version}`;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: entry.title,
        text: entry.description,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    entry.title + "\n" + entry.description + "\n" + url
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;

  return (
    <AnnouncementCard onClick={() => setIsExpanded(!isExpanded)}>
      {/* Top black section with logo */}
      <div className="flex items-center justify-center p-6 bg-black">
        <img
          src="/PPT.png"
          alt="Logo Liga PPT"
          className="object-contain w-24 h-24"
        />
      </div>

      {/* Bottom white section */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{entry.title}</h2>
          <div className="flex items-center gap-2">
            <span className="hidden mr-2 text-sm text-gray-500 sm:block">
              {entry.date}
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
        <p className="mt-2 text-sm text-gray-600">{entry.description}</p>
        <span className="mt-2 text-xs text-gray-500 sm:hidden">
          {entry.date}
        </span>

        {/* Expanded content */}
        {isExpanded && (
          <div className="pt-4 mt-4 border-t border-gray-200">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">
              Detalles de los cambios:
            </h3>
            <ul className="space-y-3">
              {entry.changes.map((change, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span
                    className={`text-xs font-semibold mr-3 px-2.5 py-0.5 rounded-full ${getBadgeClass(
                      change.type
                    )}`}
                  >
                    {change.type}
                  </span>
                  <span className="flex-1 text-gray-700">
                    {change.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-4 text-right">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-lg">
            Versión {entry.version}
          </span>
        </div>
      </div>
    </AnnouncementCard>
  );
};

export const AnunciosPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-screen p-2 md:p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Historial de Cambios y Anuncios
          </h1>
          <p className="max-w-2xl mx-auto mt-2 text-base text-gray-600">
            Aquí encontrarás las últimas noticias referentes a la Liga y su
            ecosistema.
          </p>
        </div>
        {CHANGELOG_DATA.map((entry) => (
          <ChangelogItem key={entry.version} entry={entry} />
        ))}
      </div>
    </div>
  );
};
