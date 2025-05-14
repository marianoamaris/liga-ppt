import React from "react";
import { Card } from "../components/common/Card";
import { FaMedal } from "react-icons/fa6";

export const LogrosPage: React.FC = () => (
  <div className="space-y-6">
    <Card className="flex items-center gap-4 text-white bg-blue-800">
      <FaMedal size={36} className="text-yellow-400" />
      <div>
        <h2 className="text-xl font-semibold">Logros personales</h2>
        <p className="text-gray-200">
          Aquí podrás ver los logros individuales y una tarjeta para cada
          jugador.
        </p>
      </div>
    </Card>
    <Card className="text-gray-900 bg-white">
      <h3 className="mb-2 text-lg font-semibold">Próximamente</h3>
      <p className="text-gray-600">
        En esta sección se mostrarán los logros y estadísticas personales de
        cada jugador.
      </p>
    </Card>
  </div>
);
