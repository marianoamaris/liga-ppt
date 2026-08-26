import React from "react";
import { useTitulos } from "../../../../hooks/useCatalogo";
import { useSede } from "../../../../context/SedeContext";
import { fotoJugadorPorArchivo } from "../../../../utils/fotosJugadores";
import { Puesto } from "../../../common/iconos";

/**
 * Ranking de jugadores por títulos ganados en la ciudad activa. Los récords no
 * se mezclan entre sedes: cada una tiene sus propios más ganadores.
 *
 * A diferencia del resto del palmarés, aquí sí consta en qué ediciones se ganó
 * cada liga, así que se listan: es lo que convierte un número en una historia.
 * La Champions y el Mundial vienen sin año en la fuente y se muestran aparte.
 */
const MasGanadoresComponent: React.FC = () => {
  const { sedeId } = useSede();
  const { titulos, loading, error } = useTitulos(sedeId);

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-cond text-lg text-chalk">Los más ganadores</h2>
        <p className="mt-1 max-w-prose text-sm text-chalk-3">
          Títulos por jugador, con las ediciones en las que los ganó.
        </p>
      </div>

      {loading ? (
        <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
          Cargando…
        </p>
      ) : error ? (
        <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
          No se pudo cargar: {error}
        </p>
      ) : !titulos.length ? (
        <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
          Esta ciudad todavía no tiene títulos repartidos.
        </p>
      ) : (
        <ul className="rounded-md border border-line bg-surface px-4">
          {titulos.map((t, i) => {
            const foto = fotoJugadorPorArchivo(t.jugador?.foto_archivo ?? null);
            const nombre = t.jugador?.nombre ?? t.jugador_nombre;

            return (
              <li
                key={t.jugador_nombre}
                className="flex items-start gap-3 border-t border-line py-2.5 first:border-t-0"
              >
                <Puesto n={i + 1} />

                <div className="size-8 shrink-0 overflow-hidden rounded-sm bg-raised">
                  {foto ? (
                    <img
                      src={foto}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover object-top"
                    />
                  ) : (
                    <span className="font-cond grid size-full place-items-center text-xs text-chalk-3">
                      {nombre.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-cond truncate text-sm text-chalk">{nombre}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {t.ligas.map((ed) => (
                      <span
                        key={ed.numero}
                        className="tnum font-data rounded-sm bg-raised px-1.5 py-0.5 text-[0.625rem] text-chalk-2"
                        title={`Campeón en la edición ${ed.numero_sede}`}
                      >
                        {ed.numero_sede}
                      </span>
                    ))}
                    {t.champions > 0 && (
                      <span className="font-cond rounded-sm border border-line px-1.5 py-0.5 text-[0.625rem] text-chalk-2">
                        {t.champions > 1 ? `${t.champions} Champions` : "Champions"}
                      </span>
                    )}
                    {t.mundial > 0 && (
                      <span className="font-cond rounded-sm border border-line px-1.5 py-0.5 text-[0.625rem] text-chalk-2">
                        {t.mundial > 1 ? `${t.mundial} Mundiales` : "Mundial"}
                      </span>
                    )}
                  </div>
                </div>

                <span className="tnum font-data w-16 shrink-0 text-right text-sm font-bold text-chalk">
                  {t.total}
                  <span className="ml-1 text-[0.625rem] font-normal text-chalk-3">
                    {t.total === 1 ? "título" : "títulos"}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default MasGanadoresComponent;
