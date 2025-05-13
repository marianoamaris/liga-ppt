import React from "react";
import { GiSoccerKick, GiWhistle } from "react-icons/gi";
import { FaRankingStar } from "react-icons/fa6";
import { Card } from "../common/Card";

export const Info: React.FC = () => (
  <div className="space-y-6">
    <Card className="flex items-center gap-4 text-white bg-gray-800">
      <GiSoccerKick size={36} className="text-gray-300" />
      <div>
        <h2 className="text-xl font-semibold">Bienvenido a la Liga PPT</h2>
        <p className="text-gray-200">
          Esta aplicación te permite seguir el progreso, historia y
          clasificación de la Liga PPT.
        </p>
      </div>
    </Card>
    <Card className="text-gray-900 bg-white">
      <h3 className="flex items-center mb-2 text-lg font-semibold">
        <FaRankingStar className="mr-2" />
        ¿Qué puedes hacer aquí?
      </h3>
      <ul className="pl-6 space-y-1 list-disc">
        <li>Ver el avance de la liga y los fixtures de los partidos.</li>
        <li>
          Consultar la tabla de clasificación y el rendimiento de los equipos.
        </li>
        <li>Explorar la historia y datos destacados de la liga.</li>
      </ul>
    </Card>
    <Card className="text-gray-900 bg-white">
      <h3 className="flex items-center mb-2 text-lg font-semibold">
        <GiWhistle className="mr-2" />
        ¿Cómo navegar?
      </h3>
      <ul className="pl-6 space-y-1 list-disc">
        <li>Usa el menú lateral para acceder a cada sección.</li>
        <li>
          Haz clic en "Tabla de clasificación" para ver los brackets y el
          progreso de la liga.
        </li>
        <li>Haz clic en "Historia" para conocer más sobre la Liga PPT.</li>
      </ul>
    </Card>
  </div>
);
