import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { useSede } from "../context/SedeContext";
import { usePerfilJugador } from "../hooks/useCatalogo";
import { fotoJugadorPorArchivo } from "../utils/fotosJugadores";
import { etiquetaEdicion, mezclaSedes, nombreSede } from "../utils/ediciones";
import {
  mmss,
  type DetallePartidos,
  type EstadisticaJugador,
  type PerfilJugador,
  type RivalPerfil,
  type TramoTrayectoria,
} from "../types/analisis";
import { RAZON_LABEL } from "../components/anotador/utils";
import type { RazonAmarilla } from "../components/anotador/types";
import type { Jugador } from "../types/jugador";

/**
 * Perfil PPT: todo lo que la liga sabe de un jugador.
 *
 * Arriba lo que sale en la ficha de siempre —ediciones, títulos, goles—, y
 * debajo lo que solo existe desde que los partidos se anotan cruce a cruce
 * (edición 19 en adelante): lo que lleva en la edición en juego y en qué minuto
 * marca. La trayectoria cruza ciudades: el padrón es uno.
 */

const ETIQUETA_POSICION: Record<Jugador["posicion"], string> = {
  arquero: "Arquero",
  defensa: "Defensa",
  mediocampista: "Mediocampista",
  delantero: "Delantero",
};

const ETIQUETA_PALMARES: Record<string, string> = {
  bota_oro: "Bota de oro",
  guante_oro: "Guante de oro",
  mvp_liga: "MVP de la liga",
  mvp_final: "MVP de la final",
  capitan_campeon: "Capitán campeón",
};

/** "7, 11, 17" → "Ediciones 7, 11 y 17". */
function textoEdiciones(numeros: string[]): string {
  if (numeros.length === 1) return `Edición ${numeros[0]}`;
  return `Ediciones ${numeros.slice(0, -1).join(", ")} y ${numeros[numeros.length - 1]}`;
}

/**
 * Un premio del palmarés, con las ediciones en que lo ganó al pasar por
 * encima (o al tocarlo, en el celular).
 *
 * El palmarés heredado solo guarda cuántos premios ganó cada uno, no cuándo:
 * la edición consta en los registrados desde la 20 y en los capitanes. La Bota
 * de oro se completa con los rankings de goleadores, que sí dicen quién quedó
 * primero en cada edición, pero solo si la cuenta cuadra con las botas que
 * tiene: si no, se diría algo que el palmarés no respalda.
 *
 * Sin edición conocida no hay tooltip: el premio se muestra solo.
 */
function Premio({
  etiqueta,
  cantidad,
  ediciones,
  sede,
}: {
  etiqueta: string;
  cantidad: number;
  ediciones: string[];
  sede: string | null;
}) {
  const [abierto, setAbierto] = useState(false);
  const nombre = `${etiqueta}${cantidad > 1 ? ` ×${cantidad}` : ""}`;

  if (!ediciones.length) {
    return (
      <span className="font-cond rounded-sm border border-line px-2 py-1 text-[0.6875rem] text-chalk-2">
        {nombre}
      </span>
    );
  }

  const texto = `${textoEdiciones(ediciones)}${sede ? ` · ${sede}` : ""}`;

  return (
    <span className="group relative">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        onBlur={() => setAbierto(false)}
        aria-label={`${nombre}: ${texto}`}
        className="font-cond cursor-default rounded-sm border border-line px-2 py-1 text-[0.6875rem] text-chalk-2 transition-colors hover:border-chalk-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
      >
        {nombre}
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-0 z-10 mb-1.5 rounded-sm bg-chalk px-2 py-1 text-[0.6875rem] whitespace-nowrap text-ink shadow-e2 transition-opacity group-hover:opacity-100 ${
          abierto ? "opacity-100" : "opacity-0"
        }`}
      >
        {texto}
      </span>
    </span>
  );
}

function Panel({
  titulo,
  nota,
  children,
}: {
  titulo: string;
  nota?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-line bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-cond text-xs text-chalk-2">{titulo}</h2>
        {nota && <span className="font-cond text-[0.6875rem] text-chalk-3">{nota}</span>}
      </div>
      {children}
    </section>
  );
}

function Cifra({ valor, etiqueta }: { valor: string | number; etiqueta: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-sm bg-raised px-3 py-2.5">
      <span className="tnum font-data text-xl leading-none font-bold text-chalk">{valor}</span>
      <span className="font-cond truncate text-[0.625rem] text-chalk-3">{etiqueta}</span>
    </div>
  );
}

/** Suma las filas de varias ediciones (o de dos equipos en la misma). */
function sumar(filas: EstadisticaJugador[]) {
  const tiempos = filas.flatMap((f) => f.tiemposGol);
  const partidos = filas.reduce((n, f) => n + f.partidos, 0);
  const goles = filas.reduce((n, f) => n + f.goles, 0);
  const arq = filas.filter((f) => f.arquero);
  const recibidos = arq.reduce((n, f) => n + f.arquero!.recibidos, 0);
  const crucesArq = arq.reduce((n, f) => n + f.arquero!.cruces, 0);
  // Con un solo equipo en la edición —lo normal— el dato es directo; mezclar
  // dos medias sin saber cuántos goles se midieron en cada una no sería exacto.
  const segundosPorGol = arq.length === 1 ? arq[0].arquero!.segundosPorGol : null;
  return {
    partidos,
    goles,
    tiempos,
    tiempoMedio: tiempos.length
      ? Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length)
      : null,
    golMasRapido: tiempos.length ? Math.min(...tiempos) : null,
    amarillas: filas.reduce((n, f) => n + f.amarillas, 0),
    rojas: filas.reduce((n, f) => n + f.rojas, 0),
    arquero: arq.length ? { recibidos, cruces: crucesArq, segundosPorGol } : null,
  };
}

/**
 * En qué minuto del cruce marca. Una sola serie: barras en tiza, sin leyenda,
 * y la cifra de la barra que se toca o, si no, de la más alta.
 */
function MinutoDeGol({ tiempos }: { tiempos: number[] }) {
  const [elegido, setElegido] = useState<number | null>(null);
  const tramos = Array.from({ length: 8 }, (_, m) => ({
    desde: m,
    goles: tiempos.filter((t) => Math.min(7, Math.floor(t / 60)) === m).length,
  }));
  const max = Math.max(...tramos.map((t) => t.goles));
  const pico = tramos.findIndex((t) => t.goles === max);
  const foco = elegido ?? pico;
  const total = tiempos.length;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-chalk-2" aria-live="polite">
        <span className="font-data tnum text-chalk">{tramos[foco].goles}</span> de {total} goles
        entre el minuto {tramos[foco].desde} y el {tramos[foco].desde + 1}
        <span className="text-chalk-3"> · {Math.round((tramos[foco].goles / total) * 100)}%</span>
      </p>
      <div className="flex h-28 items-end gap-[2px]" onMouseLeave={() => setElegido(null)}>
        {tramos.map((t, i) => (
          <button
            key={t.desde}
            type="button"
            onMouseEnter={() => setElegido(i)}
            onFocus={() => setElegido(i)}
            onClick={() => setElegido(i)}
            aria-label={`Minuto ${t.desde} a ${t.desde + 1}: ${t.goles} goles`}
            className="group flex h-full flex-1 cursor-pointer items-end focus-visible:outline-2 focus-visible:outline-chalk"
          >
            <span
              className={`block w-full rounded-t-[4px] transition-colors ${
                i === foco ? "bg-chalk" : "bg-chalk-3/50 group-hover:bg-chalk-3"
              }`}
              style={{ height: max ? `${Math.max(2, (t.goles / max) * 100)}%` : "2%" }}
            />
          </button>
        ))}
      </div>
      <div className="flex gap-[2px]" aria-hidden>
        {tramos.map((t) => (
          <span key={t.desde} className="font-data flex-1 text-center text-[0.625rem] text-chalk-3">
            {t.desde}′
          </span>
        ))}
      </div>
    </div>
  );
}

const RONDA: Record<string, string> = {
  cuartos: "Cuartos",
  semifinal: "Semifinal",
  final: "Final",
};

/** Dónde fue una sesión: «Edición 19 · jornada 6» o «Edición 20 · final». */
function textoSesion(
  s: { edicion: number; modo: string; jornada: number | null },
  trayectoria: TramoTrayectoria[],
  sedes: Parameters<typeof etiquetaEdicion>[1],
  conSede: boolean
) {
  const t = trayectoria.find((x) => x.edicion === s.edicion);
  const edicion = t ? etiquetaEdicion(t, sedes, { conSede }) : "";
  const cuando = s.modo === "jornada" ? `jornada ${s.jornada}` : (RONDA[s.modo] ?? s.modo).toLowerCase();
  return `${edicion} · ${cuando}`;
}

/**
 * Su lugar en los rankings históricos de la ciudad, y las finales que jugó.
 *
 * Las finales perdidas solo constan desde la edición 19: antes no se guardaba
 * quién jugaba en el subcampeón. Las ganadas sí, son sus títulos.
 */
function EnLaHistoria({ perfil }: { perfil: PerfilJugador }) {
  const { sedes } = useSede();
  const variasSedes = perfil.enSede.length > 1;
  const finalesPerdidas = perfil.trayectoria.filter((t) => t.subcampeon).length;
  const finalesGanadas = perfil.jugador.ligas_ganadas;
  const esArquero = perfil.jugador.posicion === "arquero";

  const chips: string[] = [];
  for (const s of perfil.enSede) {
    const donde = variasSedes || sedes.length > 1 ? ` de ${nombreSede(s.sede_id, sedes)}` : "";
    // A un arquero no se le mide por goles, y más allá del top 20 el puesto de
    // goleador no dice nada.
    if (!esArquero && s.puestoGoles && s.puestoGoles <= 20) chips.push(`${s.puestoGoles}º goleador histórico${donde}`);
    // Fuera del top 10 hay decenas de empatados con uno o dos títulos: el
    // puesto no dice nada.
    if (s.puestoTitulos && s.puestoTitulos <= 10) chips.push(`${s.puestoTitulos}º en títulos${donde}`);
  }
  if (finalesGanadas + finalesPerdidas > 0) {
    chips.push(
      `${finalesGanadas + finalesPerdidas} ${finalesGanadas + finalesPerdidas === 1 ? "final" : "finales"}: ${finalesGanadas} ${finalesGanadas === 1 ? "ganada" : "ganadas"}` +
        (finalesPerdidas ? ` · ${finalesPerdidas} ${finalesPerdidas === 1 ? "perdida" : "perdidas"}` : "")
    );
  }
  if (!chips.length) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <ul className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <li key={c} className="font-cond rounded-sm bg-raised px-2 py-1 text-[0.6875rem] text-chalk-2">
            {c}
          </li>
        ))}
      </ul>
      {finalesGanadas + finalesPerdidas > 0 && (
        <p className="text-[0.6875rem] text-chalk-3">Las finales perdidas constan desde la edición 19.</p>
      )}
    </div>
  );
}

/** Goles en cada jornada de una edición. Una serie: barras en tiza. */
function GolesPorJornada({ filas }: { filas: { jornada: number; goles: number }[] }) {
  const max = Math.max(1, ...filas.map((f) => f.goles));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-20 items-end gap-1.5">
        {filas.map((f) => (
          <div key={f.jornada} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="tnum font-data text-[0.6875rem] text-chalk-2">{f.goles}</span>
            <span
              className="block w-full rounded-t-[4px] bg-chalk"
              style={{ height: f.goles ? `${(f.goles / max) * 100}%` : "2px", opacity: f.goles ? 1 : 0.3 }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5" aria-hidden>
        {filas.map((f) => (
          <span key={f.jornada} className="font-data flex-1 text-center text-[0.625rem] text-chalk-3">
            J{f.jornada}
          </span>
        ))}
      </div>
    </div>
  );
}

function ListaRivales({ rivales, unidad }: { rivales: RivalPerfil[]; unidad: string }) {
  return (
    <ol className="flex flex-col">
      {rivales.map((r, i) => (
        <li key={`${r.slug ?? r.nombre}-${i}`} className="flex items-baseline justify-between gap-3 border-t border-line py-2 first:border-t-0">
          {r.slug ? (
            <Link to={`/jugador/${r.slug}`} className="truncate text-sm text-chalk hover:underline">
              {r.nombre}
            </Link>
          ) : (
            <span className="truncate text-sm text-chalk">{r.nombre}</span>
          )}
          <span className="tnum font-data shrink-0 text-sm font-bold text-chalk">
            {r.goles}
            <span className="ml-1 text-[0.625rem] font-normal text-chalk-3">{unidad}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Lo que dicen los partidos anotados: cuándo marca, a quién, cómo cobra.
 * Cada recuadro aparece solo si tiene algo que contar.
 */
function DetalleDePartidos({
  detalle,
  trayectoria,
  conSede,
  esArquero,
}: {
  detalle: DetallePartidos;
  trayectoria: TramoTrayectoria[];
  conSede: boolean;
  esArquero: boolean;
}) {
  const { sedes } = useSede();
  const { goles, penales, racha, mejorSesion } = detalle;
  const enPlayoffs = goles.cuartos + goles.semifinal + goles.final;
  const tirados = penales.convertidos + penales.fallados;
  const amarillas = Object.entries(detalle.amarillas).sort(([, a], [, b]) => b - a);

  return (
    <>
      {((!esArquero && (goles.regular > 0 || enPlayoffs > 0)) || tirados > 0) && (
        <Panel titulo="Cuando más importa" nota="Desde la edición 19">
          {!esArquero && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Cifra valor={goles.regular} etiqueta="Fase regular" />
              <Cifra valor={goles.cuartos} etiqueta="Cuartos" />
              <Cifra valor={goles.semifinal} etiqueta="Semifinales" />
              <Cifra valor={goles.final} etiqueta="Finales" />
            </div>
          )}
          {tirados > 0 && (
            <p className={`text-sm text-chalk-2 ${esArquero ? "" : "mt-3"}`}>
              Penales en tandas:{" "}
              <span className="tnum font-data text-chalk">
                {penales.convertidos} de {tirados}
              </span>{" "}
              convertidos
            </p>
          )}
        </Panel>
      )}

      {!esArquero && (mejorSesion || racha.mejor > 1) && (
        <Panel titulo="Récords personales" nota="Desde la edición 19">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {mejorSesion && <Cifra valor={mejorSesion.goles} etiqueta="Mejor sesión" />}
            {racha.mejor > 1 && <Cifra valor={racha.mejor} etiqueta="Mejor racha" />}
            {racha.actual > 1 && <Cifra valor={racha.actual} etiqueta="Racha actual" />}
          </div>
          <p className="mt-3 text-[0.6875rem] text-chalk-3">
            {mejorSesion && <>Su mejor sesión, {mejorSesion.goles} {mejorSesion.goles === 1 ? "gol" : "goles"}: {textoSesion(mejorSesion, trayectoria, sedes, conSede)}. </>}
            {racha.mejor > 1 && "La racha cuenta sesiones seguidas marcando."}
          </p>
        </Panel>
      )}

      {!esArquero && detalle.victimas.length > 0 && (
        <Panel titulo="Los arqueros a los que más les marca">
          <ListaRivales rivales={detalle.victimas} unidad="goles" />
        </Panel>
      )}

      {detalle.verdugos.length > 0 && (
        <Panel titulo="Quién le marca más" nota="Como arquero">
          <ListaRivales rivales={detalle.verdugos} unidad="goles" />
        </Panel>
      )}

      {(amarillas.length > 0 || detalle.rojas > 0) && (
        <Panel titulo="Disciplina" nota="Desde la edición 19">
          <ul className="flex flex-col">
            {amarillas.map(([razon, n]) => (
              <li key={razon} className="flex items-baseline justify-between gap-3 border-t border-line py-2 first:border-t-0">
                <span className="flex items-center gap-2 text-sm text-chalk-2">
                  <span aria-hidden className="h-3 w-2 rounded-[2px] bg-amarilla" />
                  {RAZON_LABEL[razon as RazonAmarilla] ?? razon}
                </span>
                <span className="tnum font-data text-sm font-bold text-chalk">{n}</span>
              </li>
            ))}
            {detalle.rojas > 0 && (
              <li className="flex items-baseline justify-between gap-3 border-t border-line py-2 first:border-t-0">
                <span className="flex items-center gap-2 text-sm text-chalk-2">
                  <span aria-hidden className="h-3 w-2 rounded-[2px] bg-roja" />
                  Rojas
                </span>
                <span className="tnum font-data text-sm font-bold text-chalk">{detalle.rojas}</span>
              </li>
            )}
          </ul>
        </Panel>
      )}
    </>
  );
}

function Companeros({ companeros }: { companeros: PerfilJugador["companeros"] }) {
  return (
    <Panel titulo="Compañeros de equipo" nota="Más de una edición juntos">
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {companeros.map((c) => {
          const foto = fotoJugadorPorArchivo(c.foto_archivo);
          return (
            <li key={c.slug}>
              <Link
                to={`/jugador/${c.slug}`}
                className="flex items-center gap-2.5 rounded-sm bg-raised p-2 transition-colors hover:bg-line"
              >
                <span className="size-9 shrink-0 overflow-hidden rounded-sm bg-surface">
                  {foto ? (
                    <img src={foto} alt="" className="size-full object-cover object-top" />
                  ) : (
                    <span className="font-cond grid size-full place-items-center text-sm text-chalk-3">
                      {c.nombre.charAt(0)}
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-chalk">{c.nombre}</span>
                  <span className="font-cond block text-[0.625rem] text-chalk-3">
                    {c.ediciones.length} ediciones juntos
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function FilaTrayectoria({
  t,
  conSede,
  mejor,
}: {
  t: TramoTrayectoria;
  conSede: boolean;
  /** Su edición con más goles: se marca para que salte a la vista. */
  mejor: boolean;
}) {
  const { sedes } = useSede();
  const s = t.stats.length ? sumar(t.stats) : null;
  return (
    <li className="flex flex-col gap-1 border-t border-line py-2.5 first:border-t-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-cond flex min-w-0 items-center gap-1.5 text-sm text-chalk">
          {etiquetaEdicion(t, sedes, { conSede })}
          {t.tematica && <span className="truncate text-chalk-3">· {t.tematica}</span>}
          {t.campeon && (
            <FaStar aria-label="Campeón" className="size-3 shrink-0 text-chalk-2" />
          )}
          {mejor && (
            <span className="font-cond shrink-0 rounded-sm bg-chalk px-1.5 py-0.5 text-[0.5625rem] text-ink">
              Mejor edición
            </span>
          )}
        </span>
        <span className="tnum font-data shrink-0 text-sm font-bold text-chalk">
          {/* Quien fue arquero esa edición se mide por lo que recibió. */}
          {t.recibidos != null ? t.recibidos : t.goles}
          <span className="ml-1 text-[0.625rem] font-normal text-chalk-3">
            {t.recibidos != null ? "recibidos" : "goles"}
          </span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] text-chalk-3">
        {t.equipo && (
          <span className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full ring-1 ring-chalk-3"
              style={{ backgroundColor: t.equipo.color_hex ?? "#4B5563" }}
            />
            {t.equipo.nombre}
          </span>
        )}
        {t.dorsal != null && (
          <Link to={`/dorsales/${t.edicion}/${t.dorsal}`} className="font-data hover:text-chalk">
            · #{t.dorsal}
          </Link>
        )}
        {t.puesto_equipo && (
          <span>
            · {t.puesto_equipo.posicion}º de {t.puesto_equipo.de}
          </span>
        )}
        {t.campeon && <span>· Campeón</span>}
        {t.subcampeon && <span>· Subcampeón</span>}
        {t.es_capitan && <span>· Capitán</span>}
        {t.es_arquero && <span>· Arquero</span>}
        {t.posicion_goleo != null && <span>· {t.posicion_goleo}º goleador</span>}
        {t.estado === "activa" && <span>· En juego</span>}
        {s && s.partidos > 0 && <span className="font-data tnum">· {s.partidos} PJ</span>}
      </div>
    </li>
  );
}

export function PerfilJugadorPage() {
  const { slug } = useParams();
  const { perfil, loading, error } = usePerfilJugador(slug);
  const { sedes } = useSede();

  const conDetalle = useMemo(
    () => (perfil?.trayectoria ?? []).filter((t) => t.stats.length > 0),
    [perfil]
  );
  const total = useMemo(() => sumar(conDetalle.flatMap((t) => t.stats)), [conDetalle]);
  const enJuego = conDetalle.find((t) => t.estado === "activa");
  const actual = enJuego ? sumar(enJuego.stats) : null;

  if (loading && !perfil) {
    return (
      <div className="min-h-full bg-ink p-4">
        <p className="font-cond text-sm text-chalk-3">Cargando perfil…</p>
      </div>
    );
  }

  if (error || !perfil) {
    return (
      <div className="min-h-full bg-ink p-4">
        <p className="rounded-md bg-vivo/15 px-4 py-3 text-sm text-chalk-2">
          {error === "Jugador no encontrado" ? "No encontramos a ese jugador." : `No se pudo cargar el perfil: ${error}`}
        </p>
        <Link to="/historia" className="font-cond mt-3 inline-block text-xs text-chalk-3 hover:text-chalk">
          ← Volver a jugadores
        </Link>
      </div>
    );
  }

  const { jugador, palmares, trayectoria, detalle, companeros } = perfil;
  const foto = fotoJugadorPorArchivo(jugador.foto_archivo);
  const esArquero = jugador.posicion === "arquero";
  const recibidosCarrera = trayectoria.reduce((n, t) => n + (t.recibidos ?? 0), 0);
  const premios = palmares.filter((p) => p.tipo !== "goles_historicos" && p.cantidad > 0);
  const conSede = mezclaSedes(trayectoria);
  const premiosEnVariasSedes = mezclaSedes(premios);

  const dorsalActual = enJuego ? perfil.dorsales.find((d) => d.edicion === enJuego.edicion) : undefined;
  const jornadasActuales = enJuego
    ? (detalle?.porJornada ?? []).filter((f) => f.edicion === enJuego.edicion)
    : [];
  // Su edición con más goles, si se destaca de alguna manera: con una sola
  // edición, o con todas en cero, marcarla no dice nada.
  const conGoles = trayectoria.filter((t) => t.goles > 0 && t.recibidos == null);
  const mejorEdicion =
    !esArquero && conGoles.length > 1
      ? conGoles.reduce((a, b) => (b.goles > a.goles ? b : a)).edicion
      : null;

  const edicionesDe = (p: (typeof premios)[number]): string[] => {
    if (p.detalle) return p.detalle.split(",").map((x) => x.trim()).filter(Boolean);
    if (p.tipo === "bota_oro") {
      const primeros = trayectoria
        .filter((t) => t.posicion_goleo === 1 && t.sede_id === p.sede_id)
        .map((t) => String(t.numero_sede))
        .reverse();
      if (primeros.length === p.cantidad) return primeros;
    }
    return [];
  };

  return (
    <div className="min-h-full bg-ink text-chalk">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
        <Link to="/historia" className="font-cond self-start text-[0.6875rem] text-chalk-3 hover:text-chalk">
          ← Jugadores
        </Link>

        {/* Cabecera */}
        <header className="flex items-start gap-4 rounded-md border border-line bg-surface p-4">
          <div className="size-20 shrink-0 overflow-hidden rounded-sm bg-raised sm:size-24">
            {foto ? (
              <img src={foto} alt="" className="size-full object-cover object-top" />
            ) : (
              <span className="font-cond grid size-full place-items-center text-2xl text-chalk-3">
                {jugador.nombre.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-cond text-xl leading-tight text-chalk sm:text-2xl">{jugador.nombre}</h1>
            {jugador.apodo && <p className="text-sm text-chalk-2">«{jugador.apodo}»</p>}
            <p className="font-cond mt-1 text-[0.6875rem] text-chalk-3">
              {ETIQUETA_POSICION[jugador.posicion]}
              {jugador.es_fundador ? " · Fundador" : ""}
              {enJuego?.dorsal != null && (
                <>
                  {" · "}
                  <Link
                    to={`/dorsales/${enJuego.edicion}/${enJuego.dorsal}`}
                    className="font-data text-chalk-2 hover:text-chalk"
                  >
                    #{enJuego.dorsal}
                  </Link>
                </>
              )}
            </p>
            {jugador.ligas_ganadas > 0 && (
              <div className="mt-2 flex flex-wrap gap-0.5" aria-label={`${jugador.ligas_ganadas} títulos`}>
                {Array.from({ length: jugador.ligas_ganadas }).map((_, i) => (
                  <FaStar key={i} aria-hidden className="size-3 text-chalk-2" />
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-3 gap-2">
          <Cifra valor={jugador.ligas_jugadas} etiqueta="Ediciones" />
          <Cifra valor={jugador.ligas_ganadas} etiqueta="Títulos" />
          {esArquero ? (
            <Cifra valor={recibidosCarrera} etiqueta="Goles recibidos" />
          ) : (
            <Cifra valor={jugador.goles_historicos} etiqueta="Goles" />
          )}
        </div>

        {premios.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {premios.map((p) => (
              <Premio
                key={`${p.tipo}-${p.sede_id}`}
                etiqueta={ETIQUETA_PALMARES[p.tipo] ?? p.tipo}
                cantidad={p.cantidad}
                ediciones={edicionesDe(p)}
                sede={premiosEnVariasSedes ? nombreSede(p.sede_id, sedes) : null}
              />
            ))}
          </div>
        )}

        <EnLaHistoria perfil={perfil} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-4">
            {enJuego && actual && (
              <Panel
                // Todo lo de este recuadro es solo de la edición en juego; lo
                // de toda la carrera está en las cifras de arriba.
                titulo={`Esta edición · ${etiquetaEdicion(enJuego, [], {})}`}
                nota={enJuego.equipo?.nombre}
              >
                {actual.arquero ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Cifra valor={actual.arquero.recibidos} etiqueta="Goles recibidos" />
                    <Cifra valor={actual.partidos} etiqueta="Partidos jugados" />
                    <Cifra
                      // En minutos: «16:28» se lee como una hora.
                      valor={
                        actual.arquero.segundosPorGol != null
                          ? `${Math.round(actual.arquero.segundosPorGol / 60)} min`
                          : "—"
                      }
                      etiqueta="Recibe un gol cada"
                    />
                    {actual.goles > 0 && <Cifra valor={actual.goles} etiqueta="Goles" />}
                    <Cifra
                      valor={`${actual.amarillas}${actual.rojas ? ` · ${actual.rojas}R` : ""}`}
                      etiqueta="Amarillas"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Cifra valor={actual.goles} etiqueta="Goles" />
                    <Cifra valor={actual.partidos} etiqueta="Partidos jugados" />
                    <Cifra valor={mmss(actual.tiempoMedio)} etiqueta="Tarda en marcar" />
                    <Cifra valor={mmss(actual.golMasRapido)} etiqueta="Gol más rápido" />
                    <Cifra
                      valor={`${actual.amarillas}${actual.rojas ? ` · ${actual.rojas}R` : ""}`}
                      etiqueta="Amarillas"
                    />
                  </div>
                )}

                {dorsalActual && (
                  <p className="mt-3 text-sm text-chalk-2">
                    Con el{" "}
                    <Link
                      to={`/dorsales/${dorsalActual.edicion}/${dorsalActual.dorsal}`}
                      className="font-data text-chalk hover:underline"
                    >
                      #{dorsalActual.dorsal}
                    </Link>
                    : <span className="tnum font-data text-chalk">{dorsalActual.puesto}º</span> en goles de{" "}
                    {dorsalActual.de} que lo llevan
                    {dorsalActual.lider && dorsalActual.puesto > 1 && (
                      <span className="text-chalk-3">
                        {" "}· lidera {dorsalActual.lider.nombre} ({dorsalActual.lider.goles})
                      </span>
                    )}
                  </p>
                )}

                {jornadasActuales.length > 1 && !actual.arquero && (
                  <div className="mt-4">
                    <p className="font-cond mb-2 text-[0.6875rem] text-chalk-3">Goles por jornada</p>
                    <GolesPorJornada filas={jornadasActuales} />
                  </div>
                )}
              </Panel>
            )}

            {total.tiempos.length >= 5 && (
              <Panel titulo="En qué minuto marca" nota={`Desde la edición 19 · ${total.tiempos.length} goles`}>
                <MinutoDeGol tiempos={total.tiempos} />
              </Panel>
            )}

            {detalle && (
              <DetalleDePartidos
                detalle={detalle}
                trayectoria={trayectoria}
                conSede={conSede}
                esArquero={esArquero}
              />
            )}

            {companeros.length > 0 && <Companeros companeros={companeros} />}

          </div>

          <Panel titulo="Trayectoria">
            {trayectoria.length ? (
              <ul>
                {trayectoria.map((t) => (
                  <FilaTrayectoria key={t.edicion} t={t} conSede={conSede} mejor={t.edicion === mejorEdicion} />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-chalk-3">Todavía no hay ediciones registradas.</p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
