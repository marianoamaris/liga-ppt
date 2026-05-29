import type { RazonAmarilla } from "./types";
import { getColor } from "./utils";

interface Props {
  jugador: string;
  equipoId: string;
  equipoNombre: string;
  onConfirmar: (razon: RazonAmarilla) => void;
  onCancelar: () => void;
}

const RAZONES: { key: RazonAmarilla; label: string; icon: string }[] = [
  { key: "halar-peto",      label: "Halar peto",              icon: "👕" },
  { key: "falta-temeraria", label: "Falta temeraria",         icon: "⚡" },
  { key: "falta-tactica",   label: "Falta táctica o normal",  icon: "🎯" },
  { key: "llegada-tarde",   label: "Llegada tarde",           icon: "⏰" },
  { key: "falta-respeto",   label: "Falta de respeto",        icon: "😤" },
];

export function AmarillaModal({
  jugador,
  equipoId,
  equipoNombre,
  onConfirmar,
  onCancelar,
}: Props) {
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
          <div className="text-4xl mb-1">🟨</div>
          <h2 className="text-white text-lg font-bold">Tarjeta Amarilla</h2>
          <p className="text-sm font-semibold mt-0.5" style={{ color }}>
            {jugador}
          </p>
          <p className="text-gray-500 text-xs">{equipoNombre}</p>
        </div>

        <p className="text-gray-500 text-[11px] uppercase tracking-wider text-center">
          Motivo
        </p>

        <div className="space-y-2">
          {RAZONES.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onConfirmar(key)}
              className="w-full py-3.5 px-4 bg-yellow-600/20 hover:bg-yellow-600/35 active:bg-yellow-600/50 border border-yellow-600/30 text-yellow-300 rounded-xl font-medium text-sm transition-colors flex items-center gap-3"
            >
              <span className="text-xl">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={onCancelar}
          className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
