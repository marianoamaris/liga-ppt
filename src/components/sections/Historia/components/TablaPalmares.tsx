import React from "react";
import { usePalmares } from "../../../../hooks/useCatalogo";
import { fotoJugadorPorArchivo } from "../../../../utils/fotosJugadores";
import { Puesto } from "../../../common/iconos";
import type { FilaPalmares, TipoPalmares } from "../../../../types/jugador";

interface Props {
  tipo: TipoPalmares;
  titulo: string;
  /** Qué se cuenta: "premios", "goles"… Va junto a la cifra. */
  unidad: string;
  descripcion?: string;
  /** Encabezado de la columna de detalle, cuando ese récord lo trae. */
  columnaDetalle?: string;
}

function Fila({
  fila,
  posicion,
  maximo,
  unidad,
  columnaDetalle,
}: {
  fila: FilaPalmares;
  posicion: number;
  maximo: number;
  unidad: string;
  columnaDetalle?: string;
}) {
  const jugador = fila.jugadores;
  const foto = fotoJugadorPorArchivo(jugador?.foto_archivo ?? null);
  const nombre = jugador?.nombre ?? fila.jugador_nombre;

  return (
    <li className="flex items-center gap-3 border-t border-line py-2.5 first:border-t-0">
      <Puesto n={posicion} />

      <div className="size-8 shrink-0 overflow-hidden rounded-sm bg-raised">
        {foto ? (
          <img src={foto} alt="" loading="lazy" className="size-full object-cover object-top" />
        ) : (
          <span className="font-cond grid size-full place-items-center text-xs text-chalk-3">
            {nombre.charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-cond truncate text-sm text-chalk">{nombre}</div>
        {columnaDetalle && fila.detalle && (
          <div className="tnum font-data truncate text-[0.6875rem] text-chalk-3">
            {columnaDetalle} {fila.detalle}
          </div>
        )}
        {!columnaDetalle && jugador?.apodo && (
          <div className="truncate text-[0.6875rem] text-chalk-3">«{jugador.apodo}»</div>
        )}
      </div>

      {/* Barra proporcional al líder: compara sin tener que leer cada cifra */}
      <span className="hidden h-[3px] w-16 shrink-0 overflow-hidden rounded-full bg-line sm:block">
        <span
          className="block h-full bg-chalk-2"
          style={{ width: maximo ? `${(fila.cantidad / maximo) * 100}%` : "0%" }}
        />
      </span>

      <span className="tnum font-data w-12 shrink-0 text-right text-sm font-bold text-chalk">
        {fila.cantidad}
        <span className="ml-1 text-[0.625rem] font-normal text-chalk-3">{unidad}</span>
      </span>
    </li>
  );
}

/**
 * Ranking de un récord histórico.
 *
 * Bota de oro, guante, MVP de liga, MVP de la final, capitanes campeones y
 * goleadores históricos tienen todos la misma forma —jugador y cantidad—, así
 * que comparten componente en lugar de repetir seis veces la misma tabla.
 */
export const TablaPalmares: React.FC<Props> = ({
  tipo,
  titulo,
  unidad,
  descripcion,
  columnaDetalle,
}) => {
  const { de, loading, error } = usePalmares();
  const filas = de(tipo);
  const maximo = filas[0]?.cantidad ?? 0;

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-cond text-lg text-chalk">{titulo}</h2>
        {descripcion && (
          <p className="mt-1 max-w-prose text-sm text-chalk-3">{descripcion}</p>
        )}
      </div>

      {loading ? (
        <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
          Cargando…
        </p>
      ) : error ? (
        <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
          No se pudo cargar: {error}
        </p>
      ) : !filas.length ? (
        <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
          Todavía no hay registros.
        </p>
      ) : (
        <ul className="rounded-md border border-line bg-surface px-4">
          {filas.map((fila, i) => (
            <Fila
              key={fila.jugador_nombre}
              fila={fila}
              posicion={i + 1}
              maximo={maximo}
              unidad={unidad}
              columnaDetalle={columnaDetalle}
            />
          ))}
        </ul>
      )}
    </section>
  );
};
