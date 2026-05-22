import { useState } from "react";
import { getColor } from "./utils";
import type { EquipoEnCancha } from "./types";

interface Props {
  equipoGoleador: EquipoEnCancha;
  equiposContrarios: [EquipoEnCancha, EquipoEnCancha];
  onConfirmar: (
    goleador: string,
    arquero: string,
    equipoArqueroId: string
  ) => void;
  onCancelar: () => void;
}

export function RegistrarGolModal({
  equipoGoleador,
  equiposContrarios,
  onConfirmar,
  onCancelar,
}: Props) {
  const [goleador, setGoleador] = useState("");
  const [equipoContrarioId, setEquipoContrarioId] = useState("");
  const [arquero, setArquero] = useState("");

  const equipoContrario = equiposContrarios.find(
    (e) => e.equipo.id === equipoContrarioId
  );

  function handleEquipoContrarioChange(id: string) {
    setEquipoContrarioId(id);
    const eq = equiposContrarios.find((e) => e.equipo.id === id);
    setArquero(eq?.arqueroDesignado ?? "");
  }

  const canConfirm = goleador && equipoContrarioId && arquero;
  const colorGol = getColor(equipoGoleador.equipo.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75"
      onClick={onCancelar}
    >
      <div
        className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <span className="text-4xl">⚽</span>
          <h2 className="text-white text-xl font-bold mt-1">Anotar Gol</h2>
          <p className="text-sm font-semibold mt-0.5" style={{ color: colorGol }}>
            {equipoGoleador.equipo.nombre}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">
              ¿Quién anotó?
            </label>
            <select
              value={goleador}
              onChange={(e) => setGoleador(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              autoFocus
            >
              <option value="">— Seleccionar goleador —</option>
              {equipoGoleador.jugadores.map((j) => (
                <option key={j.nombre} value={j.nombre}>
                  {j.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">
              ¿A qué equipo le metieron?
            </label>
            <select
              value={equipoContrarioId}
              onChange={(e) => handleEquipoContrarioChange(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">— Seleccionar equipo —</option>
              {equiposContrarios.map((e) => (
                <option key={e.equipo.id} value={e.equipo.id}>
                  {e.equipo.nombre}
                </option>
              ))}
            </select>
          </div>

          {equipoContrario && (
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1.5">
                ¿Quién atajó (arquero)?
              </label>
              <select
                value={arquero}
                onChange={(e) => setArquero(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">— Seleccionar arquero —</option>
                {equipoContrario.jugadores.map((j) => (
                  <option key={j.nombre} value={j.nombre}>
                    {j.nombre}
                    {j.nombre === equipoContrario.arqueroDesignado
                      ? " 🧤"
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancelar}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3.5 rounded-xl font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() =>
              canConfirm && onConfirmar(goleador, arquero, equipoContrarioId)
            }
            disabled={!canConfirm}
            className="flex-1 bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3.5 rounded-xl font-bold transition-colors"
          >
            ✓ Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
