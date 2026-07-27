import React, { useMemo, useState } from "react";
import { EDICION_ACTUAL } from "../../config";
import { useEdiciones, useHistoricoEdicion } from "../../hooks/useCatalogo";
import { CarruselEquipos } from "../common/CarruselEquipos";
import type {
  EdicionEquipo,
  FilaClasificacion,
  HistoricoEdicion,
} from "../../types/jugador";

/**
 * Cómo se reparte el cuadro final: el 1º y el 2º entran directos a semifinales,
 * y del 3º al 6º juegan cuartos para acompañarlos. El resto queda fuera.
 */
const PLAZAS_SEMIFINAL = 2;
const PLAZAS_CUARTOS = 6;

/** Con menos equipos no hay cuadro que repartir, así que no se marca ninguna zona. */
const MINIMO_PARA_PLAYOFFS = 7;

type Zona = "semifinal" | "cuartos" | null;

function zonaDe(posicion: number, totalEquipos: number): Zona {
  if (totalEquipos < MINIMO_PARA_PLAYOFFS) return null;
  if (posicion <= PLAZAS_SEMIFINAL) return "semifinal";
  if (posicion <= PLAZAS_CUARTOS) return "cuartos";
  return null;
}

function PuntoEquipo({ color }: { color: string | null }) {
  return (
    <span
      className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
      style={{ backgroundColor: color ?? "#4B5563" }}
    />
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

/** Tabla de posiciones. Oculta las columnas que esa edición nunca registró. */
function TablaPosiciones({
  filas,
  nombreDe,
  colorDe,
  compacta,
}: {
  filas: FilaClasificacion[];
  nombreDe: (slug: string) => string;
  colorDe: (slug: string) => string | null;
  compacta: boolean;
}) {
  // Las ediciones antiguas solo anotaban puntos; no se muestran columnas vacías.
  const hayDetalle = filas.some((f) => f.victorias != null);
  const hayPj = filas.some((f) => f.pj != null);

  if (!filas.length) {
    return <p className="text-sm text-chalk-3">Esta edición no tiene tabla registrada.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="font-cond text-[0.625rem] text-chalk-3">
          <th className="w-6 pb-2 text-left font-bold" />
          <th className="pb-2 text-left font-bold">Equipo</th>
          {hayPj && !compacta && <th className="pb-2 text-right font-bold">PJ</th>}
          {hayDetalle && (
            <th className="pb-2 text-right font-bold">{compacta ? "V·E·D" : "V"}</th>
          )}
          {hayDetalle && !compacta && <th className="pb-2 text-right font-bold">E</th>}
          {hayDetalle && !compacta && <th className="pb-2 text-right font-bold">D</th>}
          <th className="pb-2 text-right font-bold">Pts</th>
        </tr>
      </thead>
      <tbody>
        {filas.map((f) => {
          const zona = zonaDe(f.posicion, filas.length);
          return (
            <tr
              key={f.equipo_slug}
              className={`border-t border-line ${
                zona === "semifinal"
                  ? "bg-raised/60"
                  : zona === "cuartos"
                    ? "bg-raised/25"
                    : ""
              }`}
            >
              <td
                className={`tnum font-data py-2 text-xs ${
                  zona ? "text-chalk" : "text-chalk-3"
                }`}
                style={
                  zona
                    ? {
                        boxShadow: `inset 2px 0 0 var(--color-${
                          zona === "semifinal" ? "chalk" : "chalk-3"
                        })`,
                      }
                    : undefined
                }
              >
                {f.posicion}
              </td>
              <td className="py-2">
                <span className="font-cond flex items-center gap-2 text-chalk">
                  <PuntoEquipo color={colorDe(f.equipo_slug)} />
                  <span className="truncate">{nombreDe(f.equipo_slug)}</span>
                </span>
              </td>
              {hayPj && !compacta && (
                <td className="tnum font-data py-2 text-right text-xs text-chalk-3">{f.pj}</td>
              )}
              {hayDetalle &&
                (compacta ? (
                  <td className="tnum font-data py-2 text-right text-[0.6875rem] whitespace-nowrap text-chalk-3">
                    {f.victorias}·{f.empates}·{f.derrotas ?? "—"}
                  </td>
                ) : (
                  <>
                    <td className="tnum font-data py-2 text-right text-xs text-chalk-2">
                      {f.victorias}
                    </td>
                    <td className="tnum font-data py-2 text-right text-xs text-chalk-2">
                      {f.empates}
                    </td>
                    <td className="tnum font-data py-2 text-right text-xs text-chalk-2">
                      {f.derrotas ?? "—"}
                    </td>
                  </>
                ))}
              <td className="tnum font-data py-2 text-right font-bold text-chalk">
                {f.puntos}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Selector de edición: cada una con su campeón, no un número suelto. */
function SelectorEdicion({
  actual,
  onElegir,
  onCerrar,
}: {
  actual: number;
  onElegir: (n: number) => void;
  onCerrar: () => void;
}) {
  const { ediciones, loading } = useEdiciones();

  return (
    <div className="rounded-md border border-line bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-cond text-xs text-chalk-2">Elegir edición</h2>
        <button
          type="button"
          onClick={onCerrar}
          className="font-cond cursor-pointer text-[0.6875rem] text-chalk-3 hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
        >
          Cerrar
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-chalk-3">Cargando ediciones…</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-2">
          {ediciones.map((e) => (
            <button
              key={e.numero}
              type="button"
              onClick={() => onElegir(e.numero)}
              aria-current={e.numero === actual}
              className={`flex flex-col gap-0.5 rounded-sm border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                e.numero === actual
                  ? "border-chalk-3 bg-raised"
                  : "border-line hover:bg-raised/60"
              }`}
            >
              <span className="font-cond text-sm text-chalk">Edición {e.numero}</span>
              <span className="flex min-w-0 items-center gap-1.5 text-[0.6875rem] text-chalk-3">
                {e.estado === "activa" ? (
                  `En juego${e.tematica ? ` · ${e.tematica}` : ""}`
                ) : e.campeon_nombre ? (
                  <>
                    <PuntoEquipo color={e.campeon_color ?? null} />
                    <span className="truncate">{e.campeon_nombre}</span>
                  </>
                ) : (
                  "Sin campeón registrado"
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Cabecera({
  historico,
  onAbrirSelector,
}: {
  historico: HistoricoEdicion;
  onAbrirSelector: () => void;
}) {
  const { edicion, final, equipos } = historico;
  const nombre = (slug: string | null) =>
    equipos.find((e) => e.slug === slug)?.nombre ?? slug?.replace(/-/g, " ") ?? "—";

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-md border border-line bg-surface p-4">
      <div
        className="grid size-12 shrink-0 place-items-center bg-chalk-3 p-[2px]"
        style={{ clipPath: "polygon(50% 0,100% 22%,100% 72%,50% 100%,0 72%,0 22%)" }}
      >
        <span
          className="font-cond tnum grid size-full place-items-center bg-surface text-sm text-chalk-2"
          style={{ clipPath: "polygon(50% 0,100% 22%,100% 72%,50% 100%,0 72%,0 22%)" }}
        >
          {edicion.numero}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="font-cond text-xl text-chalk">
          Edición {edicion.numero}
          {edicion.tematica ? ` · ${edicion.tematica}` : ""}
        </h1>
        <p className="text-[0.6875rem] text-chalk-3">
          {edicion.estado === "activa"
            ? "En juego"
            : final
              ? `Campeón ${nombre(edicion.campeon_slug)} · subcampeón ${nombre(edicion.subcampeon_slug)}`
              : "Sin final registrada"}
          {equipos.length ? ` · ${equipos.length} equipos` : ""}
          {historico.jornadas.length
            ? ` · ${historico.jornadas.length} ${historico.jornadas.length === 1 ? "jornada" : "jornadas"}`
            : ""}
        </p>
      </div>

      <button
        type="button"
        onClick={onAbrirSelector}
        className="font-cond cursor-pointer rounded-sm border border-line px-3 py-2 text-xs text-chalk-2 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
      >
        Cambiar edición
      </button>
    </div>
  );
}

export const Clasificacion: React.FC = () => {
  const [edicionElegida, setEdicionElegida] = useState(EDICION_ACTUAL);
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const { historico, loading, error } = useHistoricoEdicion(edicionElegida);

  const porSlug = useMemo(() => {
    const mapa = new Map<string, EdicionEquipo>();
    for (const e of historico?.equipos ?? []) mapa.set(e.slug, e);
    return mapa;
  }, [historico]);

  const nombreDe = (slug: string) => porSlug.get(slug)?.nombre ?? slug.replace(/-/g, " ");
  const colorDe = (slug: string) => porSlug.get(slug)?.color_hex ?? null;

  const maxGoles = historico?.goleadores[0]?.goles ?? 0;

  return (
    <div className="min-h-full bg-ink text-chalk">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
        {error && (
          <p className="rounded-md bg-vivo/15 px-4 py-3 text-sm text-chalk-2">
            No se pudo cargar la edición: {error}
          </p>
        )}

        {loading && !historico && (
          <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
            Cargando edición…
          </p>
        )}

        {historico && (
          <>
            <Cabecera
              historico={historico}
              onAbrirSelector={() => setSelectorAbierto((v) => !v)}
            />

            {selectorAbierto && (
              <SelectorEdicion
                actual={edicionElegida}
                onElegir={(n) => {
                  setEdicionElegida(n);
                  setSelectorAbierto(false);
                }}
                onCerrar={() => setSelectorAbierto(false)}
              />
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-start">
              <div className="flex flex-col gap-4">
                <Panel titulo="Tabla general">
                  <div className="lg:hidden">
                    <TablaPosiciones
                      filas={historico.clasificacion}
                      nombreDe={nombreDe}
                      colorDe={colorDe}
                      compacta
                    />
                  </div>
                  <div className="hidden lg:block">
                    <TablaPosiciones
                      filas={historico.clasificacion}
                      nombreDe={nombreDe}
                      colorDe={colorDe}
                      compacta={false}
                    />
                  </div>

                  {historico.clasificacion.length >= MINIMO_PARA_PLAYOFFS && (
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3">
                      <li className="flex items-center gap-2 text-[0.6875rem] text-chalk-3">
                        <span className="h-3 w-0.5 shrink-0 bg-chalk" />
                        1º y 2º · a semifinales
                      </li>
                      <li className="flex items-center gap-2 text-[0.6875rem] text-chalk-3">
                        <span className="h-3 w-0.5 shrink-0 bg-chalk-3" />
                        3º a 6º · a cuartos
                      </li>
                    </ul>
                  )}
                </Panel>

                {historico.jornadas.length > 0 && (
                  <Panel titulo="Jornadas" nota={`${historico.jornadas.length}`}>
                    {historico.jornadas.map(({ jornada, resultados }) => (
                      <details
                        key={jornada}
                        className="border-t border-line first:border-t-0"
                      >
                        <summary className="font-cond flex cursor-pointer list-none items-center justify-between gap-3 py-2.5 text-sm text-chalk [&::-webkit-details-marker]:hidden">
                          <span>
                            Jornada {jornada}
                            {resultados[0] && (
                              <span className="text-chalk-3">
                                {" "}
                                · ganó {nombreDe(resultados[0].equipo_slug)}
                              </span>
                            )}
                          </span>
                          <span aria-hidden className="text-chalk-3">
                            +
                          </span>
                        </summary>
                        <div className="pb-3">
                          <TablaPosiciones
                            filas={resultados}
                            nombreDe={nombreDe}
                            colorDe={colorDe}
                            compacta
                          />
                        </div>
                      </details>
                    ))}
                  </Panel>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <CarruselEquipos
                  edicion={edicionElegida}
                  clasificacion={historico.clasificacion}
                  arqueros={historico.arqueros}
                />

                {historico.final && (
                  <Panel titulo="La final">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-sm bg-raised p-4">
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="font-cond truncate text-chalk">
                          {historico.final.equipo1_nombre}
                        </span>
                        <span className="text-[0.625rem] text-chalk-3">
                          {historico.final.resultado === "1" ? "Campeón" : "Subcampeón"}
                        </span>
                      </div>
                      <span className="tnum font-data text-2xl leading-none font-bold tracking-tight text-chalk">
                        {historico.final.goles1}–{historico.final.goles2}
                      </span>
                      <div className="flex min-w-0 flex-col items-end gap-1 text-right">
                        <span className="font-cond truncate text-chalk">
                          {historico.final.equipo2_nombre}
                        </span>
                        <span className="text-[0.625rem] text-chalk-3">
                          {historico.final.resultado === "2" ? "Campeón" : "Subcampeón"}
                        </span>
                      </div>
                    </div>
                    {historico.final.nota_marcador && (
                      <p className="mt-2 text-[0.6875rem] text-chalk-3">
                        {historico.final.nota_marcador}
                      </p>
                    )}
                  </Panel>
                )}

                {historico.goleadores.length > 0 && (
                  <Panel titulo="Goleadores" nota={`${historico.goleadores.length}`}>
                    <ul>
                      {historico.goleadores.slice(0, 10).map((g) => (
                        <li
                          key={g.jugador_nombre}
                          className="flex items-center gap-2.5 border-t border-line py-2 first:border-t-0"
                        >
                          <span className="tnum font-data w-5 text-xs text-chalk-3">
                            {g.posicion}
                          </span>
                          <span className="font-cond min-w-0 flex-1 truncate text-chalk">
                            {g.jugador_nombre}
                          </span>
                          {/* Barra proporcional al líder: se compara sin leer cada cifra */}
                          <span className="h-[3px] w-12 shrink-0 overflow-hidden rounded-full bg-line">
                            <span
                              className="block h-full bg-chalk-2"
                              style={{
                                width: maxGoles ? `${(g.goles / maxGoles) * 100}%` : "0%",
                              }}
                            />
                          </span>
                          <span className="tnum font-data font-bold text-chalk">{g.goles}</span>
                        </li>
                      ))}
                    </ul>
                  </Panel>
                )}

                {historico.arqueros.length > 0 && (
                  <Panel titulo="Arqueros" nota="Menos recibidos">
                    <ul>
                      {historico.arqueros.slice(0, 10).map((a) => (
                        <li
                          key={a.jugador_nombre}
                          className="flex items-center gap-2.5 border-t border-line py-2 first:border-t-0"
                        >
                          <PuntoEquipo
                            color={a.equipo_slug ? colorDe(a.equipo_slug) : null}
                          />
                          <span className="font-cond min-w-0 flex-1 truncate text-chalk">
                            {a.jugador_nombre}
                          </span>
                          <span className="tnum font-data font-bold text-chalk">
                            {a.goles_recibidos}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Panel>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
