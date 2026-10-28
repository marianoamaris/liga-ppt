import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSede } from "../context/SedeContext";
import { useConsulta } from "../lib/cache";
import { consultas } from "../lib/consultas";
import { SelectorSede } from "../components/common/SelectorSede";
import { Puesto } from "../components/common/iconos";
import { fotoJugadorPorArchivo } from "../utils/fotosJugadores";
import { etiquetaEdicion } from "../utils/ediciones";
import { mmss } from "../types/analisis";
import type { IdRecord, LogrosSede, Marca, RecordVivo } from "../types/logros";

/**
 * Récords de la liga, por sede.
 *
 * Antes era un podio con una pestaña por récord: siete pestañas, y cada récord
 * nuevo era otra más. Ahora es una página que se recorre: secciones de
 * jugadores y equipos, una tarjeta por récord con el primero en grande y el
 * segundo y el tercero debajo, y el top 10 al desplegarla. Un récord nuevo es
 * una tarjeta más.
 *
 * Los récords están vivos: el backend junta lo congelado de la hoja de cálculo
 * con lo que se calcula de cada edición y de los partidos anotados. Lo que solo
 * existe desde la edición 19 lo dice en la propia tarjeta.
 */

interface Catalogo {
  titulo: string;
  unidad: string;
  /** De dónde sale o qué cuenta, cuando no es obvio. */
  nota?: string;
  formato?: (valor: number) => string;
}

/**
 * Cómo se llama cada récord. Las filas son datos y llegan de la API; las
 * etiquetas son copy y viven aquí, junto al componente que las pinta.
 */
const CATALOGO: Record<IdRecord, Catalogo> = {
  goles_liga: { titulo: "Más goles en una liga", unidad: "goles" },
  goles_sesion: { titulo: "Más goles en una jornada", unidad: "goles" },
  menos_recibidos: { titulo: "Arquero menos batido en una liga", unidad: "recibidos", nota: "Ligas terminadas" },
  racha_marcando: { titulo: "Más jornadas seguidas marcando", unidad: "jornadas", nota: "Desde la edición 19" },
  gol_rapido: {
    titulo: "Gol más rápido",
    unidad: "min:seg",
    nota: "Desde que arranca el partido · desde la edición 19",
    formato: (s) => mmss(s),
  },
  goles_playoffs: { titulo: "Más goles en playoffs", unidad: "goles", nota: "Cuartos, semis y finales · desde la edición 19" },
  amarillas: { titulo: "Más amarillas", unidad: "amarillas", nota: "Desde la edición 19" },
  rojas: { titulo: "Más rojas", unidad: "rojas", nota: "Desde la edición 19" },

  puntos_liga: { titulo: "Más puntos en una liga", unidad: "puntos" },
  puntos_jornada: { titulo: "Más puntos en una jornada", unidad: "puntos" },
  racha_victorias: { titulo: "Más partidos seguidos ganados", unidad: "partidos", nota: "Desde la edición 19" },
  racha_invicto: { titulo: "Más partidos seguidos sin perder", unidad: "partidos", nota: "Desde la edición 19" },
  goles_favor: { titulo: "Más goles a favor en una liga", unidad: "goles", nota: "Desde la edición 19" },
  menos_goles_contra: {
    titulo: "Menos goles en contra en una liga",
    unidad: "goles",
    nota: "Ligas terminadas · desde la edición 19",
  },

  menos_puntos_liga: { titulo: "Menos puntos en una liga", unidad: "puntos", nota: "Ligas terminadas" },
  menos_puntos_jornada: { titulo: "Menos puntos en una jornada", unidad: "puntos", nota: "Ligas terminadas" },
  racha_derrotas: { titulo: "Más partidos seguidos perdidos", unidad: "partidos", nota: "Desde la edición 19" },
  racha_sin_ganar: { titulo: "Más partidos seguidos sin ganar", unidad: "partidos", nota: "Desde la edición 19" },
};

/** Las secciones, en el orden en que se leen. */
const SECCIONES: { id: string; filtro: Filtro; titulo: string; records: IdRecord[] }[] = [
  {
    id: "jugadores",
    filtro: "jugadores",
    titulo: "Jugadores",
    records: [
      "goles_liga",
      "goles_sesion",
      "racha_marcando",
      "gol_rapido",
      "goles_playoffs",
      "menos_recibidos",
      "amarillas",
      "rojas",
    ],
  },
  {
    id: "equipos",
    filtro: "equipos",
    titulo: "Equipos",
    records: ["puntos_liga", "puntos_jornada", "racha_victorias", "racha_invicto", "goles_favor", "menos_goles_contra"],
  },
  {
    id: "olvidar",
    filtro: "equipos",
    titulo: "Equipos · para olvidar",
    records: ["menos_puntos_liga", "menos_puntos_jornada", "racha_derrotas", "racha_sin_ganar"],
  },
];

type Filtro = "todos" | "jugadores" | "equipos";

const FILTROS: { id: Filtro; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "jugadores", label: "Jugadores" },
  { id: "equipos", label: "Equipos" },
];

const RONDA: Record<string, string> = { cuartos: "cuartos", semifinal: "semifinal", final: "final" };

/** Quién: el jugador del padrón o el equipo de esa edición. */
function nombreDe(m: Marca): string {
  return m.jugador?.nombre ?? m.equipo?.nombre ?? "—";
}

function Avatar({ m, grande }: { m: Marca; grande?: boolean }) {
  const tam = grande ? "size-14" : "size-8";
  if (m.equipo) {
    return (
      <span
        className={`${tam} shrink-0 rounded-full ring-2 ring-line`}
        style={{ background: m.equipo.color_hex ?? "#4B5563" }}
      />
    );
  }
  const foto = fotoJugadorPorArchivo(m.jugador?.foto_archivo ?? null);
  return (
    <span className={`${tam} shrink-0 overflow-hidden rounded-full bg-raised ring-2 ring-line`}>
      {foto ? (
        <img src={foto} alt="" className="size-full object-cover object-top" />
      ) : (
        <span className="font-cond grid size-full place-items-center text-xs text-chalk-3">{nombreDe(m).charAt(0)}</span>
      )}
    </span>
  );
}

function Nombre({ m, className }: { m: Marca; className: string }) {
  return m.jugador?.slug ? (
    <Link to={`/jugador/${m.jugador.slug}`} className={`${className} hover:underline`}>
      {nombreDe(m)}
    </Link>
  ) : (
    <span className={className}>{nombreDe(m)}</span>
  );
}

function Tarjeta({ record }: { record: RecordVivo }) {
  const { sedes, sedeId } = useSede();
  const [abierta, setAbierta] = useState(false);
  const cat = CATALOGO[record.id];
  const valor = (v: number) => (cat.formato ? cat.formato(v) : String(v));

  /** «Edición 19 · jornada 6», o nada si el récord no dice cuándo. */
  const cuando = (m: Marca) => {
    if (m.numero_sede == null) return null;
    const ed = etiquetaEdicion({ numero_sede: m.numero_sede, sede_id: sedeId }, sedes);
    if (m.jornada != null) return `${ed} · jornada ${m.jornada}`;
    if (m.ronda) return `${ed} · ${RONDA[m.ronda] ?? m.ronda}`;
    return ed;
  };

  const [primero, ...resto] = record.marcas;
  const visibles = abierta ? resto : resto.slice(0, 2);

  return (
    <article className="flex flex-col rounded-md border border-line bg-surface">
      <header className="flex items-baseline justify-between gap-3 px-4 pt-4">
        <h3 className="font-cond text-xs text-chalk-2">{cat.titulo}</h3>
      </header>

      <div className="flex items-center gap-3 px-4 pt-3 pb-3">
        <Avatar m={primero} grande />
        <div className="min-w-0 flex-1">
          <Nombre m={primero} className="block truncate text-base text-chalk" />
          <p className="truncate text-[0.6875rem] text-chalk-3">{cuando(primero) ?? " "}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="tnum font-data block text-3xl leading-none font-bold text-chalk">{valor(primero.valor)}</span>
          <span className="font-cond text-[0.625rem] text-chalk-3">{cat.unidad}</span>
        </div>
      </div>

      {visibles.length > 0 && (
        <ol className="border-t border-line px-4">
          {visibles.map((m, i) => (
            <li
              key={`${nombreDe(m)}-${m.edicion}-${m.jornada}-${i}`}
              className="flex items-center gap-2.5 border-t border-line py-2 first:border-t-0"
            >
              <Puesto n={m.posicion} />
              <Avatar m={m} />
              <span className="min-w-0 flex-1">
                <Nombre m={m} className="block truncate text-sm text-chalk" />
                {cuando(m) && <span className="block truncate text-[0.625rem] text-chalk-3">{cuando(m)}</span>}
              </span>
              <span className="tnum font-data shrink-0 text-sm font-bold text-chalk">{valor(m.valor)}</span>
            </li>
          ))}
        </ol>
      )}

      <footer className="mt-auto flex items-center justify-between gap-3 border-t border-line px-4 py-2.5">
        <span className="text-[0.625rem] text-chalk-3">{cat.nota ?? ""}</span>
        {resto.length > 2 && (
          <button
            type="button"
            onClick={() => setAbierta((v) => !v)}
            aria-expanded={abierta}
            className="font-cond shrink-0 text-[0.6875rem] text-chalk-2 hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
          >
            {abierta ? "Ver menos" : `Ver los ${record.marcas.length}`}
          </button>
        )}
      </footer>
    </article>
  );
}

export const LogrosPage: React.FC = () => {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const { sede, sedeId } = useSede();
  const { datos, loading, error } = useConsulta<LogrosSede>(consultas.logros(sedeId));

  const porId = new Map((datos?.records ?? []).map((r) => [r.id, r]));
  // Un récord sin marcas (una ciudad recién abierta) no ocupa sitio.
  const secciones = SECCIONES.filter((s) => filtro === "todos" || s.filtro === filtro)
    .map((s) => ({ ...s, lista: s.records.map((id) => porId.get(id)).filter((r): r is RecordVivo => !!r?.marcas.length) }))
    .filter((s) => s.lista.length > 0);

  return (
    <div className="min-h-full bg-ink text-chalk">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-cond text-[0.625rem] text-chalk-3">
              {sede ? `${sede.nombre} · Todos los tiempos` : "Liga PPT"}
            </p>
            <h1 className="font-cond text-3xl text-chalk">Récords</h1>
          </div>
          {/* Los récords no se mezclan entre ciudades: cada una tiene los suyos. */}
          <SelectorSede className="w-full max-w-[16rem]" mostrarEdicion={false} />
        </header>

        <div role="group" aria-label="Filtrar récords" className="flex flex-wrap gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              aria-pressed={filtro === f.id}
              className={`font-cond rounded-sm border px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                filtro === f.id ? "border-chalk-3 bg-raised text-chalk" : "border-line text-chalk-3 hover:text-chalk-2"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="font-cond text-sm text-chalk-3">Cargando récords…</p>
        ) : error ? (
          <p className="rounded-md bg-vivo/15 px-4 py-3 text-sm text-chalk-2">No se pudieron cargar los récords: {error}</p>
        ) : !secciones.length ? (
          <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
            {sede?.nombre ?? "Esta ciudad"} todavía no tiene récords: se escriben a medida que se juega.
          </p>
        ) : (
          secciones.map((s) => (
            <section key={s.id} aria-labelledby={`sec-${s.id}`} className="flex flex-col gap-3">
              <h2 id={`sec-${s.id}`} className="font-cond text-sm text-chalk-2">
                {s.titulo}
              </h2>
              <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
                {s.lista.map((r) => (
                  <Tarjeta key={r.id} record={r} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
};
