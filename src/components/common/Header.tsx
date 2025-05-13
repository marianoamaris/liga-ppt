import React from "react";
import { THEME } from "../../constants/theme";

interface HeaderProps {
  setShowSignIn: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setShowSignIn }) => (
  <header
    className="relative flex items-center justify-center h-20 shadow-md"
    style={{ background: "linear-gradient(to bottom, #000 60%, #222 100%)" }}
  >
    <img
      src={THEME.logo.escudo}
      alt="Escudo Liga PPT"
      className="absolute object-cover -translate-x-1/2 -translate-y-1/2 bg-transparent border-2 border-gray-800 rounded-full shadow-lg w-14 h-14 left-1/2 top-1/2"
      style={{ zIndex: 10 }}
    />
  </header>
);
