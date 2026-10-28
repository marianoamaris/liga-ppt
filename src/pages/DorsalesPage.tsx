import type { ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSede } from "../context/SedeContext";
import { useConsulta } from "../lib/cache";
import { consultas } from "../lib/consultas";
import { fotoJugadorPorArchivo } from "../utils/fotosJugadores";
import { etiquetaEdicion } from "../utils/ediciones";
import type { DorsalesEdicion, DorsalesHistorico } from "../types/analisis";

/**
 * Quiénes llevan cada número del peto y cómo les va.
 *
 * Dos vistas:
 *   - Liga actual: hay un 10 por equipo, así que cada número junta a un
 *     jugador de cada uno, con lo de esta edición.
 *   - Histórico: todos los que lo han llevado en la sede, sumando las
 *     ediciones en que lo llevaron. Es lo que queda cuando la liga termina.
 *
 * Las dos vienen ordenadas del backend sin empates (`compararDorsal`): el
 * puesto es la fila. Los dorsales existen desde la edición 21; los arqueros no
 * llevan número.
 *
 * Rutas: `/dorsales` y `/dorsales/:edicion/:numero` para la liga actual,
 * `/dorsales/historico` y `/dorsales/historico/:numero` para el histórico.
 */

const NUMERO_POR_DEFECTO = 10;

type Vista = "actual" | "historico";

interface FilaVista {
  clave: string;
  slug: string | null;
  nombre: string;
  foto_archivo: string | null;
  capitan?: boolean;
  goles: number;
  partidos: number;
  detalle: ReactNode;
}

/** El número pedido si existe; si no, el 10; si tampoco, el más alto que haya. */
function elegirNumero(numeros: number[], pedido: number | null): number | null {
  if (pedido != null && numeros.includes(pedido)) return pedido;
  if (numeros.includes(NUMERO_POR_DEFECTO)) return NUMERO_POR_DEFECTO;
  return numeros[numeros.length - 1] ?? null;
}

function PuntoEquipo({ color }: { color: string | null }) {
  return (
    <span
      className="size-2 shrink-0 rounded-full ring-1 ring-chalk-3"
      style={{ backgroundColor: color ?? "#4B5563" }}
    />
  );
}

function Lista({ numero, filas, nota }: { numero: number; filas: FilaVista[]; nota: string }) {
  return (
    <section className="rounded-md border border-line bg-surface">
      <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="font-cond text-xs text-chalk-2">Los que llevan el {numero}</h2>
        <span className="font-cond text-[0.6875rem] text-chalk-3">Goles · PJ</span>
      </div>
      <ol>
        {filas.map((j, i) => {
          const foto = fotoJugadorPorArchivo(j.foto_archivo);
          const nombre = (
            <span className="block truncate text-sm text-chalk">
              {j.nombre}
              {j.capitan && <span className="text-chalk-3"> (C)</span>}
            </span>
          );
          return (
            <li key={j.clave} className="flex items-center gap-3 border-t border-line px-4 py-2.5 first:border-t-0">
              <span className="tnum font-data w-5 shrink-0 text-right text-sm text-chalk-3">{i + 1}</span>
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
                <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.6875rem] text-chalk-3">
                  {j.detalle}
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
      <p className="border-t border-line px-4 py-2.5 text-[0.6875rem] text-chalk-3">{nota}</p>
    </section>
  );
}

export function DorsalesPage() {
  const params = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { sedes, sedeId, edicionActual } = useSede();

  const vista: Vista = pathname.startsWith("/dorsales/historico") ? "historico" : "actual";
  const edicion = params.edicion ? Number(params.edicion) : edicionActual;
  const pedido = params.numero ? Number(params.numero) : null;

  // Solo se pide la vista abierta; la otra sale de la caché si ya se vio.
  const actual = useConsulta<DorsalesEdicion>(
    vista === "actual" && edicion != null ? consultas.dorsales(edicion) : null
  );
  const historico = useConsulta<DorsalesHistorico>(
    vista === "historico" ? consultas.dorsalesHistorico(sedeId) : null
  );

  const grupos = (vista === "actual" ? actual.datos?.dorsales : historico.datos?.dorsales) ?? [];
  const numeros = grupos.map((g) => g.dorsal);
  const numero = elegirNumero(numeros, pedido);
  const { loading, error } = vista === "actual" ? actual : historico;

  /** Cambiar de vista conserva el número elegido. */
  const irA = (v: Vista, n: number | null) => {
    const destino =
      v === "historico"
        ? `/dorsales/historico${n != null ? `/${n}` : ""}`
        : edicion != null && n != null
          ? `/dorsales/${edicion}/${n}`
          : "/dorsales";
    navigate(destino, { replace: true });
  };

  const tituloActual =
    actual.datos?.numero_sede != null
      ? etiquetaEdicion({ numero_sede: actual.datos.numero_sede, sede_id: actual.datos.sede_id }, sedes)
      : null;
  const cuantasEdiciones = historico.datos?.ediciones.length ?? 0;

  let filas: FilaVista[] = [];
  if (vista === "actual") {
    const g = actual.datos?.dorsales.find((d) => d.dorsal === numero);
    filas = (g?.jugadores ?? []).map((j) => ({
      clave: j.equipo.slug,
      slug: j.slug,
      nombre: j.nombre,
      foto_archivo: j.foto_archivo,
      capitan: j.es_capitan,
      goles: j.goles,
      partidos: j.partidos,
      detalle: (
        <>
          <PuntoEquipo color={j.equipo.color_hex} />
          <span className="truncate">{j.equipo.nombre}</span>
          {j.puesto_equipo != null && <span className="shrink-0">· {j.puesto_equipo}º en la tabla</span>}
        </>
      ),
    }));
  } else {
    const g = historico.datos?.dorsales.find((d) => d.dorsal === numero);
    filas = (g?.jugadores ?? []).map((j) => ({
      clave: j.slug ?? j.nombre,
      slug: j.slug,
      nombre: j.nombre,
      foto_archivo: j.foto_archivo,
      goles: j.goles,
      partidos: j.partidos,
      // Cada edición en que lo llevó, con su equipo; con más de una, los goles
      // de cada una entre paréntesis para ver de dónde sale el total.
      detalle: j.ediciones.map((e, i) => (
        <span key={e.edicion} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden>·</span>}
          <PuntoEquipo color={e.equipo.color_hex} />
          <span>
            {etiquetaEdicion({ numero_sede: e.numero_sede, sede_id: historico.datos?.sede_id ?? null }, sedes)} ·{" "}
            {e.equipo.nombre}
            {j.ediciones.length > 1 && <span className="tnum font-data"> ({e.goles})</span>}
          </span>
        </span>
      )),
    }));
  }

  return (
    <div className="min-h-full bg-ink text-chalk">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
        <header className="flex flex-col gap-1">
          <h1 className="font-cond text-xl text-chalk sm:text-2xl">Dorsales</h1>
          <p className="text-sm text-chalk-2">Quién lleva cada número del peto, ordenados por goles.</p>
        </header>

        <div role="tablist" aria-label="Vista" className="flex w-fit gap-1 rounded-md border border-line bg-surface p-1">
          {(
            [
              ["actual", "Liga actual"],
              ["historico", "Histórico"],
            ] as const
          ).map(([v, etiqueta]) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={vista === v}
              onClick={() => irA(v, numero)}
              className={`font-cond rounded-sm px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                vista === v ? "bg-chalk text-ink" : "text-chalk-3 hover:text-chalk"
              }`}
            >
              {etiqueta}
            </button>
          ))}
        </div>

        {vista === "actual" && edicion == null ? (
          <p className="text-sm text-chalk-3">Esta ciudad no tiene una edición en juego.</p>
        ) : error ? (
          <p className="rounded-md bg-vivo/15 px-4 py-3 text-sm text-chalk-2">
            No se pudieron cargar los dorsales: {error}
          </p>
        ) : loading ? (
          <p className="font-cond text-sm text-chalk-3">Cargando…</p>
        ) : numero == null ? (
          <p className="text-sm text-chalk-3">
            {vista === "actual"
              ? "Esta edición no tiene dorsales registrados. Se llevan desde la edición 21."
              : "Esta ciudad todavía no tiene dorsales registrados."}
          </p>
        ) : (
          <>
            <p className="text-[0.6875rem] text-chalk-3">
              {vista === "actual"
                ? tituloActual
                : `${cuantasEdiciones} ${cuantasEdiciones === 1 ? "edición" : "ediciones"} con dorsales · goles y PJ sumados de las ediciones en que lo llevó`}
            </p>

            <nav aria-label="Número del peto" className="flex flex-wrap gap-1.5">
              {numeros.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => irA(vista, n)}
                  aria-pressed={n === numero}
                  className={`font-data tnum size-11 rounded-sm text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                    n === numero ? "bg-chalk text-ink" : "bg-surface text-chalk-2 hover:bg-raised hover:text-chalk"
                  }`}
                >
                  {n}
                </button>
              ))}
            </nav>

            <Lista
              numero={numero}
              filas={filas}
              nota={
                vista === "actual"
                  ? "A igualdad de goles va delante quien jugó menos partidos, después el de mejor equipo en la tabla y después el de menos amarillas."
                  : "A igualdad de goles va delante quien jugó menos partidos y después el de menos amarillas."
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
