import React from "react";

interface JornadasProps {
  jornadas: any[];
  TEAM_COLORS: Record<string, string | [string, string]>;
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

export const Jornadas: React.FC<JornadasProps> = ({
  jornadas,
  TEAM_COLORS,
}) => (
  <div className="space-y-4">
    {jornadas.map((jornada: any) => (
      <div key={jornada.nombre} className="p-3 bg-gray-100 rounded">
        <div className="mb-1 font-semibold text-gray-800">{jornada.nombre}</div>
        {jornada.resultados.length > 0 ? (
          <ul>
            {jornada.resultados.map((res: any, index: number) => (
              <li
                key={res.equipo}
                className="flex items-center text-xs md:text-sm mb-0.5"
              >
                <span className="w-6 font-bold text-gray-500">{index + 1}</span>
                <TeamCircle equipo={res.equipo} TEAM_COLORS={TEAM_COLORS} />
                <span className="mr-2">{res.equipo}</span>
                <span className="ml-auto font-bold">{res.puntos} pts</span>
                {res.victorias !== undefined && (
                  <span className="ml-4 text-xs text-gray-500">
                    {res.victorias}V
                  </span>
                )}
                {res.empates !== undefined && (
                  <span className="ml-2 text-xs text-gray-400">
                    {res.empates}E
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mb-2 text-xs italic text-gray-400 md:text-sm">
            Sin datos de resultados
          </div>
        )}
      </div>
    ))}
  </div>
);
