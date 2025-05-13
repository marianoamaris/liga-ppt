import React from "react";

interface LigaSidebarProps {
  ligas: number[];
  ligaSeleccionada: number;
  setLigaSeleccionada: (liga: number) => void;
  TOTAL_LIGAS: number;
}

export const LigaSidebar: React.FC<LigaSidebarProps> = ({
  ligas,
  ligaSeleccionada,
  setLigaSeleccionada,
  TOTAL_LIGAS,
}) => (
  <div className="flex h-full max-h-full flex-col gap-2 overflow-y-auto min-w-[120px] pb-4">
    {ligas.map((liga) => (
      <button
        key={liga}
        onClick={() => setLigaSeleccionada(liga)}
        className={`px-4 py-2 rounded-lg font-semibold cursor-pointer border-l-4 text-left transition
          ${
            ligaSeleccionada === liga
              ? "bg-gray-900 text-white border-l-blue-500 shadow-lg"
              : "bg-gray-200 text-gray-700 border-l-transparent hover:bg-gray-300"
          }
        `}
      >
        Liga #{liga}
        {liga === TOTAL_LIGAS && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-500 text-white">
            Actual
          </span>
        )}
      </button>
    ))}
  </div>
);
