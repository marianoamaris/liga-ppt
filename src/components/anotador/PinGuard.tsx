import { useState } from "react";
import { ANOTADOR_PIN } from "../../constants/ANOTADOR_CONFIG";

interface Props {
  onSuccess: () => void;
}

export function PinGuard({ onSuccess }: Props) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ANOTADOR_PIN) {
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-xs shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-white text-2xl font-bold">Zona Anotadores</h1>
          <p className="text-gray-400 text-sm mt-1">Ingresa el PIN de acceso</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={pin}
            autoFocus
            onChange={(e) => {
              setError(false);
              setPin(e.target.value.replace(/\D/g, ""));
            }}
            className="w-full bg-gray-800 text-white text-center text-2xl tracking-widest rounded-xl px-4 py-4 border-2 border-gray-700 focus:border-green-500 focus:outline-none"
            placeholder="••••"
          />
          {error && (
            <p className="text-red-400 text-sm text-center">PIN incorrecto</p>
          )}
          <button
            type="submit"
            disabled={pin.length < 4}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
