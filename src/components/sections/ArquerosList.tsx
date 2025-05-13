import React from "react";
import { GiGloves } from "react-icons/gi";

interface Arquero {
  arquero: string;
  golesRecibidos: number;
}

interface ArquerosListProps {
  arqueros: Arquero[];
  mejorArquero?: Arquero;
  tablaGeneral: any[];
  arquerosEquipoMap: Record<string, string>;
  TEAM_COLORS: Record<string, string | [string, string]>;
}

export const ArquerosList: React.FC<ArquerosListProps> = ({
  arqueros,
  mejorArquero,
  tablaGeneral,
  arquerosEquipoMap,
  TEAM_COLORS,
}) => (
  <div className="mb-6">
    <h3 className="mb-2 font-semibold text-gray-700">
      Arqueros - Goles Recibidos
    </h3>
    {mejorArquero && (
      <div className="flex items-center mb-2 font-bold text-blue-700">
        <span className="mr-2">🧤</span>
        Mejor arquero: {mejorArquero.arquero} ({mejorArquero.golesRecibidos}{" "}
        goles)
      </div>
    )}
    <div className="mb-2 text-xs text-gray-500">
      Promedio = Goles recibidos / Partidos jugados
    </div>
    <ul className="pl-0 space-y-2">
      {arqueros.map((a, i) => {
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
        // Buscar el equipo correspondiente al arquero usando el mapeo de arqueros por liga
        const equipo = Object.keys(arquerosEquipoMap).find(
          (eq) => arquerosEquipoMap[eq] === a.arquero
        );
        let partidosJugados = null;
        if (equipo && tablaGeneral) {
          const row = tablaGeneral.find((r: any) => r.equipo === equipo);
          if (row) {
            if (typeof row.pj === "number") {
              partidosJugados = row.pj;
            } else {
              const victorias = row.victorias ?? 0;
              const empates = row.empates ?? 0;
              partidosJugados = victorias + empates;
            }
          }
        }
        const promedio =
          partidosJugados && a.golesRecibidos && partidosJugados > 0
            ? (a.golesRecibidos / partidosJugados).toFixed(2)
            : "-";
        return (
          <li
            key={a.arquero + i}
            className={`flex items-center px-4 py-2 rounded-lg border transition-all duration-300 shadow-sm gap-2 ${bg} ${
              i < 3 ? "scale-105" : "hover:bg-gray-100"
            } animate-fade-in-up`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {medal}
            <GiGloves className="mr-2 text-blue-700" />
            <span className={`flex-1 ${text}`}>{a.arquero}</span>
            <span className="ml-2 text-lg font-bold text-gray-800">
              {a.golesRecibidos}
            </span>
            <span className="ml-1 text-xs text-gray-500">goles</span>
            <span className="ml-4 text-xs font-semibold text-gray-600">
              PJ: {partidosJugados ?? "-"}
            </span>
            <span className="ml-4 text-xs font-semibold text-gray-600">
              Prom: {promedio}
            </span>
          </li>
        );
      })}
    </ul>
  </div>
);
