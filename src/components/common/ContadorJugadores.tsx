import React, { useEffect, useState } from "react";
import { FaPencil, FaCheck, FaXmark } from "react-icons/fa6";
import { CUPOS_LIGA } from "../../constants/ACTUALIZACION_DATOS_JUGADOR";

const API_BASE = import.meta.env.VITE_API_URL as string;
const TEMPORADA = 19;

/** Muestra el botón de edición solo si VITE_ADMIN_CONTADOR=true en .env.local */
const ADMIN_EDITABLE = import.meta.env.VITE_ADMIN_CONTADOR === "true";

const ContadorJugadores: React.FC = () => {
  const [activos, setActivos] = useState<number>(CUPOS_LIGA.activos);
  const [total, setTotal] = useState<number>(CUPOS_LIGA.total);
  const [loading, setLoading] = useState(true);

  const [editando, setEditando] = useState(false);
  const [draftActivos, setDraftActivos] = useState(0);
  const [draftTotal, setDraftTotal] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/config?temporada=${TEMPORADA}`)
      .then((r) => r.json())
      .then((data) => {
        setActivos(data.jugadores_activos ?? CUPOS_LIGA.activos);
        setTotal(data.jugadores_total ?? CUPOS_LIGA.total);
      })
      .catch(() => {
        /* fallback a constantes ya cargadas */
      })
      .finally(() => setLoading(false));
  }, []);

  const abrirEdicion = () => {
    setDraftActivos(activos);
    setDraftTotal(total);
    setErrorGuardar(null);
    setEditando(true);
  };

  const cancelar = () => {
    setEditando(false);
    setErrorGuardar(null);
  };

  const guardar = async () => {
    setGuardando(true);
    setErrorGuardar(null);
    try {
      const res = await fetch(`${API_BASE}/config`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temporada: TEMPORADA,
          jugadores_activos: draftActivos,
          jugadores_total: draftTotal,
        }),
      });
      if (!res.ok) throw new Error("http");
      setActivos(draftActivos);
      setTotal(draftTotal);
      setEditando(false);
    } catch {
      setErrorGuardar("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  };

  const llena = activos >= total;
  const pct = total > 0 ? Math.min((activos / total) * 100, 100) : 100;

  if (editando) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-blue-800">Jugadores activos:</span>
          <input
            type="number"
            min={0}
            max={999}
            value={draftActivos}
            onChange={(e) => setDraftActivos(Number(e.target.value))}
            className="w-16 rounded border border-blue-300 px-2 py-0.5 text-sm font-bold text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-xs font-semibold text-blue-800">Total:</span>
          <input
            type="number"
            min={1}
            max={999}
            value={draftTotal}
            onChange={(e) => setDraftTotal(Number(e.target.value))}
            className="w-16 rounded border border-blue-300 px-2 py-0.5 text-sm font-bold text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={guardar}
            disabled={guardando}
            title="Guardar"
            className="flex items-center gap-1 rounded bg-blue-600 px-2 py-1 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <FaCheck size={10} />
            {guardando ? "Guardando…" : "Guardar"}
          </button>
          <button
            onClick={cancelar}
            disabled={guardando}
            title="Cancelar"
            className="flex items-center gap-1 rounded border border-blue-300 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            <FaXmark size={10} />
            Cancelar
          </button>
        </div>
        {errorGuardar && (
          <p className="text-xs text-red-600">{errorGuardar}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 ${
        llena ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
      }`}
    >
      <span
        className={`text-base font-black tabular-nums ${
          llena ? "text-red-700" : "text-green-700"
        }`}
      >
        {loading ? "…" : activos}/{loading ? "…" : total}
      </span>
      <div className={`h-4 w-px ${llena ? "bg-red-200" : "bg-green-200"}`} />
      <span
        className={`text-xs font-semibold ${
          llena ? "text-red-700" : "text-green-700"
        }`}
      >
        {llena ? "Liga completa · sin cupos" : "Cupos disponibles"}
      </span>
      <div className={`h-1.5 w-16 overflow-hidden rounded-full ${llena ? "bg-red-200" : "bg-green-200"}`}>
        <div
          className={`h-1.5 rounded-full transition-all ${llena ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {ADMIN_EDITABLE && (
        <button
          onClick={abrirEdicion}
          title="Editar contador (solo admin)"
          className="ml-1 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <FaPencil size={11} />
        </button>
      )}
    </div>
  );
};

export default ContadorJugadores;
