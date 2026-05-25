import React, { useState } from "react";
import calendarioImg from "../assets/LIGA_19/CALENDARIO OFICIAL.jpg";

export const CalendarioPage: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="container px-2 py-6 mx-auto md:py-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-center p-6 bg-black shadow-lg rounded-xl">
          <img
            src="/PPT.png"
            alt="Logo Liga PPT"
            className="object-contain w-20 h-20 md:w-24 md:h-24"
          />
        </div>

        {/* Título */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Calendario Oficial
          </h1>
          <p className="mt-1 text-sm text-gray-500">Liga PPT #19 · Edición Mundial</p>
        </div>

        {/* Imagen del calendario */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
          <img
            src={calendarioImg}
            alt="Calendario Oficial Liga PPT 19"
            className={`w-full object-contain transition-all duration-300 cursor-zoom-in ${
              expanded ? "max-h-none cursor-zoom-out" : "max-h-[480px] md:max-h-[640px]"
            }`}
            onClick={() => setExpanded((v) => !v)}
          />
          <div className="px-4 py-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {expanded ? "Toca para reducir" : "Toca para ampliar"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
