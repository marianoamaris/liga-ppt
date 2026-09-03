import React from "react";
import type { PartidoPlayoff, RondaPlayoff } from "../../types/jugador";
import { IconoCuartos, IconoDesempate, IconoFinal, IconoSemifinal } from "./iconos";

/**
 * Cuadro final de una edición: cuartos → semifinales → final.
 *
 * Las llaves vienen ya resueltas de la API (`/historico/:numero`), que las
 * deriva de los partidos de playoff. Aquí solo se dibujan, así que la misma
 * pieza sirve para el cuadro terminado del histórico y para el que se está
 * jugando en vivo: una llave en curso llega con `en_juego` y sin ganador.
 */

const RONDAS: { key: RondaPlayoff; titulo: string; Icono: React.FC<{ className?: string }> }[] = [
  { key: "cuartos", titulo: "Cuartos", Icono: IconoCuartos },
  { key: "semifinal", titulo: "Semifinales", Icono: IconoSemifinal },
  { key: "final", titulo: "Final", Icono: IconoFinal },
];

/**
 * En móvil las rondas van una debajo de otra; el cuadro solo se abre en
 * columnas cuando hay ancho. Escritas enteras porque Tailwind lee las clases
 * del código, no las compone en tiempo de ejecución.
 */
const COLUMNAS: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

type ColorDe = (slug: string) => string | null;
type NombreDe = (slug: string) => string;

function LadoLlave({
  slug,
  nombre,
  goles,
  ganador,
  decidida,
  colorDe,
}: {
  slug: string;
  nombre: string;
  goles: number | null;
  ganador: boolean;
  /** Sin ganador todavía: nadie se apaga, el marcador va parejo. */
  decidida: boolean;
  colorDe: ColorDe;
}) {
  const apagado = decidida && !ganador;
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span
        className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
        style={{ backgroundColor: colorDe(slug) ?? "#4B5563", opacity: apagado ? 0.45 : 1 }}
      />
      <span
        className={`font-cond min-w-0 flex-1 truncate text-sm ${
          apagado ? "text-chalk-3" : "text-chalk"
        }`}
      >
        {nombre}
      </span>
      <span
        className={`tnum font-data shrink-0 text-sm ${
          apagado ? "text-chalk-3" : "font-bold text-chalk"
        }`}
      >
        {goles ?? "—"}
      </span>
    </div>
  );
}

function Llave({
  llave,
  nombreDe,
  colorDe,
}: {
  llave: PartidoPlayoff;
  nombreDe: NombreDe;
  colorDe: ColorDe;
}) {
  const decidida = llave.ganador_slug != null;
  return (
    <div className="rounded-sm border border-line bg-raised/30">
      <LadoLlave
        slug={llave.equipo1_slug}
        nombre={nombreDe(llave.equipo1_slug) || llave.equipo1_nombre}
        goles={llave.goles1}
        ganador={llave.ganador_slug === llave.equipo1_slug}
        decidida={decidida}
        colorDe={colorDe}
      />
      <div className="border-t border-line" />
      <LadoLlave
        slug={llave.equipo2_slug}
        nombre={nombreDe(llave.equipo2_slug) || llave.equipo2_nombre}
        goles={llave.goles2}
        ganador={llave.ganador_slug === llave.equipo2_slug}
        decidida={decidida}
        colorDe={colorDe}
      />
      {llave.en_juego && (
        <div className="flex items-center gap-1.5 border-t border-line px-3 py-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-vivo" />
          <span className="font-cond text-[0.625rem] tracking-wider text-chalk-2 uppercase">
            En juego
          </span>
        </div>
      )}
      {/* El empate no queda en empate: pasa alguien, y por qué pasó es parte
          del resultado tanto como el marcador. La tanda se despliega para no
          llenar el cuadro con seis líneas por llave. */}
      {!llave.en_juego && llave.definicion && (
        llave.definicion.tiros?.length ? (
          <details className="border-t border-line">
            <summary className="font-cond flex cursor-pointer list-none items-center gap-1.5 px-3 py-1.5 text-[0.625rem] text-chalk-3 [&::-webkit-details-marker]:hidden">
              <IconoDesempate className="size-3 shrink-0" />
              Penales {llave.definicion.penales1 ?? 0}–{llave.definicion.penales2 ?? 0}
              <span aria-hidden className="ml-auto">
                +
              </span>
            </summary>
            <ul className="px-3 pb-2">
              {llave.definicion.tiros.map((t) => (
                <li key={t.id} className="flex items-center gap-2 py-0.5">
                  <span
                    className="size-2 shrink-0 rounded-full border"
                    style={{
                      borderColor: colorDe(t.equipoId) ?? "#4B5563",
                      backgroundColor: t.convertido
                        ? (colorDe(t.equipoId) ?? "#4B5563")
                        : "transparent",
                    }}
                  />
                  <span className="font-cond min-w-0 flex-1 truncate text-[0.6875rem] text-chalk-2">
                    {t.jugador}
                  </span>
                  <span className="font-cond shrink-0 text-[0.625rem] text-chalk-3">
                    {t.convertido ? "gol" : "falló"}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        ) : (
          <div className="flex items-center gap-1.5 border-t border-line px-3 py-1.5">
            <IconoDesempate className="size-3 shrink-0 text-chalk-3" />
            <span className="font-cond text-[0.625rem] text-chalk-3">
              {llave.definicion.metodo === "tabla"
                ? "Pasa por posición en la tabla"
                : `Penales ${llave.definicion.penales1 ?? 0}–${llave.definicion.penales2 ?? 0}`}
            </span>
          </div>
        )
      )}
      {!llave.en_juego && !decidida && !llave.definicion && llave.goles1 != null && (
        <div className="border-t border-line px-3 py-1.5">
          <span className="font-cond text-[0.625rem] text-chalk-3">Definida por fuera</span>
        </div>
      )}
    </div>
  );
}

export function CuadroPlayoffs({
  llaves,
  nombreDe,
  colorDe,
  campeonSlug,
}: {
  llaves: PartidoPlayoff[];
  nombreDe: NombreDe;
  colorDe: ColorDe;
  /** Se resalta bajo la final; normalmente el ganador de esa misma llave. */
  campeonSlug?: string | null;
}) {
  // Solo se pintan las rondas que existen: una edición puede no jugar cuartos,
  // y mientras la sesión avanza las siguientes todavía no tienen partidos.
  const rondas = RONDAS.map((r) => ({
    ...r,
    partidos: llaves
      .filter((ll) => ll.ronda === r.key)
      .sort((a, b) => a.orden - b.orden),
  })).filter((r) => r.partidos.length > 0);

  if (!rondas.length) return null;

  return (
    <div className={`grid grid-cols-1 gap-4 md:items-center ${COLUMNAS[rondas.length] ?? ""}`}>
      {rondas.map(({ key, titulo, Icono, partidos }) => (
        <div key={key} className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <Icono className="size-3.5 text-chalk-3" />
            <h3 className="font-cond text-[0.6875rem] tracking-wider text-chalk-2 uppercase">
              {titulo}
            </h3>
          </div>
          {partidos.map((ll) => (
            <Llave
              key={ll.partido_id ?? `${ll.ronda}-${ll.orden}`}
              llave={ll}
              nombreDe={nombreDe}
              colorDe={colorDe}
            />
          ))}
          {key === "final" && campeonSlug && (
            <div className="flex items-center gap-2 rounded-sm border border-line px-3 py-2">
              <IconoFinal className="size-3.5 shrink-0 text-chalk-2" />
              <span className="font-cond truncate text-sm text-chalk">
                {nombreDe(campeonSlug)}
              </span>
              <span className="font-cond ml-auto shrink-0 text-[0.625rem] tracking-wider text-chalk-3 uppercase">
                Campeón
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
