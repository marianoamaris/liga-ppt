import React, { useState, useRef, useEffect } from "react";

interface LigaDropdownProps {
  ligas: number[];
  ligaSeleccionada: number;
  setLigaSeleccionada: (liga: number) => void;
  TOTAL_LIGAS: number;
  className?: string;
}

export const LigaDropdown: React.FC<LigaDropdownProps> = ({
  ligas,
  ligaSeleccionada,
  setLigaSeleccionada,
  TOTAL_LIGAS,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLigaSelect = (liga: number) => {
    setLigaSeleccionada(liga);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <span className="flex items-center">
          <span className="font-semibold">Liga #{ligaSeleccionada}</span>
          {ligaSeleccionada === TOTAL_LIGAS && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-500 text-white">
              Actual
            </span>
          )}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {ligas.map((liga) => (
            <button
              key={liga}
              onClick={() => handleLigaSelect(liga)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                ligaSeleccionada === liga
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Liga #{liga}</span>
                {liga === TOTAL_LIGAS && (
                  <span className="px-2 py-0.5 text-xs rounded bg-blue-500 text-white">
                    Actual
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
