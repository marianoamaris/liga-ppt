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
  const normalized = equipo?.trim();
  const color = TEAM_COLORS[normalized] || TEAM_COLORS[equipo] || "#D1D5DB";
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

// Helper para extraer nombre y score de un string tipo "Napoli 7" o "Inter Miami 3"
function parseTeamAndScore(str: string) {
  const match = str.match(/^(.*)\s(\d+)$/);
  if (match) {
    return { name: match[1], score: match[2] };
  }
  return { name: str, score: "" };
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
      <div className="mb-2 text-sm md:text-base">
        <div className="font-semibold text-gray-600 mb-1">Semifinales</div>
        <ul className=" pl-6">
          {semifinales.map((sf, idx) => {
            if (!sf || typeof sf !== "string" || !sf.includes(" - ")) {
              return (
                <li key={idx} className="mb-1 text-gray-700">
                  {sf}
                </li>
              );
            }
            const [team1Raw, team2Raw] = sf.split(" - ");
            if (!team1Raw || !team2Raw) {
              return (
                <li key={idx} className="mb-1 text-gray-700">
                  {sf}
                </li>
              );
            }
            const team1 = parseTeamAndScore(team1Raw.trim());
            const team2 = parseTeamAndScore(team2Raw.trim());
            return (
              <li key={idx} className="mb-1 text-gray-700">
                <div className="flex items-center">
                  <TeamCircle equipo={team1.name} TEAM_COLORS={TEAM_COLORS} />
                  <span className="mr-2">{team1.name}</span>
                  <span className="font-bold">{team1.score}</span>
                  <span className="mx-2">-</span>
                  <span className="font-bold">{team2.score}</span>
                  <span className="mx-2">{team2.name}</span>
                  <TeamCircle equipo={team2.name} TEAM_COLORS={TEAM_COLORS} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    )}
    <div className="mb-2">
      <div className="font-semibold text-gray-600 mb-1">Final</div>
      {(() => {
        if (!final || typeof final !== "string" || !final.includes(" - "))
          return <div className="mb-2 text-gray-800">{final}</div>;
        const [team1Raw, team2Raw] = final.split(" - ");
        if (!team1Raw || !team2Raw)
          return <div className="mb-2 text-gray-800">{final}</div>;
        const team1 = parseTeamAndScore(team1Raw.trim());
        const team2 = parseTeamAndScore(team2Raw.trim());
        return (
          <div className="mb-2 text-gray-800 text-sm md:text-base">
            <div className="flex items-center">
              <TeamCircle equipo={team1.name} TEAM_COLORS={TEAM_COLORS} />
              <span className="mr-2">{team1.name}</span>
              <span className="font-bold">{team1.score}</span>
              <span className="mx-2">-</span>
              <span className="font-bold">{team2.score}</span>
              <span className="mx-2">{team2.name}</span>
              <TeamCircle equipo={team2.name} TEAM_COLORS={TEAM_COLORS} />
            </div>
          </div>
        );
      })()}
      <div className="flex items-center font-bold text-blue-700 text-sm md:text-base">
        <TeamCircle equipo={ganador} TEAM_COLORS={TEAM_COLORS} />
        Ganador: {ganador}
      </div>
    </div>
  </div>
);
