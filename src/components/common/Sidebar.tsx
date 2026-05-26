import React, { useEffect, useState } from "react";
import { GiSoccerKick, GiWhistle } from "react-icons/gi";
import { FaHome, FaRegCalendarAlt } from "react-icons/fa";
import {
  FaRankingStar,
  FaMedal,
  FaChevronLeft,
  FaChevronRight,
  FaGavel,
  FaBullhorn,
  FaHandshake,
  FaUserPen,
  FaUserPlus,
  FaSignal,
  FaChartBar,
} from "react-icons/fa6";
import { SIDEBAR_ITEMS, THEME } from "../../constants/theme";

const ICONS: Record<
  string,
  React.ComponentType<{ className?: string; size?: number }>
> = {
  FaHome,
  GiSoccerKick,
  FaRankingStar,
  GiWhistle,
  FaMedal,
  FaGavel,
  FaBullhorn,
  FaHandshake,
  FaUserPen,
  FaUserPlus,
  FaRegCalendarAlt,
  FaSignal,
  FaChartBar,
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
      <div className="flex-col items-center hidden md:flex">
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
      <ul
        className={`flex flex-col flex-1 justify-start space-y-2 ${
          mobile ? "pt-2" : "pt-1"
        }`}
      >
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
        // <div className="flex items-center justify-center p-6 bg-black">
        <div className="flex justify-center">
          <img
            src="/PPT.png"
            alt="Logo Liga PPT"
            className="object-contain w-24 h-24"
          />
        </div>

        // </div>
      )}
    </nav>
  );
};
