import React from "react";
import { useNavigate } from "react-router-dom";

const EnVivoDestacado: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full max-w-5xl mb-6 overflow-hidden rounded-2xl cursor-pointer group"
      onClick={() => navigate("/en-vivo")}
    >
      {/* Fondo oscuro con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950" />

      {/* Borde verde sutil */}
      <div className="absolute inset-0 rounded-2xl border border-green-500/20 group-hover:border-green-500/40 transition-colors" />

      <div className="relative flex items-center gap-4 px-5 py-4 sm:gap-6 sm:px-7 sm:py-5">
        {/* Icono / indicador */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <span className="text-2xl sm:text-3xl">📡</span>
        </div>

        {/* Texto */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-green-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Nuevo
            </span>
            <span className="text-white font-black text-base sm:text-lg leading-tight">
              Liga PPT ahora es En Vivo
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm leading-snug">
            Sigue los partidos en tiempo real — marcador, clasificación, goleadores y
            mejor arquero. Actualización automática. Sin registro.
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-400 transition-colors text-white text-xs sm:text-sm font-bold px-3 py-2 rounded-xl whitespace-nowrap">
            Ver ahora →
          </span>
        </div>
      </div>
    </div>
  );
};

export default EnVivoDestacado;
