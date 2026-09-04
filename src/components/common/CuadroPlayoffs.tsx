import React from "react";
import type { EventoLlave, PartidoPlayoff, RondaPlayoff } from "../../types/jugador";
import type { RazonAmarilla } from "../anotador/types";
import { RAZON_LABEL } from "../anotador/utils";
import {
  IconoAutogol,
  IconoCuartos,
  IconoDesempate,
  IconoFinal,
  IconoGol,
  IconoSemifinal,
  Tarjeta,
} from "./iconos";

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

/** Minuto de partido: los segundos sobran en una llave de casi una hora. */
function minutoDe(tiempo: number | null): string {
  return tiempo == null ? "" : `${Math.floor(tiempo / 60)}'`;
}

/**
 * Cronológico, y lo que no trae minuto al final: hay tarjetas guardadas sin
 * reloj, y colarlas en el minuto 0 desordenaría el relato del partido.
 */
function enOrden(eventos: EventoLlave[]): EventoLlave[] {
  return [...eventos].sort((a, b) => {
    if (a.tiempo == null) return b.tiempo == null ? 0 : 1;
    if (b.tiempo == null) return -1;
    return a.tiempo - b.tiempo;
  });
}

function IconoEvento({ tipo }: { tipo: EventoLlave["tipo"] }) {
  if (tipo === "gol") return <IconoGol className="size-3 shrink-0 text-chalk-2" />;
  if (tipo === "autogol") return <IconoAutogol className="size-3 shrink-0 text-chalk-3" />;
  return <Tarjeta tipo={tipo} />;
}

function FilaEvento({ evento, colorDe }: { evento: EventoLlave; colorDe: ColorDe }) {
  // La razón viaja como texto libre: si es una de las conocidas se traduce, y
  // si no, se muestra tal cual antes que dejar el hueco.
  const razon =
    evento.tipo === "amarilla" && evento.razon
      ? (RAZON_LABEL[evento.razon as RazonAmarilla] ?? evento.razon)
      : null;
  return (
    <li className="flex items-start gap-2 py-1">
      <span
        className="mt-1 size-2 shrink-0 rounded-full"
        style={{ backgroundColor: colorDe(evento.equipo_slug) ?? "#4B5563" }}
      />
      <span className="mt-0.5 text-[0.6875rem] leading-none">
        <IconoEvento tipo={evento.tipo} />
      </span>
      <div className="min-w-0 flex-1">
        <span className="font-cond block truncate text-[0.6875rem] text-chalk-2">
          {evento.jugador ?? "En contra"}
        </span>
        {razon && (
          <span className="font-cond block truncate text-[0.625rem] text-chalk-3">{razon}</span>
        )}
      </div>
      <span className="tnum font-data shrink-0 text-[0.625rem] text-chalk-3">
        {minutoDe(evento.tiempo)}
      </span>
    </li>
  );
}

/** Cuántas tarjetas hubo, para que se vean sin tener que abrir el detalle. */
function ResumenTarjetas({ eventos }: { eventos: EventoLlave[] }) {
  const amarillas = eventos.filter((e) => e.tipo === "amarilla").length;
  const rojas = eventos.filter((e) => e.tipo === "roja").length;
  if (!amarillas && !rojas) return null;
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-[0.625rem]">
      {amarillas > 0 && (
        <span className="flex items-center gap-0.5">
          <Tarjeta tipo="amarilla" />
          <span className="tnum font-data text-chalk-3">{amarillas}</span>
        </span>
      )}
      {rojas > 0 && (
        <span className="flex items-center gap-0.5">
          <Tarjeta tipo="roja" />
          <span className="tnum font-data text-chalk-3">{rojas}</span>
        </span>
      )}
    </span>
  );
}

/**
 * Si la llave tiene algo que decir en su pie más allá del marcador. Un 3–1
 * limpio no lo tiene, y ahí el pie es solo la puerta al detalle.
 */
function tieneEstado(llave: PartidoPlayoff): boolean {
  return (
    llave.en_juego ||
    llave.definicion != null ||
    (llave.ganador_slug == null && llave.goles1 != null)
  );
}

/** La línea que resume la llave: si se juega, o cómo se desempató. */
function Estado({ llave }: { llave: PartidoPlayoff }) {
  if (llave.en_juego) {
    return (
      <>
        <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-vivo" />
        <span className="font-cond text-[0.625rem] tracking-wider text-chalk-2 uppercase">
          En juego
        </span>
      </>
    );
  }
  if (llave.definicion) {
    return (
      <>
        <IconoDesempate className="size-3 shrink-0 text-chalk-3" />
        <span className="font-cond truncate text-[0.625rem] text-chalk-3">
          {llave.definicion.metodo === "tabla"
            ? "Pasa por posición en la tabla"
            : `Penales ${llave.definicion.penales1 ?? 0}–${llave.definicion.penales2 ?? 0}`}
        </span>
      </>
    );
  }
  if (llave.ganador_slug == null && llave.goles1 != null) {
    return <span className="font-cond text-[0.625rem] text-chalk-3">Definida por fuera</span>;
  }
  return null;
}

/**
 * Lo que pasó dentro de la llave: cada gol con su autor y su minuto, cada
 * tarjeta con su motivo y, si la hubo, la tanda de penales tiro a tiro.
 *
 * Va plegado porque el cuadro se lee de un vistazo y son tres columnas de
 * llaves: el marcador sigue siendo lo primero y el detalle está a un clic.
 */
function Detalle({
  llave,
  nombreDe,
  colorDe,
}: {
  llave: PartidoPlayoff;
  nombreDe: NombreDe;
  colorDe: ColorDe;
}) {
  const eventos = enOrden(llave.eventos ?? []);
  const tiros = llave.definicion?.tiros ?? [];

  // Sin nada que contar no hay nada que abrir —una edición heredada no tiene
  // partido anotado—: la llave se queda con su línea de estado, como antes.
  if (!eventos.length && !tiros.length) {
    if (!tieneEstado(llave)) return null;
    return (
      <div className="flex items-center gap-1.5 border-t border-line px-3 py-1.5">
        <Estado llave={llave} />
      </div>
    );
  }

  return (
    <details className="group border-t border-line">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 px-3 py-1.5 [&::-webkit-details-marker]:hidden">
        {tieneEstado(llave) ? (
          <Estado llave={llave} />
        ) : (
          <span className="font-cond text-[0.625rem] text-chalk-3">Detalle del partido</span>
        )}
        <span className="ml-auto flex items-center gap-2">
          <ResumenTarjetas eventos={eventos} />
          <span aria-hidden className="text-chalk-3 transition-transform group-open:rotate-45">
            +
          </span>
        </span>
      </summary>

      {eventos.length > 0 && (
        <ul className="border-t border-line/60 px-3 py-1.5">
          {eventos.map((ev) => (
            <FilaEvento key={ev.id} evento={ev} colorDe={colorDe} />
          ))}
        </ul>
      )}

      {tiros.length > 0 && (
        <div className="border-t border-line/60 px-3 py-1.5">
          <p className="font-cond mb-1 text-[0.625rem] tracking-wider text-chalk-3 uppercase">
            Tanda de penales
          </p>
          <ul>
            {tiros.map((t) => (
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
          {llave.ganador_slug && (
            <p className="font-cond mt-1 truncate text-[0.625rem] text-chalk-3">
              Pasa {nombreDe(llave.ganador_slug)}
            </p>
          )}
        </div>
      )}
    </details>
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
      <Detalle llave={llave} nombreDe={nombreDe} colorDe={colorDe} />
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
