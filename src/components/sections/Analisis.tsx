import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  mmss,
  type AnalisisEquipo,
  type EstadisticaJugador,
  type ResumenJornada,
  type Resultado,
} from "../../types/analisis";

/**
 * Piezas de Clasificación que salen de leer los partidos cruce a cruce:
 * forma, evolución, resumen de jornada, rachas y jugadores.
 *
 * Ninguna usa color propio. El único acento de la app es el color de camiseta
 * de cada equipo; lo demás —victoria, empate, derrota— se distingue por
 * relleno y por la letra, que es lo que se lee igual con cualquier vista.
 */

type NombreDe = (slug: string) => string;
type ColorDe = (slug: string) => string | null;

const FOCO =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk";

// ── Forma ─────────────────────────────────────────────────────────────────────

const ESTILO_RESULTADO: Record<Resultado, string> = {
  V: "bg-chalk text-ink",
  E: "bg-line text-chalk-2",
  D: "border border-line text-chalk-3",
};

const NOMBRE_RESULTADO: Record<Resultado, string> = {
  V: "victoria",
  E: "empate",
  D: "derrota",
};

/** Los últimos cruces de un equipo, del más antiguo al más reciente. */
export function Forma({
  forma,
  nombreDe,
}: {
  forma: AnalisisEquipo["forma"];
  nombreDe: NombreDe;
}) {
  return (
    <span
      className="inline-flex gap-0.5"
      aria-label={`Últimos cruces: ${forma.map((f) => NOMBRE_RESULTADO[f.resultado]).join(", ")}`}
    >
      {forma.map((f, i) => (
        <span
          key={i}
          title={`${NOMBRE_RESULTADO[f.resultado]} contra ${nombreDe(f.rivalId)} · J${f.jornada}`}
          className={`font-data grid size-3.5 place-items-center rounded-[2px] text-[0.5625rem] leading-none font-bold ${ESTILO_RESULTADO[f.resultado]}`}
        >
          {f.resultado}
        </span>
      ))}
    </span>
  );
}

// ── Evolución ─────────────────────────────────────────────────────────────────

/**
 * Puesto de cada equipo al cerrar cada jornada.
 *
 * Nueve colores de camiseta a la vez no se distinguen —hay rojos, granates y
 * naranjas en la misma liga—, así que solo uno va en su color y el resto en
 * gris: el que se elige en la lista, que hace también de leyenda.
 */
export function Evolucion({
  equipos,
  nombreDe,
  colorDe,
  inicial,
}: {
  equipos: AnalisisEquipo[];
  nombreDe: NombreDe;
  colorDe: ColorDe;
  inicial: string | null;
}) {
  const [elegido, setElegido] = useState<string | null>(inicial);
  const [punto, setPunto] = useState<{ equipoId: string; jornada: number } | null>(null);

  // Se dibuja en píxeles del contenedor, no en un viewBox que escale: si no,
  // las cifras del eje crecen con el ancho del panel.
  const contenedor = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(320);
  useEffect(() => {
    const el = contenedor.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setW(Math.max(240, Math.round(e.contentRect.width))));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const jornadas = useMemo(
    () =>
      [...new Set(equipos.flatMap((e) => e.evolucion.map((p) => p.jornada)))].sort(
        (a, b) => a - b
      ),
    [equipos]
  );
  const n = equipos.length;

  if (jornadas.length < 2 || n < 2) return null;

  const H = Math.max(160, n * 22);
  const M = { top: 10, right: 16, bottom: 22, left: 24 };
  const x = (j: number) =>
    M.left + ((jornadas.indexOf(j) / (jornadas.length - 1)) * (W - M.left - M.right));
  const y = (pos: number) => M.top + ((pos - 1) / Math.max(1, n - 1)) * (H - M.top - M.bottom);

  const ruta = (e: AnalisisEquipo) =>
    e.evolucion.map((p, i) => `${i ? "L" : "M"}${x(p.jornada)},${y(p.posicion)}`).join(" ");

  const actual = elegido ? equipos.find((e) => e.equipoId === elegido) : null;
  const resaltado = actual ? colorDe(actual.equipoId) ?? "#f6f2ee" : null;

  const enFoco = punto
    ? (() => {
        const e = equipos.find((x) => x.equipoId === punto.equipoId);
        const p = e?.evolucion.find((x) => x.jornada === punto.jornada);
        return e && p ? { e, p } : null;
      })()
    : null;

  // Orden de la última jornada: la lista se lee como la tabla.
  const ordenados = [...equipos].sort(
    (a, b) =>
      (a.evolucion[a.evolucion.length - 1]?.posicion ?? 99) -
      (b.evolucion[b.evolucion.length - 1]?.posicion ?? 99)
  );

  return (
    <div ref={contenedor} className="flex flex-col gap-3">
      <p className="font-data tnum min-h-4 text-[0.6875rem] text-chalk-2" aria-live="polite">
        {enFoco
          ? `${nombreDe(enFoco.e.equipoId)} · J${enFoco.p.jornada} · ${enFoco.p.posicion}º · ${enFoco.p.puntos} pts`
          : actual
            ? `${nombreDe(actual.equipoId)} · ${actual.evolucion.map((p) => `${p.posicion}º`).join(" → ")}`
            : "Toca un equipo para seguir su recorrido"}
      </p>

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-label="Puesto de cada equipo al cerrar cada jornada"
        onMouseLeave={() => setPunto(null)}
      >
        {/* Rejilla: solo las jornadas, recesiva */}
        {jornadas.map((j) => (
          <g key={j}>
            <line x1={x(j)} x2={x(j)} y1={M.top} y2={H - M.bottom} stroke="#3a322e" strokeWidth={1} />
            <text
              x={x(j)}
              y={H - 6}
              textAnchor="middle"
              className="font-data fill-chalk-3 text-[10px]"
            >
              J{j}
            </text>
          </g>
        ))}
        {Array.from({ length: n }, (_, i) => i + 1).map((pos) => (
          <text
            key={pos}
            x={M.left - 8}
            y={y(pos) + 3}
            textAnchor="end"
            className="font-data fill-chalk-3 text-[10px]"
          >
            {pos}
          </text>
        ))}

        {/* El resto, en gris y debajo */}
        {equipos
          .filter((e) => e.equipoId !== elegido)
          .map((e) => (
            <path
              key={e.equipoId}
              d={ruta(e)}
              fill="none"
              stroke="#5a504a"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="cursor-pointer"
              onClick={() => setElegido(e.equipoId)}
            />
          ))}

        {actual && resaltado && (
          <g>
            {/* Un halo de tiza debajo: hay camisetas casi negras que sobre este
                fondo no se verían. */}
            <path d={ruta(actual)} fill="none" stroke="#f6f2ee" strokeOpacity={0.25} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" />
            <path d={ruta(actual)} fill="none" stroke={resaltado} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {actual.evolucion.map((p) => (
              <circle
                key={p.jornada}
                cx={x(p.jornada)}
                cy={y(p.posicion)}
                r={4}
                fill={resaltado}
                stroke="#1d1917"
                strokeWidth={2}
              />
            ))}
          </g>
        )}

        {/* Zonas de contacto más grandes que la marca */}
        {equipos.flatMap((e) =>
          e.evolucion.map((p) => (
            <circle
              key={`${e.equipoId}-${p.jornada}`}
              cx={x(p.jornada)}
              cy={y(p.posicion)}
              r={9}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setPunto({ equipoId: e.equipoId, jornada: p.jornada })}
              onClick={() => {
                setElegido(e.equipoId);
                setPunto({ equipoId: e.equipoId, jornada: p.jornada });
              }}
            />
          ))
        )}
      </svg>

      <div className="flex flex-wrap gap-1.5">
        {ordenados.map((e) => {
          const activo = e.equipoId === elegido;
          return (
            <button
              key={e.equipoId}
              type="button"
              aria-pressed={activo}
              onClick={() => setElegido(activo ? null : e.equipoId)}
              className={`font-cond flex cursor-pointer items-center gap-1.5 rounded-sm border px-2 py-1 text-[0.6875rem] transition-colors ${FOCO} ${
                activo ? "border-chalk-3 bg-raised text-chalk" : "border-line text-chalk-3 hover:text-chalk"
              }`}
            >
              <span
                className="size-2 rounded-full ring-1 ring-chalk-3"
                style={{ backgroundColor: colorDe(e.equipoId) ?? "#4B5563" }}
              />
              {nombreDe(e.equipoId)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Resumen de jornada ────────────────────────────────────────────────────────

function NombreJugador({ slug, nombre }: { slug: string | null; nombre: string }) {
  if (!slug) return <>{nombre}</>;
  return (
    <Link
      to={`/jugador/${slug}`}
      className={`underline decoration-line underline-offset-2 hover:decoration-chalk-3 ${FOCO}`}
    >
      {nombre}
    </Link>
  );
}

function textoResumen(r: ResumenJornada, nombreDe: NombreDe, etiquetaEdicion: string): string {
  const lineas = [`⚽ ${etiquetaEdicion} · Jornada ${r.jornada}`, ""];
  const top = r.tabla.slice(0, 3);
  if (top.length) {
    lineas.push("Los que más sumaron:");
    top.forEach((f, i) => lineas.push(`${i + 1}. ${nombreDe(f.equipoId)} · ${f.puntos} pts`));
    lineas.push("");
  }
  if (r.goleadores.length) {
    lineas.push(
      `Goleador del día: ${r.goleadores.map((g) => g.nombre).join(", ")} (${r.goleadores[0].goles})`
    );
  }
  if (r.golMasRapido) {
    lineas.push(
      `Gol más rápido: ${r.golMasRapido.nombre}, ${mmss(r.golMasRapido.segundos)} contra ${nombreDe(r.golMasRapido.vsEquipoId)}`
    );
  }
  if (r.vallaMenosVencida) {
    lineas.push(
      `Valla menos vencida: ${nombreDe(r.vallaMenosVencida.equipoId)}, ${r.vallaMenosVencida.recibidos} en ${r.vallaMenosVencida.cruces} cruces`
    );
  }
  lineas.push("", `${r.goles} goles · ${r.empates} empates · ${r.amarillas} amarillas${r.rojas ? ` · ${r.rojas} rojas` : ""}`);
  return lineas.join("\n");
}

function Dato({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 rounded-sm bg-raised px-3 py-2">
      <span className="font-cond text-[0.625rem] text-chalk-3">{titulo}</span>
      <span className="min-w-0 text-sm text-chalk">{children}</span>
    </div>
  );
}

export function ResumenDeJornada({
  resumen,
  nombreDe,
  etiquetaEdicion,
}: {
  resumen: ResumenJornada;
  nombreDe: NombreDe;
  etiquetaEdicion: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const r = resumen;

  async function compartir() {
    const texto = textoResumen(r, nombreDe, etiquetaEdicion);
    // En el celular se abre el menú de compartir, que ya ofrece WhatsApp; en
    // escritorio se va directo a WhatsApp Web.
    if (navigator.share) {
      try {
        await navigator.share({ text: texto });
        return;
      } catch {
        // Cancelado: no hay nada que hacer.
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* sin portapapeles: queda el enlace */
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  }

  return (
    <div className="flex flex-col gap-2 pb-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Dato titulo="Goleador del día">
          {r.goleadores.length ? (
            <>
              {r.goleadores.map((g, i) => (
                <span key={`${g.nombre}-${g.equipoId}`}>
                  {i > 0 && ", "}
                  <NombreJugador slug={g.slug} nombre={g.nombre} />
                </span>
              ))}{" "}
              <span className="font-data tnum text-chalk-3">· {r.goleadores[0].goles}</span>
            </>
          ) : (
            "—"
          )}
        </Dato>
        <Dato titulo="Gol más rápido">
          {r.golMasRapido ? (
            <>
              <NombreJugador slug={r.golMasRapido.slug} nombre={r.golMasRapido.nombre} />{" "}
              <span className="font-data tnum text-chalk-3">· {mmss(r.golMasRapido.segundos)}</span>
            </>
          ) : (
            <span className="text-chalk-3">Sin reloj esa jornada</span>
          )}
        </Dato>
        <Dato titulo="Valla menos vencida">
          {r.vallaMenosVencida ? (
            <>
              {nombreDe(r.vallaMenosVencida.equipoId)}{" "}
              <span className="font-data tnum text-chalk-3">
                · {r.vallaMenosVencida.recibidos} en {r.vallaMenosVencida.cruces}
              </span>
            </>
          ) : (
            "—"
          )}
        </Dato>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-data tnum text-[0.6875rem] text-chalk-3">
          {r.goles} goles · {r.empates} empates · {r.cruces} cruces · {r.amarillas} amarillas
          {r.rojas ? ` · ${r.rojas} rojas` : ""}
        </p>
        <button
          type="button"
          onClick={compartir}
          className={`font-cond cursor-pointer rounded-sm border border-line px-2.5 py-1 text-[0.6875rem] text-chalk-2 transition-colors hover:text-chalk ${FOCO}`}
        >
          {copiado ? "Copiado" : "Compartir"}
        </button>
      </div>
    </div>
  );
}

// ── Rachas y ritmo ────────────────────────────────────────────────────────────

export function RachasYRitmo({
  equipos,
  orden,
  nombreDe,
  colorDe,
}: {
  equipos: AnalisisEquipo[];
  /** Slugs en el orden de la tabla. */
  orden: string[];
  nombreDe: NombreDe;
  colorDe: ColorDe;
}) {
  const filas = [...equipos].sort((a, b) => orden.indexOf(a.equipoId) - orden.indexOf(b.equipoId));

  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="font-cond text-[0.625rem] text-chalk-3">
            <th className="pb-2 text-left font-bold">Equipo</th>
            <th className="pb-2 text-right font-bold" title="Resultado que se repite en los últimos cruces">
              Racha
            </th>
            <th className="pb-2 text-right font-bold" title="Victorias seguidas, su mejor marca">
              Mejor
            </th>
            <th className="hidden pb-2 text-right font-bold sm:table-cell" title="Cruces seguidos sin perder, su mejor marca">
              Invicto
            </th>
            <th className="pb-2 text-right font-bold" title="Tiempo medio que tarda en ganar un cruce">
              Marca en
            </th>
            <th className="hidden pb-2 text-right font-bold sm:table-cell" title="Tiempo medio que tarda en perder un cruce">
              Recibe en
            </th>
          </tr>
        </thead>
        <tbody>
          {filas.map((e) => (
            <tr key={e.equipoId} className="border-t border-line">
              <td className="py-2">
                <span className="font-cond flex min-w-0 items-center gap-2 text-chalk">
                  <span
                    className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
                    style={{ backgroundColor: colorDe(e.equipoId) ?? "#4B5563" }}
                  />
                  <span className="truncate">{nombreDe(e.equipoId)}</span>
                </span>
              </td>
              <td className="font-data tnum py-2 text-right text-xs text-chalk">
                {e.rachaActual ? `${e.rachaActual.cruces}${e.rachaActual.resultado}` : "—"}
              </td>
              <td className="font-data tnum py-2 text-right text-xs text-chalk-2">
                {e.mejorRachaVictorias}V
              </td>
              <td className="font-data tnum hidden py-2 text-right text-xs text-chalk-2 sm:table-cell">
                {e.mejorRachaInvicto}
              </td>
              <td className="font-data tnum py-2 text-right text-xs text-chalk-2">
                {mmss(e.tiempoMedioGol)}
              </td>
              <td className="font-data tnum hidden py-2 text-right text-xs text-chalk-2 sm:table-cell">
                {mmss(e.tiempoMedioRecibido)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Jugadores ─────────────────────────────────────────────────────────────────

type OrdenJugadores = "goles" | "tarjetas";

const ORDENES: { id: OrdenJugadores; label: string }[] = [
  { id: "goles", label: "Goles" },
  { id: "tarjetas", label: "Tarjetas" },
];

function ordenar(js: EstadisticaJugador[], orden: OrdenJugadores): EstadisticaJugador[] {
  const copia = [...js];
  switch (orden) {
    case "goles":
      return copia.filter((j) => j.goles > 0).sort((a, b) => b.goles - a.goles || a.partidos - b.partidos);
    case "tarjetas":
      return copia
        .filter((j) => j.amarillas + j.rojas > 0)
        .sort((a, b) => b.rojas * 2 + b.amarillas - (a.rojas * 2 + a.amarillas));
  }
}

function cifra(j: EstadisticaJugador, orden: OrdenJugadores): string {
  switch (orden) {
    case "goles":
      return String(j.goles);
    case "tarjetas":
      return `${j.amarillas}A${j.rojas ? ` ${j.rojas}R` : ""}`;
  }
}

function detalle(j: EstadisticaJugador, orden: OrdenJugadores): string {
  switch (orden) {
    case "goles":
      return `${j.partidos} PJ`;
    case "tarjetas":
      return "";
  }
}

export function JugadoresEdicion({
  jugadores,
  colorDe,
}: {
  jugadores: EstadisticaJugador[];
  colorDe: ColorDe;
}) {
  const [orden, setOrden] = useState<OrdenJugadores>("goles");
  const [todos, setTodos] = useState(false);
  const lista = ordenar(jugadores, orden);
  const visibles = todos ? lista : lista.slice(0, 10);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5" role="tablist">
        {ORDENES.map((o) => (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={orden === o.id}
            onClick={() => setOrden(o.id)}
            className={`font-cond cursor-pointer rounded-sm border px-2 py-1 text-[0.6875rem] transition-colors ${FOCO} ${
              orden === o.id ? "border-chalk-3 bg-raised text-chalk" : "border-line text-chalk-3 hover:text-chalk"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="text-sm text-chalk-3">Todavía no hay datos suficientes.</p>
      ) : (
        <ol>
          {visibles.map((j, i) => (
            <li
              key={`${j.slug ?? j.nombre}-${j.equipoId}`}
              className="flex items-center gap-2.5 border-t border-line py-2 first:border-t-0"
            >
              <span className="font-data tnum w-5 text-xs text-chalk-3">{i + 1}</span>
              <span
                className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
                style={{ backgroundColor: colorDe(j.equipoId) ?? "#4B5563" }}
                title={j.equipoNombre}
              />
              <span className="font-cond min-w-0 flex-1 truncate text-chalk">
                <NombreJugador slug={j.slug} nombre={j.nombre} />
              </span>
              <span className="font-data tnum hidden text-[0.6875rem] text-chalk-3 sm:inline">
                {detalle(j, orden)}
              </span>
              <span className="font-data tnum font-bold text-chalk">{cifra(j, orden)}</span>
            </li>
          ))}
        </ol>
      )}

      {lista.length > 10 && (
        <button
          type="button"
          onClick={() => setTodos((v) => !v)}
          className={`font-cond cursor-pointer self-start text-[0.6875rem] text-chalk-3 hover:text-chalk ${FOCO}`}
        >
          {todos ? "Ver menos" : `Ver los ${lista.length}`}
        </button>
      )}
    </div>
  );
}
