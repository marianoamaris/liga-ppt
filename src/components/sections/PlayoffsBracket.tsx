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
    <div className="flex items-center w-full p-2 bg-gray-100 rounded-lg shadow-sm md:w-48">
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
        Playoffs - Liga PPT #14
      </h2>

      <div className="flex justify-center">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-4">
          {/* CUARTOS DE FINAL */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-sm font-bold text-center text-gray-600 uppercase">
              Cuartos de Final - Domingo 24 de Agosto
            </h3>
            <div className="flex flex-row flex-wrap justify-center gap-4 lg:flex-col">
              <div className="flex flex-col items-center w-full gap-2 p-2 border border-gray-200 rounded-lg md:flex-row md:w-auto md:gap-0">
                <BracketTeam teamName="VfL Wolfsburgo" seed={1} />
                <span className="px-3 my-2 text-xs font-bold md:my-1">VS</span>
                <BracketTeam teamName="Eintracht Frankfurt" seed={8} />
              </div>
              <div className="flex flex-col items-center w-full gap-2 p-2 border border-gray-200 rounded-lg md:flex-row md:w-auto md:gap-0">
                <BracketTeam teamName="Junior" seed={2} />
                <span className="px-3 my-2 text-xs font-bold md:my-1">VS</span>
                <BracketTeam teamName="Equipo Rocket" seed={7} />
              </div>
              <div className="flex flex-col items-center w-full gap-2 p-2 border border-gray-200 rounded-lg md:flex-row md:w-auto md:gap-0">
                <BracketTeam teamName="Brasil" seed={3} />
                <span className="px-3 my-2 text-xs font-bold md:my-1">VS</span>
                <BracketTeam teamName="Fiorentina" seed={6} />
              </div>
              <div className="flex flex-col items-center w-full gap-2 p-2 border border-gray-200 rounded-lg md:flex-row md:w-auto md:gap-0">
                <BracketTeam teamName="Wolverhampton" seed={4} />
                <span className="px-3 my-2 text-xs font-bold md:my-1">VS</span>
                <BracketTeam teamName="River Plate" seed={5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-center text-gray-600">
        <p>
          Los cuartos de final se jugarán el <b>domingo 24 de agosto</b> de{" "}
          <b>7:00 PM a 9:00 PM</b>
        </p>
        <p className="mt-2">
          <b>Semifinales:</b> Jueves 28 de agosto a las 7:00 PM
        </p>
        <p className="mt-1">
          <b>Final:</b> Domingo 31 de agosto a las 7:00 PM
        </p>
        <p className="mt-2">
          ¡Los 8 mejores equipos de la liga se enfrentan por el título!
        </p>
      </div>
    </Card>
  );
};
