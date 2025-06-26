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
    <div className="flex items-center w-full md:w-48 p-2 bg-gray-100 rounded-lg shadow-sm">
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
        Semifinales - Liga PPT #13
      </h2>

      {/* <div className="p-3 mb-6 rounded-lg bg-gray-50 sm:p-4">
        <h3 className="mb-3 text-base font-bold text-center sm:text-lg">
          Cuartos de Final: Miércoles 25 de Junio
        </h3>
        <div className="flex flex-col items-center justify-center gap-2 text-xs text-center sm:flex-row sm:gap-6 sm:text-sm">
          <div className="flex flex-col gap-1">
            <span>
              <b>Partido 1:</b> 🟣 Fiorentina <b>9</b> - <b>8</b> 🔵 Celta de
              Vigo
            </span>
            <span>
              <b>Partido 2:</b> ⚪️ Inglaterra <b>5</b> - <b>2</b> ⚫️ Alemania
            </span>
          </div>
        </div>
      </div> */}

      <div className="flex justify-center">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-4">
          {/* Semifinalists */}
          {/* <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm font-bold text-center text-gray-600 uppercase">
              Clasificados a Semifinales
            </h3>
            <div className="flex flex-row flex-wrap justify-center gap-4 lg:flex-col">
              <BracketTeam teamName="Sport Boys" seed={1} />
              <BracketTeam teamName="Holanda" seed={2} />
            </div>
          </div> */}

          {/* Semifinales */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm font-bold text-center text-gray-600 uppercase">
              Semifinales - Viernes 27 de Junio
            </h3>
            <div className="flex flex-row flex-wrap justify-center gap-4 lg:flex-col">
              <div className="flex flex-col md:flex-row items-center p-2 border border-gray-200 rounded-lg w-full md:w-auto gap-2 md:gap-0">
                <BracketTeam teamName="Sport Boys" seed={1} />
                <span className="px-3 my-2 md:my-1 text-xs font-bold">VS</span>
                <BracketTeam teamName="Inglaterra" seed={4} />
              </div>
              <div className="flex flex-col md:flex-row items-center p-2 border border-gray-200 rounded-lg w-full md:w-auto gap-2 md:gap-0">
                <BracketTeam teamName="Holanda" seed={2} />
                <span className="px-3 my-2 md:my-1 text-xs font-bold">VS</span>
                <BracketTeam teamName="Fiorentina" seed={3} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-center text-gray-600">
        <p>
          Los ganadores de sus respectivas semifinales estarán a un paso de la
          gloria
          <span className="font-bold">PPT</span>.
        </p>
      </div>
    </Card>
  );
};
