import { useState } from "react";
import { USUARIOS_LIGA } from "../../constants/USUARIOS_LIGA";

const TODOS = USUARIOS_LIGA.map((u) => u.name).sort((a, b) =>
  a.localeCompare(b, "es")
);

interface Props {
  seleccionados: string[];
  onAgregar: (nombre: string) => void;
  onQuitar: (nombre: string) => void;
}

export function JugadorCombobox({ seleccionados, onAgregar, onQuitar }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = TODOS.filter(
    (n) =>
      !seleccionados.includes(n) &&
      n.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Buscar jugador..."
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
        />
        {open && filtered.length > 0 && (
          <div className="absolute z-20 w-full bg-gray-700 border border-gray-600 rounded-lg mt-1 shadow-2xl max-h-48 overflow-y-auto">
            {filtered.map((name) => (
              <button
                key={name}
                type="button"
                onMouseDown={() => {
                  onAgregar(name);
                  setQuery("");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3.5 text-sm text-white hover:bg-gray-600 active:bg-gray-500 transition-colors min-h-[48px]"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {seleccionados.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {seleccionados.map((name) => (
            <span
              key={name}
              className="flex items-center gap-0.5 bg-gray-700 text-white text-sm rounded-xl pl-3 pr-1 py-1.5"
            >
              {name}
              <button
                type="button"
                onClick={() => onQuitar(name)}
                className="min-w-[32px] min-h-[32px] flex items-center justify-center text-gray-400 hover:text-red-400 active:text-red-500 text-xl leading-none rounded-lg hover:bg-gray-600 transition-colors ml-1"
                aria-label={`Quitar ${name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
