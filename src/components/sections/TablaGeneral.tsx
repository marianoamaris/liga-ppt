import React from "react";

interface TablaGeneralProps {
  tablaGeneral: any[];
  TEAM_COLORS: Record<string, string | [string, string]>;
  getEquipoStats?: any;
  arquerosMap?: Record<string, number>;
  arquerosEquipoMap?: Record<string, string>;
}

function TeamCircle({
  equipo,
  TEAM_COLORS,
}: {
  equipo: string;
  TEAM_COLORS: Record<string, string | [string, string]>;
}) {
  const color = TEAM_COLORS[equipo];
  if (Array.isArray(color)) {
    return (
      <span
        className="inline-block w-5 h-5 mr-2 align-middle border border-gray-400 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color[0]} 50%, ${color[1]} 50%)`,
        }}
        title={equipo}
      />
    );
  }
  const isWhite = color === "#FFFFFF";
  return (
    <span
      className={`inline-block w-5 h-5 rounded-full mr-2 align-middle border ${
        isWhite ? "border-gray-400" : "border-transparent"
      }`}
      style={{ background: color || "#D1D5DB" }}
      title={equipo}
    />
  );
}

export const TablaGeneral: React.FC<TablaGeneralProps> = ({
  tablaGeneral,
  TEAM_COLORS,
  getEquipoStats,
  arquerosMap,
  arquerosEquipoMap,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm text-left">
      <thead>
        <tr className="font-bold text-gray-500 border-b">
          <th className="py-1 pr-2">#</th>
          <th className="py-1 pr-4">Equipo</th>
          <th className="px-2 py-1">PJ</th>
          <th className="px-2 py-1">V</th>
          <th className="px-2 py-1">E</th>
          <th className="px-2 py-1">D</th>
          <th className="px-2 py-1">%V</th>
          <th className="px-2 py-1 text-right">Puntos</th>
        </tr>
      </thead>
      <tbody>
        {tablaGeneral.map((row: any, index: number) => {
          let stats = {
            partidosJugados: "-",
            derrotas: "-",
            porcentajeVictoria: "-",
          };
          if (getEquipoStats && arquerosMap && arquerosEquipoMap) {
            stats = getEquipoStats(
              row.equipo,
              row,
              arquerosMap,
              arquerosEquipoMap
            );
          } else {
            const victorias = row.victorias || 0;
            const empates = row.empates || 0;
            const partidosJugados = victorias + empates;
            const porcentajeVictoria =
              partidosJugados > 0
                ? ((victorias / partidosJugados) * 100).toFixed(1)
                : "-";
            stats = {
              partidosJugados,
              derrotas: "-",
              porcentajeVictoria,
            };
          }
          return (
            <tr key={row.equipo} className="border-b last:border-b-0">
              <td className="py-1 pr-2 font-bold text-gray-500">{index + 1}</td>
              <td className="flex items-center py-1 pr-4">
                <TeamCircle equipo={row.equipo} TEAM_COLORS={TEAM_COLORS} />
                <span className="font-medium">{row.equipo}</span>
              </td>
              <td className="px-2 py-1">{stats.partidosJugados}</td>
              <td className="px-2 py-1">{row.victorias ?? "-"}</td>
              <td className="px-2 py-1">{row.empates ?? "-"}</td>
              <td className="px-2 py-1 text-red-500">{stats.derrotas}</td>
              <td className="px-2 py-1 text-green-600">
                {stats.porcentajeVictoria}%
              </td>
              <td className="px-2 py-1 font-bold text-right">{row.puntos}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
