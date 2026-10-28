import { Link, useNavigate, useParams } from "react-router-dom";
import { useSede } from "../context/SedeContext";
import { useConsulta } from "../lib/cache";
import { consultas } from "../lib/consultas";
import { fotoJugadorPorArchivo } from "../utils/fotosJugadores";
import { etiquetaEdicion } from "../utils/ediciones";
import type { DorsalesEdicion } from "../types/analisis";

/**
 * Quiénes llevan cada número del peto y cómo les va.
 *
 * Hay un 10 por equipo, así que cada número junta a un jugador de cada uno: es
 * la comparación que la liga quería poder hacer. Los dorsales existen desde la
 * edición 21; los arqueros no llevan número.
 *
 * `/dorsales` abre la edición en juego de la sede con el 10; desde un perfil se
 * llega a `/dorsales/:edicion/:numero`.
 */

const NUMERO_POR_DEFECTO = 10;

export function DorsalesPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { sedes, edicionActual } = useSede();
  const edicion = params.edicion ? Number(params.edicion) : edicionActual;

  const { datos, loading, error } = useConsulta<DorsalesEdicion>(
    edicion == null ? null : consultas.dorsales(edicion)
  );

  const numeros = datos?.dorsales.map((d) => d.dorsal) ?? [];
  const pedido = params.numero ? Number(params.numero) : NUMERO_POR_DEFECTO;
  const numero = numeros.includes(pedido) ? pedido : (numeros[numeros.length - 1] ?? pedido);
  const grupo = datos?.dorsales.find((d) => d.dorsal === numero);

  const titulo =
    datos?.numero_sede != null
      ? etiquetaEdicion({ numero_sede: datos.numero_sede, sede_id: datos.sede_id }, sedes)
      : null;

  return (
    <div className="min-h-full bg-ink text-chalk">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
        <header className="flex flex-col gap-1">
          <h1 className="font-cond text-xl text-chalk sm:text-2xl">Dorsales</h1>
          <p className="text-sm text-chalk-2">
            Quién lleva cada número en cada equipo, ordenados por goles.
            {titulo && <span className="text-chalk-3"> · {titulo}</span>}
          </p>
        </header>

        {edicion == null ? (
          <p className="text-sm text-chalk-3">Esta ciudad no tiene una edición en juego.</p>
        ) : error ? (
          <p className="rounded-md bg-vivo/15 px-4 py-3 text-sm text-chalk-2">
            No se pudieron cargar los dorsales: {error}
          </p>
        ) : loading ? (
          <p className="font-cond text-sm text-chalk-3">Cargando…</p>
        ) : !numeros.length ? (
          <p className="text-sm text-chalk-3">
            Esta edición no tiene dorsales registrados. Se llevan desde la edición 21.
          </p>
        ) : (
          <>
            <nav aria-label="Número del peto" className="flex flex-wrap gap-1.5">
              {numeros.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => navigate(`/dorsales/${edicion}/${n}`, { replace: true })}
                  aria-pressed={n === numero}
                  className={`font-data tnum size-11 rounded-sm text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                    n === numero ? "bg-chalk text-ink" : "bg-surface text-chalk-2 hover:bg-raised hover:text-chalk"
                  }`}
                >
                  {n}
                </button>
              ))}
            </nav>

            {grupo && (
              <section className="rounded-md border border-line bg-surface">
                <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
                  <h2 className="font-cond text-xs text-chalk-2">Los que llevan el {numero}</h2>
                  <span className="font-cond text-[0.6875rem] text-chalk-3">Goles · PJ</span>
                </div>
                <ol>
                  {grupo.jugadores.map((j, i) => {
                    const foto = fotoJugadorPorArchivo(j.foto_archivo);
                    // El backend ya los manda desempatados: el puesto es la fila.
                    const puesto = i + 1;
                    const nombre = (
                      <span className="block truncate text-sm text-chalk">
                        {j.nombre}
                        {j.es_capitan && <span className="text-chalk-3"> (C)</span>}
                      </span>
                    );
                    return (
                      <li
                        key={`${j.equipo.slug}-${i}`}
                        className="flex items-center gap-3 border-t border-line px-4 py-2.5 first:border-t-0"
                      >
                        <span className="tnum font-data w-5 shrink-0 text-right text-sm text-chalk-3">{puesto}</span>
                        <span className="size-10 shrink-0 overflow-hidden rounded-sm bg-raised">
                          {foto ? (
                            <img src={foto} alt="" className="size-full object-cover object-top" />
                          ) : (
                            <span className="font-cond grid size-full place-items-center text-sm text-chalk-3">
                              {j.nombre.charAt(0)}
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          {j.slug ? (
                            <Link to={`/jugador/${j.slug}`} className="hover:underline">
                              {nombre}
                            </Link>
                          ) : (
                            nombre
                          )}
                          <span className="flex items-center gap-1.5 text-[0.6875rem] text-chalk-3">
                            <span
                              className="size-2 shrink-0 rounded-full ring-1 ring-chalk-3"
                              style={{ backgroundColor: j.equipo.color_hex ?? "#4B5563" }}
                            />
                            <span className="truncate">{j.equipo.nombre}</span>
                            {j.puesto_equipo != null && (
                              <span className="shrink-0">· {j.puesto_equipo}º en la tabla</span>
                            )}
                          </span>
                        </span>
                        <span className="tnum font-data shrink-0 text-right">
                          <span className="block text-base font-bold text-chalk">{j.goles}</span>
                          <span className="block text-[0.625rem] text-chalk-3">{j.partidos} PJ</span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <p className="border-t border-line px-4 py-2.5 text-[0.6875rem] text-chalk-3">
                  A igualdad de goles va delante quien jugó menos partidos, después el de mejor
                  equipo en la tabla y después el de menos amarillas.
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
