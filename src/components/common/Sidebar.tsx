import React, { useEffect, useState } from "react";
import { GiSoccerKick, GiWhistle } from "react-icons/gi";
import {
  FaRankingStar,
  FaMedal,
  FaChevronLeft,
  FaChevronRight,
  FaGavel,
} from "react-icons/fa6";
import { SIDEBAR_ITEMS, THEME } from "../../constants/theme";

const ICONS: Record<
  string,
  React.ComponentType<{ className?: string; size?: number }>
> = {
  GiSoccerKick,
  FaRankingStar,
  GiWhistle,
  FaMedal,
  FaGavel,
};

interface SidebarProps {
  onItemClick: (path: string) => void;
  selectedPath: string;
  onSignInClick?: () => void;
  className?: string;
  mobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onItemClick,
  selectedPath,
  mobile,
  className,
}) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    if (saved !== null) setExpanded(saved === "true");
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", expanded ? "true" : "false");
  }, [expanded]);

  return (
    <nav
      className={`${THEME.colors.primary} ${THEME.colors.text.primary} ${
        expanded ? "w-60" : "w-20"
      } ${className}`}
      style={{ background: "linear-gradient(to bottom, #000 60%, #222 100%)" }}
    >
      <div className="hidden md:flex flex-col items-center">
        {/* <button
          onClick={onSignInClick}
          className={`w-full mb-6 px-2 py-2 rounded-lg font-semibold bg-gray-400 text-white hover:bg-gray-500 cursor-pointer shadow transition text-center ${
            expanded ? "" : "text-xs px-0"
          }`}
        >
          {expanded ? (
            "Iniciar sesión / Registrarme"
          ) : (
            <span className="text-lg">🔑</span>
          )}
        </button> */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="self-end p-2 mb-2 text-white transition bg-gray-800 rounded-full shadow hover:bg-gray-700"
          title={expanded ? "Colapsar menú" : "Expandir menú"}
        >
          {expanded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      <ul className="flex flex-col flex-1 space-y-2">
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
              ${expanded ? "" : "justify-center"}
            `}
            title={!expanded ? item.label : undefined}
          >
            {ICONS[item.icon] &&
              React.createElement(ICONS[item.icon], {
                size: 22,
                className: expanded ? "mr-2" : "mx-auto",
              })}
            {expanded && <span>{item.label}</span>}
          </li>
        ))}
      </ul>
      {!mobile && (
        <div className="flex flex-col items-center mt-8 mb-2">
          <img
            src={THEME.logo.escudo}
            alt="Escudo Liga PPT"
            className="object-cover w-12 h-12 bg-white rounded-full shadow-lg"
          />
        </div>
      )}
    </nav>
  );
};
