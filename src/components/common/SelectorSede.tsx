import React from "react";
import { useSede } from "../../context/SedeContext";

/**
 * Cambia la ciudad que se está mirando.
 *
 * Es un control de contexto, no un destino de navegación: cambia el significado
 * de todo lo que hay debajo, así que vive junto al escudo y no entre los
 * enlaces. Con una sola sede no se pinta: sería un interruptor de una posición.
 *
 * La ciudad activa se distingue por el fondo y por el texto, no solo por el
 * color de acento, que muchos equipos comparten y no todo el mundo diferencia.
 */
export const SelectorSede: React.FC<{
  className?: string;
  /** La edición en curso solo interesa donde se están mirando datos de ella. */
  mostrarEdicion?: boolean;
}> = ({ className = "", mostrarEdicion = true }) => {
  const { sedes, sedeId, cambiarSede, numeroSede, loading } = useSede();

  if (loading || sedes.length < 2) return null;

  return (
    <div className={className}>
      <div
        role="group"
        aria-label="Ciudad"
        className="flex gap-1 rounded-sm border border-line p-1"
      >
        {sedes.map((s) => {
          const activa = s.id === sedeId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => cambiarSede(s.id)}
              aria-pressed={activa}
              className={`font-cond flex-1 cursor-pointer rounded-[0.1875rem] px-2 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                activa ? "bg-raised text-chalk" : "text-chalk-3 hover:text-chalk-2"
              }`}
              style={
                activa && s.color_hex
                  ? { boxShadow: `inset 0 -2px 0 ${s.color_hex}` }
                  : undefined
              }
            >
              {s.nombre}
            </button>
          );
        })}
      </div>

      {mostrarEdicion && (
        <p className="font-cond mt-1.5 text-[0.625rem] text-chalk-3">
          {numeroSede != null ? `Edición ${numeroSede} en juego` : "Sin edición en curso"}
        </p>
      )}
    </div>
  );
};
