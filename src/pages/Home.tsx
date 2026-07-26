import React from "react";
import { useNavigate } from "react-router-dom";
import { EDICION_ACTUAL } from "../config";
import { useInicio } from "../hooks/useInicio";
import { useEquiposEdicion } from "../hooks/useCatalogo";
import { Marcador } from "../components/Home/Marcador";
import { PATROCINADORES } from "../constants/PATROCINADORES";
import type { Arquero, Goleador, Standing } from "../lib/api";

/**
 * Punto de color de camiseta. El anillo lo mantiene visible cuando el color del
 * equipo es casi negro (Newcastle, 1.17:1 contra el fondo) o muy oscuro.
 * El color nunca es el único canal: siempre va junto al nombre.
 */
function PuntoEquipo({ color }: { color: string }) {
  return (
    <span
      className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
      style={{ backgroundColor: color }}
    />
  );
}

function Panel({
  titulo,
  accion,
  onAccion,
  children,
  className = "",
}: {
  titulo: string;
  accion?: string;
  onAccion?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-md border border-line bg-surface p-4 ${className}`}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-cond text-xs text-chalk-2">{titulo}</h2>
        {accion &&
          (onAccion ? (
            <button
              type="button"
              onClick={onAccion}
              className="font-cond cursor-pointer text-[0.6875rem] text-chalk-3 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
            >
              {accion}
            </button>
          ) : (
            <span className="font-cond text-[0.6875rem] text-chalk-3">{accion}</span>
          ))}
      </div>
      {children}
    </section>
  );
}

function Tabla({
  standings,
  colorDe,
  limite,
}: {
  standings: Standing[];
  colorDe: (id: string) => string;
  limite?: number;
}) {
  const filas = limite ? standings.slice(0, limite) : standings;

  if (!filas.length) {
    return <p className="text-sm text-chalk-3">Todavía no hay partidos jugados.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="font-cond text-[0.625rem] text-chalk-3">
          <th className="w-6 pb-2 text-left font-bold" />
          <th className="pb-2 text-left font-bold">Equipo</th>
          {!limite && <th className="pb-2 text-right font-bold">V·E·D</th>}
          <th className="pb-2 text-right font-bold">Pts</th>
        </tr>
      </thead>
      <tbody>
        {filas.map((s, i) => (
          <tr key={s.equipoId} className="border-t border-line">
            <td className="tnum font-data py-2 text-xs text-chalk-3">{i + 1}</td>
            <td className="py-2">
              <span className="font-cond flex items-center gap-2 text-chalk">
                <PuntoEquipo color={colorDe(s.equipoId)} />
                <span className="truncate">{s.nombre}</span>
              </span>
            </td>
            {!limite && (
              <td className="tnum font-data py-2 text-right text-[0.6875rem] whitespace-nowrap text-chalk-3">
                {s.victorias}·{s.empates}·{s.derrotas}
              </td>
            )}
            <td className="tnum font-data py-2 text-right font-bold text-chalk">
              {s.puntos}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Ranking({
  filas,
  colorDe,
  vacio,
}: {
  filas: { id: string; nombre: string; equipoId: string; valor: number }[];
  colorDe: (id: string) => string;
  vacio: string;
}) {
  if (!filas.length) return <p className="text-sm text-chalk-3">{vacio}</p>;

  return (
    <ul>
      {filas.map((f) => (
        <li
          key={f.id}
          className="flex items-center gap-2.5 border-t border-line py-2 first:border-t-0"
        >
          <PuntoEquipo color={colorDe(f.equipoId)} />
          <span className="font-cond min-w-0 flex-1 truncate text-chalk">
            {f.nombre}
          </span>
          <span className="tnum font-data font-bold text-chalk">{f.valor}</span>
        </li>
      ))}
    </ul>
  );
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    partidoDestacado,
    standings,
    goleadores,
    arqueros,
    campeonVigente,
    resumenLiga,
    loading,
    error,
  } = useInicio();
  const { locales: catalogo, colorDe } = useEquiposEdicion(EDICION_ACTUAL);

  const topGoleadores = goleadores.slice(0, 3).map((g: Goleador) => ({
    id: `${g.jugador}-${g.equipoId}`,
    nombre: g.jugador,
    equipoId: g.equipoId,
    valor: g.goles,
  }));

  const topArqueros = arqueros.slice(0, 3).map((a: Arquero) => ({
    id: `${a.arquero}-${a.equipoId}`,
    nombre: a.arquero,
    equipoId: a.equipoId,
    valor: a.golesRecibidos,
  }));

  return (
    <div className="min-h-full bg-ink text-chalk">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4">
        {error && (
          <p className="rounded-md bg-vivo/15 px-4 py-3 text-sm text-chalk-2">
            No se pudieron cargar los datos: {error}
          </p>
        )}

        {/* Lo que se juega ahora ocupa el ancho: es el motivo por el que se abre la app */}
        {partidoDestacado ? (
          <div className="rounded-md border border-line bg-surface p-4 md:px-6 md:py-5">
            <Marcador
              partido={partidoDestacado}
              catalogo={catalogo}
              colorDe={colorDe}
            />
          </div>
        ) : (
          <div className="rounded-md border border-line bg-surface px-4 py-5">
            <p className="font-cond text-sm text-chalk-2">
              {loading ? "Buscando partidos…" : "No hay partidos en curso"}
            </p>
            {!loading && (
              <p className="mt-1 text-sm text-chalk-3">
                Cuando arranque una jornada, el marcador aparece aquí.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr] lg:items-start">
          <div className="flex flex-col gap-4">
            <Panel
              titulo={`Clasificación · Edición ${EDICION_ACTUAL}`}
              accion="Ver todo"
              onAccion={() => navigate("/clasificacion")}
            >
              {/* Móvil: solo la cabeza de la tabla. Pantalla ancha: entera. */}
              <div className="lg:hidden">
                <Tabla standings={standings} colorDe={colorDe} limite={4} />
              </div>
              <div className="hidden lg:block">
                <Tabla standings={standings} colorDe={colorDe} />
              </div>
            </Panel>

            <Panel titulo="La liga" accion="Historia" onAccion={() => navigate("/historia")}>
              <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                  { n: resumenLiga.ediciones, l: "Ediciones" },
                  { n: resumenLiga.jugadores, l: "Jugadores" },
                  { n: resumenLiga.finales, l: "Finales" },
                ].map((f) => (
                  <div key={f.l}>
                    <div className="tnum font-data text-2xl leading-none font-bold tracking-tight text-chalk">
                      {f.n}
                    </div>
                    <div className="font-cond mt-1 text-[0.625rem] text-chalk-3">
                      {f.l}
                    </div>
                  </div>
                ))}
              </div>

              {campeonVigente && (
                <div className="flex items-center gap-3 border-t border-line pt-3">
                  {/* El escudo del logo. Un borde normal se recortaría con el
                      clip-path, así que el contorno lo hace el propio relleno. */}
                  <div
                    className="grid size-11 shrink-0 place-items-center bg-chalk-3 p-[2px]"
                    style={{
                      clipPath:
                        "polygon(50% 0, 100% 22%, 100% 72%, 50% 100%, 0 72%, 0 22%)",
                    }}
                  >
                    <span
                      className="font-cond tnum grid size-full place-items-center bg-surface text-[0.6875rem] text-chalk-2"
                      style={{
                        clipPath:
                          "polygon(50% 0, 100% 22%, 100% 72%, 50% 100%, 0 72%, 0 22%)",
                      }}
                    >
                      {campeonVigente.edicion}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-cond text-base text-chalk">
                      {campeonVigente.campeon}, campeón vigente
                    </div>
                    <div className="tnum font-data text-[0.6875rem] text-chalk-3">
                      Final edición {campeonVigente.edicion} ·{" "}
                      {campeonVigente.golesCampeon}–{campeonVigente.golesSubcampeon} a{" "}
                      {campeonVigente.subcampeon}
                    </div>
                  </div>
                </div>
              )}
            </Panel>
          </div>

          <div className="flex flex-col gap-4">
            <Panel titulo="Bota de oro" accion="En juego">
              <Ranking
                filas={topGoleadores}
                colorDe={colorDe}
                vacio="Sin goles todavía en esta edición."
              />
            </Panel>

            <Panel titulo="Guante de oro" accion="En juego">
              <Ranking
                filas={topArqueros}
                colorDe={colorDe}
                vacio="Sin partidos jugados todavía."
              />
            </Panel>
          </div>
        </div>

        <section className="rounded-md border border-line p-4">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="font-cond text-xs text-chalk-2">Patrocinan la liga</h2>
            <button
              type="button"
              onClick={() => navigate("/patrocinadores")}
              className="font-cond cursor-pointer text-[0.6875rem] text-chalk-3 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
            >
              Ver todos
            </button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {PATROCINADORES.map((p) => (
              <li
                key={p.id}
                className="font-cond rounded-sm border border-line px-2 py-1 text-[0.6875rem] text-chalk-2"
              >
                {p.nombre}
              </li>
            ))}
          </ul>
        </section>

        {/* La liga está llena, pero el grupo de reservas sigue abierto */}
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-raised px-4 py-3">
          <div className="min-w-0">
            <div className="font-cond text-sm text-chalk">
              ¿Quieres jugar en la Liga PPT?
            </div>
            <p className="text-[0.6875rem] text-chalk-3">
              Apúntate al grupo de reservas y te avisamos cuando haya cupo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/participa-en-la-liga-ppt")}
            className="font-cond cursor-pointer rounded-sm bg-chalk px-3 py-2 text-xs text-ink transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
          >
            Inscribirme
          </button>
        </section>
      </div>
    </div>
  );
};
