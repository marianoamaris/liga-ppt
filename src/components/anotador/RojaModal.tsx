import { getColor } from "./utils";

interface Props {
  jugador: string;
  equipoId: string;
  equipoNombre: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function RojaModal({ jugador, equipoId, equipoNombre, onConfirmar, onCancelar }: Props) {
  const color = getColor(equipoId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75"
      onClick={onCancelar}
    >
      <div
        className="bg-gray-900 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-4xl mb-1">🟥</div>
          <h2 className="text-white text-lg font-bold">Tarjeta Roja</h2>
          <p className="text-sm font-semibold mt-0.5" style={{ color }}>
            {jugador}
          </p>
          <p className="text-gray-500 text-xs">{equipoNombre}</p>
        </div>

        <p className="text-center text-sm text-gray-400">
          El jugador será <strong className="text-white">expulsado</strong> del partido.
          Esta acción quedará registrada en el historial.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-xl font-bold transition-colors"
          >
            Expulsar
          </button>
        </div>
      </div>
    </div>
  );
}
