import type { ReactNode } from "react";

interface Props {
  icono: string;
  titulo: string;
  /** Lo que se va a registrar, dicho como se ve en la cancha. */
  children: ReactNode;
  textoConfirmar: string;
  /** Clases del botón de confirmar: cada evento lleva su color. */
  claseConfirmar: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

/**
 * Segundo paso antes de registrar un evento.
 *
 * Un toque de más sobre el nombre de un jugador era un gol en el marcador, y
 * en jornada además reinicia el reloj y rota los equipos: deshacerlo a mitad
 * de partido es justo lo que hace que el anotador se pierda. Con esto el
 * evento no existe hasta que se confirma.
 */
export function ConfirmarModal({
  icono,
  titulo,
  children,
  textoConfirmar,
  claseConfirmar,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75"
      onClick={onCancelar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="bg-gray-900 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-4xl mb-1">{icono}</div>
          <h2 className="text-white text-lg font-bold">{titulo}</h2>
          <div className="mt-1">{children}</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 min-h-[52px] bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className={`flex-1 min-h-[52px] text-white rounded-xl font-bold transition-colors ${claseConfirmar}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
