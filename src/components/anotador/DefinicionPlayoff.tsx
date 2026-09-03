import { useEffect, useState } from "react";
import { statsApi, type Standing } from "../../lib/api";
import { useSede } from "../../context/SedeContext";
import { getColor, makeId } from "./utils";
import type { EquipoEnCancha, EventoDefinicion, ModoPartido } from "./types";

/**
 * Desempate de un playoff que acabó igualado.
 *
 * En cuartos gana el que venía mejor en la tabla general, así que aquí solo se
 * confirma: la posición se consulta a la API en vez de dejarla a la memoria del
 * anotador. En semifinal y final se van a penales al mejor de tres y, si siguen
 * iguales, a muerte súbita; el panel cuenta los convertidos y no deja cerrar
 * mientras el marcador de penales siga empatado.
 */

const PENALES_TANDA = 3;

interface Props {
  modo: Exclude<ModoPartido, "jornada">;
  equipos: [EquipoEnCancha, EquipoEnCancha];
  tiempoEnMarcador: number;
  onDefinir: (data: EventoDefinicion) => void;
}

function Equipo({ eq, children }: { eq: EquipoEnCancha; children?: React.ReactNode }) {
  return (
    <span className="font-bold" style={{ color: getColor(eq.equipo.id) }}>
      {eq.equipo.nombre}
      {children}
    </span>
  );
}

function PorTabla({ equipos, tiempoEnMarcador, onDefinir }: Omit<Props, "modo">) {
  const { edicionActual } = useSede();
  const [standings, setStandings] = useState<Standing[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (edicionActual == null) return;
    let vigente = true;
    statsApi
      .clasificacion(edicionActual)
      .then(({ standings }) => vigente && setStandings(standings))
      .catch(() => vigente && setError(true));
    return () => {
      vigente = false;
    };
  }, [edicionActual]);

  const posicionDe = (id: string) => {
    const i = standings?.findIndex((s) => s.equipoId === id) ?? -1;
    return i === -1 ? null : i + 1;
  };

  const [eqA, eqB] = equipos;
  const posA = posicionDe(eqA.equipo.id);
  const posB = posicionDe(eqB.equipo.id);
  const mejor =
    posA != null && posB != null ? (posA < posB ? eqA : eqB) : null;

  function confirmar(ganador: EquipoEnCancha) {
    onDefinir({
      id: makeId(),
      metodo: "tabla",
      ganadorId: ganador.equipo.id,
      tiempoEnMarcador,
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm">
        Empate al final del tiempo. Pasa el equipo mejor ubicado en la tabla general.
      </p>

      {mejor ? (
        <>
          <div className="flex items-center justify-center gap-4 py-1 text-sm">
            <span className="text-gray-500">
              <Equipo eq={eqA} /> <span className="tabular-nums">#{posA}</span>
            </span>
            <span className="text-gray-700">·</span>
            <span className="text-gray-500">
              <Equipo eq={eqB} /> <span className="tabular-nums">#{posB}</span>
            </span>
          </div>
          <button
            onClick={() => confirmar(mejor)}
            className="w-full min-h-[52px] bg-green-600 hover:bg-green-500 active:bg-green-700 text-white font-bold rounded-2xl transition-colors"
          >
            Pasa {mejor.equipo.nombre}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-yellow-500">
            {error || standings
              ? "No se pudo leer la tabla. Elige a mano el equipo mejor ubicado."
              : "Consultando la tabla general…"}
          </p>
          {(error || standings) && (
            <div className="grid grid-cols-2 gap-2">
              {equipos.map((eq) => (
                <button
                  key={eq.equipo.id}
                  onClick={() => confirmar(eq)}
                  className="min-h-[52px] bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white font-bold rounded-2xl transition-colors px-2"
                >
                  Pasa {eq.equipo.nombre}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PorPenales({ equipos, tiempoEnMarcador, onDefinir }: Omit<Props, "modo">) {
  const [eqA, eqB] = equipos;
  const [golesA, setGolesA] = useState(0);
  const [golesB, setGolesB] = useState(0);

  const tanda = Math.max(golesA, golesB) > PENALES_TANDA;
  const hayGanador = golesA !== golesB;
  const ganador = golesA > golesB ? eqA : eqB;

  function confirmar() {
    if (!hayGanador) return;
    onDefinir({
      id: makeId(),
      metodo: "penales",
      ganadorId: ganador.equipo.id,
      penales: {
        equipoAId: eqA.equipo.id,
        golesA,
        equipoBId: eqB.equipo.id,
        golesB,
      },
      tiempoEnMarcador,
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm">
        Empate al final del tiempo. Penales al mejor de {PENALES_TANDA}
        {tanda ? " · muerte súbita" : ""}.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {([[eqA, golesA, setGolesA], [eqB, golesB, setGolesB]] as const).map(
          ([eq, goles, setGoles]) => (
            <div
              key={eq.equipo.id}
              className="bg-gray-800/80 rounded-2xl p-3 text-center space-y-2"
              style={{ border: `1px solid ${getColor(eq.equipo.id)}40` }}
            >
              <div
                className="text-sm font-bold truncate"
                style={{ color: getColor(eq.equipo.id) }}
              >
                {eq.equipo.nombre}
              </div>
              <div className="text-white text-4xl font-black tabular-nums leading-none">
                {goles}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setGoles((g) => Math.max(0, g - 1))}
                  className="flex-1 min-h-[44px] bg-gray-900 hover:bg-gray-700 active:bg-gray-600 text-gray-400 rounded-xl text-lg font-bold transition-colors"
                  aria-label={`Quitar penal a ${eq.equipo.nombre}`}
                >
                  −
                </button>
                <button
                  onClick={() => setGoles((g) => g + 1)}
                  className="flex-1 min-h-[44px] bg-green-600/25 hover:bg-green-600/40 active:bg-green-600/60 text-green-300 border border-green-600/40 rounded-xl text-lg font-bold transition-colors"
                  aria-label={`Anotar penal de ${eq.equipo.nombre}`}
                >
                  +
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <button
        onClick={confirmar}
        disabled={!hayGanador}
        className="w-full min-h-[52px] bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-2xl transition-colors"
      >
        {hayGanador
          ? `Pasa ${ganador.equipo.nombre} · ${golesA}–${golesB}`
          : "Van iguales en penales"}
      </button>
    </div>
  );
}

export function DefinicionPlayoff({ modo, equipos, tiempoEnMarcador, onDefinir }: Props) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-3 border border-yellow-700/40">
      <h2 className="text-white font-bold flex items-center gap-2">
        ⚖️ Definir la llave
      </h2>
      {modo === "cuartos" ? (
        <PorTabla
          equipos={equipos}
          tiempoEnMarcador={tiempoEnMarcador}
          onDefinir={onDefinir}
        />
      ) : (
        <PorPenales
          equipos={equipos}
          tiempoEnMarcador={tiempoEnMarcador}
          onDefinir={onDefinir}
        />
      )}
    </div>
  );
}
