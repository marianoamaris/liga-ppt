import React from "react";
import { Card } from "../common/Card";
import { TEAM_COLORS } from "../../constants/DATOS_LIGAS";

const BracketTeam = ({
  teamName,
  seed,
}: {
  teamName: string;
  seed?: number;
}) => {
  const color = TEAM_COLORS[teamName];
  const isWhite = Array.isArray(color)
    ? false
    : color === "#FFFFFF" || color === "#ffffff";

  return (
    <div className="flex items-center w-48 p-2 bg-gray-100 rounded-lg shadow-sm">
      {Array.isArray(color) ? (
        <span
          className="w-5 h-5 mr-2 border border-gray-400 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color[0]} 50%, ${color[1]} 50%)`,
          }}
        />
      ) : (
        <span
          className={`w-5 h-5 mr-2 border rounded-full ${
            isWhite ? "border-gray-400" : "border-transparent"
          }`}
          style={{ backgroundColor: color || "#D1D5DB" }}
        />
      )}
      <span className="text-sm font-semibold">{teamName}</span>
      {seed && (
        <span className="ml-auto text-xs font-bold text-gray-500">#{seed}</span>
      )}
    </div>
  );
};

// Main bracket component
export const PlayoffsBracket: React.FC = () => {
  return (
    <Card className="w-full max-w-5xl p-4 mb-8 bg-white sm:p-6">
      <h2 className="mb-4 text-xl font-bold text-center sm:text-2xl">
        Playoffs Liga #13
      </h2>

      <div className="p-3 mb-6 rounded-lg bg-gray-50 sm:p-4">
        <h3 className="mb-3 text-base font-bold text-center sm:text-lg">
          Cuartos de Final: Miércoles 25 de Junio
        </h3>
        <div className="flex flex-col items-center justify-center gap-2 text-xs text-center sm:flex-row sm:gap-6 sm:text-sm">
          <p>
            <b>Partido 1 (6:00 – 7:00 p.m.):</b> 🟣 Fiorentina vs 🔵 Celta de
            Vigo
          </p>
          <p>
            <b>Partido 2 (7:00 – 8:00 p.m.):</b> ⚪️ Inglaterra vs ⚫️ Alemania
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-4">
          {/* Semifinalists */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm font-bold text-center text-gray-600 uppercase">
              Clasificados a Semifinales
            </h3>
            <div className="flex flex-row flex-wrap justify-center gap-4 lg:flex-col">
              <BracketTeam teamName="Sport Boys" seed={1} />
              <BracketTeam teamName="Holanda" seed={2} />
            </div>
          </div>

          {/* Quarterfinals */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm font-bold text-center text-gray-600 uppercase">
              Cuartos de Final
            </h3>
            <div className="flex flex-row flex-wrap justify-center gap-4 lg:flex-col">
              {/* Match 2 */}
              <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg">
                <BracketTeam teamName="Inglaterra" seed={4} />
                <span className="my-1 text-xs font-bold">VS</span>
                <BracketTeam teamName="Alemania" seed={5} />
              </div>

              {/* Match 1 */}
              <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg">
                <BracketTeam teamName="Fiorentina" seed={3} />
                <span className="my-1 text-xs font-bold">VS</span>
                <BracketTeam teamName="Celta de Vigo" seed={6} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-center text-gray-600">
        <p>
          El ganador de (Inglaterra vs Alemania) se enfrentará a{" "}
          <span className="font-bold">Sport Boys</span>.
        </p>
        <p>
          El ganador de (Fiorentina vs Celta de Vigo) se enfrentará a{" "}
          <span className="font-bold">Holanda</span>.
        </p>
      </div>
    </Card>
  );
};
