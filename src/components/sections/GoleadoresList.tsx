import React from "react";
import { FaFutbol } from "react-icons/fa";

interface GoleadoresListProps {
  goleadoresTotales: { jugador: string; goles: number }[];
  goleadorLiga?: { jugador: string; goles: number };
}

export const GoleadoresList: React.FC<GoleadoresListProps> = ({
  goleadoresTotales,
  goleadorLiga,
}) => (
  <div className="mb-6">
    <h3 className="mb-2 font-semibold text-gray-700">Goleadores Totales</h3>
    {goleadorLiga && (
      <div className="flex items-center mb-4 font-bold text-yellow-600">
        <span className="mr-2">🏆</span>
        Goleador de la liga: {goleadorLiga.jugador} ({goleadorLiga.goles} goles)
      </div>
    )}
    <ul className="pl-0 space-y-2">
      {goleadoresTotales.map((g, i) => {
        let medal = null;
        let bg = "";
        let text = "";
        if (i === 0) {
          medal = <span className="mr-2 text-2xl">🥇</span>;
          bg = "bg-yellow-100 border-yellow-400";
          text = "text-yellow-700 font-bold";
        } else if (i === 1) {
          medal = <span className="mr-2 text-2xl">🥈</span>;
          bg = "bg-gray-200 border-gray-400";
          text = "text-gray-700 font-semibold";
        } else if (i === 2) {
          medal = <span className="mr-2 text-2xl">🥉</span>;
          bg = "bg-orange-300 border-orange-400";
          text = "text-orange-900 font-semibold";
        }
        return (
          <li
            key={g.jugador + i}
            className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-300 shadow-sm gap-2 ${bg} ${
              i < 3 ? "scale-105" : "hover:bg-gray-100"
            } animate-fade-in-up`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {medal}
            <FaFutbol className="mr-2 text-green-600" />
            <span className={`flex-1 ${text}`}>{g.jugador}</span>
            <span className="ml-2 text-lg font-bold text-gray-800">
              {g.goles}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              gol{g.goles > 1 ? "es" : ""}
            </span>
          </li>
        );
      })}
    </ul>
  </div>
);
