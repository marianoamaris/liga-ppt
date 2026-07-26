import React from "react";
import { FaStar } from "react-icons/fa6";
import type { Jugador } from "../../types/jugador";
import { fotoJugadorPorArchivo } from "../../utils/fotosJugadores";

const ETIQUETA_POSICION: Record<Jugador["posicion"], string> = {
  arquero: "Arquero",
  defensa: "Defensa",
  mediocampista: "Mediocampista",
  delantero: "Delantero",
};

function Cifra({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="min-w-0">
      <div className="tnum font-data text-lg leading-none font-bold text-chalk">
        {valor}
      </div>
      <div className="font-cond mt-1 truncate text-[0.625rem] text-chalk-3">
        {etiqueta}
      </div>
    </div>
  );
}

/**
 * Ficha de jugador.
 *
 * Los títulos se muestran como estrellas, igual que en el escudo de la liga,
 * y solo cuando hay alguno: una fila de estrellas vacías no dice nada.
 */
export const UserCard: React.FC<{ jugador: Jugador }> = ({ jugador }) => {
  const foto = fotoJugadorPorArchivo(jugador.foto_archivo);

  return (
    <article className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4">
      <div className="flex items-start gap-3">
        <div className="size-16 shrink-0 overflow-hidden rounded-sm bg-raised">
          {foto ? (
            <img
              src={foto}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover object-top"
            />
          ) : (
            <span className="font-cond grid size-full place-items-center text-lg text-chalk-3">
              {jugador.nombre.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-cond truncate text-base text-chalk">{jugador.nombre}</h3>
          {jugador.apodo && (
            <p className="truncate text-[0.6875rem] text-chalk-2">«{jugador.apodo}»</p>
          )}
          <p className="font-cond mt-1 text-[0.625rem] text-chalk-3">
            {ETIQUETA_POSICION[jugador.posicion]}
          </p>

          {jugador.ligas_ganadas > 0 && (
            <div
              className="mt-1.5 flex flex-wrap gap-0.5"
              title={`${jugador.ligas_ganadas} ${jugador.ligas_ganadas === 1 ? "título" : "títulos"}`}
            >
              {Array.from({ length: jugador.ligas_ganadas }).map((_, i) => (
                <FaStar key={i} aria-hidden className="size-2.5 text-chalk-2" />
              ))}
              <span className="sr-only">
                {jugador.ligas_ganadas}{" "}
                {jugador.ligas_ganadas === 1 ? "título" : "títulos"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-line pt-3">
        <Cifra valor={jugador.ligas_jugadas} etiqueta="Ediciones" />
        <Cifra valor={jugador.ligas_ganadas} etiqueta="Títulos" />
        <Cifra valor={jugador.goles_historicos} etiqueta="Goles" />
      </div>

      {(jugador.es_fundador || jugador.es_admin) && (
        <div className="flex flex-wrap gap-1.5">
          {jugador.es_fundador && (
            <span className="font-cond rounded-sm border border-line px-1.5 py-0.5 text-[0.625rem] text-chalk-2">
              Fundador
            </span>
          )}
          {jugador.es_admin && (
            <span className="font-cond rounded-sm bg-raised px-1.5 py-0.5 text-[0.625rem] text-chalk-2">
              Admin
            </span>
          )}
        </div>
      )}
    </article>
  );
};
