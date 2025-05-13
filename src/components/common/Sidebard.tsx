import React from "react";
import { GiSoccerKick, GiWhistle } from "react-icons/gi";
import { FaRankingStar } from "react-icons/fa6";
import { SIDEBAR_ITEMS, THEME } from "../../constants/theme";

const ICONS: Record<string, React.ReactNode> = {
  GiSoccerKick: <GiSoccerKick size={22} className="mr-2" />,
  FaRankingStar: <FaRankingStar size={22} className="mr-2" />,
  GiWhistle: <GiWhistle size={22} className="mr-2" />,
};

interface SidebarProps {
  onItemClick: (path: string) => void;
  selectedPath: string;
  onSignInClick?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onItemClick,
  selectedPath,
  onSignInClick,
}) => (
  <nav
    className={`${THEME.colors.primary} ${THEME.colors.text.primary} w-60 min-h-screen p-6 flex flex-col justify-between`}
    style={{ background: "linear-gradient(to bottom, #000 60%, #222 100%)" }}
  >
    <div className="flex flex-col items-center mb-8">
      <button
        onClick={onSignInClick}
        className="w-full mb-6 px-4 py-2 rounded-lg font-semibold bg-gray-400 text-white hover:bg-gray-500 cursor-pointer shadow transition text-center"
      >
        Iniciar sesión / Registrarme
      </button>
    </div>
    <ul className="space-y-4 flex-1 flex flex-col justify-center">
      {SIDEBAR_ITEMS.map((item) => (
        <li
          key={item.id}
          onClick={() => onItemClick(item.path)}
          className={`flex items-center transition-colors p-2 rounded-lg cursor-pointer
            ${
              selectedPath === item.path
                ? THEME.colors.selected
                : `${THEME.colors.text.secondary} hover:${THEME.colors.hover}`
            }
          `}
        >
          {ICONS[item.icon]}
          {item.label}
        </li>
      ))}
    </ul>
    {/* Botón para ir al reglamento */}
    <button
      onClick={() => onItemClick("/reglamento")}
      className="w-full mt-4 px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow transition flex items-center justify-center gap-2"
    >
      Reglamento
    </button>
    <div className="flex justify-center mt-8 mb-2">
      <img
        src={THEME.logo.escudo}
        alt="Escudo Liga PPT"
        className="w-12 h-12 object-cover rounded-full shadow-lg bg-white"
      />
    </div>
  </nav>
);
