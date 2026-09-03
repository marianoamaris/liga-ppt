import { useEffect, useState } from "react";
import { statsApi, type Standing } from "../../lib/api";
import { useSede } from "../../context/SedeContext";
import { getColor, makeId } from "./utils";
import { estadoTanda, TIROS_TANDA } from "./tandaPenales";
import type { EquipoEnCancha, EventoDefinicion, ModoPartido, TiroPenal } from "./types";

/**
 * Desempate de un playoff que acabó igualado.
 *
 * En cuartos gana el que venía mejor en la tabla general, así que aquí solo se
 * confirma: la posición se consulta a la API en vez de dejarla a la memoria del
 * anotador.
 *
 * En semifinal y final se cobra penal por penal, eligiendo al ejecutor de la
 * plantilla y marcando si convirtió o falló. El turno, el cierre anticipado y
 * la muerte súbita los decide `tandaPenales`; aquí solo se pinta y no se deja
 * confirmar hasta que la tanda tenga ganador de verdad.
 */

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

/** Los cobros de un equipo, en orden: convertido lleno, fallado hueco. */
function Marcas({ tiros, color }: { tiros: TiroPenal[]; color: string }) {
  if (!tiros.length) {
    return <span className="text-gray-700 text-xs">sin cobrar</span>;
  }
  return (
    <span className="flex gap-1">
      {tiros.map((t) => (
        <span
          key={t.id}
          title={`${t.jugador} · ${t.convertido ? "convertido" : "fallado"}`}
          className="size-3 rounded-full border-2"
          style={{
            borderColor: color,
            backgroundColor: t.convertido ? color : "transparent",
          }}
        />
      ))}
    </span>
  );
}

function PorPenales({ equipos, tiempoEnMarcador, onDefinir }: Omit<Props, "modo">) {
  const [eqA, eqB] = equipos;
  const [tiros, setTiros] = useState<TiroPenal[]>([]);

  const estado = estadoTanda(tiros, eqA.equipo.id);
  const equipoDelTurno = estado.turno === "A" ? eqA : estado.turno === "B" ? eqB : null;
  const ganador = estado.ganador === "A" ? eqA : estado.ganador === "B" ? eqB : null;

  function cobrar(jugador: string, convertido: boolean) {
    if (!equipoDelTurno) return;
    setTiros((prev) => [
      ...prev,
      { id: makeId(), equipoId: equipoDelTurno.equipo.id, jugador, convertido },
    ]);
  }

  function confirmar() {
    if (!ganador) return;
    onDefinir({
      id: makeId(),
      metodo: "penales",
      ganadorId: ganador.equipo.id,
      penales: {
        equipoAId: eqA.equipo.id,
        golesA: estado.golesA,
        equipoBId: eqB.equipo.id,
        golesB: estado.golesB,
        tiros,
      },
      tiempoEnMarcador,
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-gray-400 text-sm">
        Empate al final del tiempo. Penales al mejor de {TIROS_TANDA}
        {estado.muerteSubita && !estado.decidida ? " · muerte súbita" : ""}.
      </p>

      {/* Pizarra de la tanda */}
      <div className="bg-gray-800/60 rounded-2xl p-3 space-y-2">
        {([eqA, eqB] as const).map((eq) => {
          const color = getColor(eq.equipo.id);
          const suyos = tiros.filter((t) => t.equipoId === eq.equipo.id);
          const goles = eq === eqA ? estado.golesA : estado.golesB;
          return (
            <div key={eq.equipo.id} className="flex items-center gap-3">
              <span
                className="text-sm font-bold truncate flex-1 min-w-0"
                style={{ color }}
              >
                {eq.equipo.nombre}
              </span>
              <Marcas tiros={suyos} color={color} />
              <span className="text-white text-xl font-black tabular-nums w-5 text-right">
                {goles}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quién cobra ahora */}
      {equipoDelTurno && (
        <div className="space-y-2">
          <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
            {estado.muerteSubita
              ? "Muerte súbita · cobra"
              : `Tiro ${estado.numeroDelTurno} de ${TIROS_TANDA} · cobra`}{" "}
            <span style={{ color: getColor(equipoDelTurno.equipo.id) }}>
              {equipoDelTurno.equipo.nombre}
            </span>
          </p>

          {equipoDelTurno.jugadores.map((j) => (
            <div key={j.nombre} className="flex gap-1.5">
              <span className="flex-1 min-h-[44px] px-3 flex items-center bg-gray-800/80 rounded-xl text-white text-sm font-medium">
                {j.nombre}
              </span>
              <button
                onClick={() => cobrar(j.nombre, true)}
                className="min-h-[44px] w-14 shrink-0 bg-green-600/25 hover:bg-green-600/40 active:bg-green-600/60 text-green-300 border border-green-600/40 rounded-xl text-lg transition-colors"
                aria-label={`${j.nombre} convirtió`}
              >
                ⚽
              </button>
              <button
                onClick={() => cobrar(j.nombre, false)}
                className="min-h-[44px] w-14 shrink-0 bg-red-900/20 hover:bg-red-900/35 active:bg-red-900/50 text-red-400 border border-red-900/40 rounded-xl text-lg transition-colors"
                aria-label={`${j.nombre} falló`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {tiros.length > 0 && !estado.decidida && (
        <button
          onClick={() => setTiros((prev) => prev.slice(0, -1))}
          className="w-full min-h-[44px] text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          ↩ Deshacer último penal
        </button>
      )}

      <button
        onClick={confirmar}
        disabled={!ganador}
        className="w-full min-h-[52px] bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold rounded-2xl transition-colors"
      >
        {ganador
          ? `Pasa ${ganador.equipo.nombre} · ${estado.golesA}–${estado.golesB}`
          : "La tanda sigue abierta"}
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
