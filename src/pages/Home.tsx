import React from "react";
import { Card } from "../components/common/Card";

export const Home: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <Card className="bg-white text-gray-900 p-8 shadow-lg text-center">
      <h1 className="text-3xl font-bold mb-4">Bienvenido a la Liga PPT</h1>
      <p className="text-lg text-gray-700 mb-2">
        Sigue el progreso, historia y clasificación de la liga de fútbol más
        emocionante.
      </p>
      <p className="text-gray-500">
        Usa el menú lateral para navegar por la información, la tabla de
        clasificación y la historia de la liga.
      </p>
    </Card>
  </div>
);
