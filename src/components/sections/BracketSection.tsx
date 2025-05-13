import React from "react";

interface BracketSectionProps {
  semifinales?: string[];
  final: string;
  ganador: string;
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

export const BracketSection: React.FC<BracketSectionProps> = ({
  semifinales,
  final,
  ganador,
  TEAM_COLORS,
}) => (
  <div className="mb-6">
    <h3 className="mb-2 font-semibold text-gray-700">Bracket</h3>
    {semifinales && semifinales.length > 0 && (
      <div className="mb-2">
        <div className="font-semibold text-gray-600 mb-1">Semifinales</div>
        <ul className="list-disc pl-6">
          {semifinales.map((sf, idx) => (
            <li key={idx} className="mb-1 text-gray-700">
              {sf}
            </li>
          ))}
        </ul>
      </div>
    )}
    <div className="mb-2">
      <div className="font-semibold text-gray-600 mb-1">Final</div>
      <div className="mb-2 text-gray-800">{final}</div>
      <div className="flex items-center font-bold text-blue-700">
        <TeamCircle equipo={ganador} TEAM_COLORS={TEAM_COLORS} />
        Ganador: {ganador}
      </div>
    </div>
  </div>
);
