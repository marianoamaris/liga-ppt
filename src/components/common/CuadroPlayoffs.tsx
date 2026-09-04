import React, { useEffect, useRef, useState } from "react";
import type {
  EventoLlave,
  PartidoPlayoff,
  RondaPlayoff,
  TiroPenal,
} from "../../types/jugador";
import type { RazonAmarilla } from "../anotador/types";
import { RAZON_LABEL, SIN_TIEMPO } from "../anotador/utils";
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

const RONDAS: {
  key: RondaPlayoff;
  titulo: string;
  Icono: React.FC<{ className?: string }>;
}[] = [
  { key: "cuartos", titulo: "Cuartos", Icono: IconoCuartos },
  { key: "semifinal", titulo: "Semifinales", Icono: IconoSemifinal },
  { key: "final", titulo: "Final", Icono: IconoFinal },
];

/**
 * Cómo se cruza el cuadro, en puestos de la tabla general.
 *
 * El 1º y el 2º entran directos a semifinales y esperan cada uno al ganador de
 * una llave concreta: el 1º al que salga del 4º-5º, y el 2º al que salga del
 * 3º-6º. No es el orden en que se juegan los cuartos —eso depende de a qué hora
 * arranque cada partido—, así que la llave se busca por los puestos que la
 * componen, no por su posición en la ronda.
 */
const CRUCES_SEMIFINAL: { anfitrion: number; cuartos: [number, number] }[] = [
  { anfitrion: 1, cuartos: [4, 5] },
  { anfitrion: 2, cuartos: [3, 6] },
];

/**
 * Un lado de una llave que todavía no se juega. O ya se sabe qué equipo es
 * —el 1º de la tabla, el ganador de un cuarto que ya terminó— o solo se sabe
 * de dónde va a salir.
 */
interface LadoPendiente {
  slug: string | null;
  etiqueta: string;
}

interface LlavePendiente {
  ronda: RondaPlayoff;
  orden: number;
  lados: [LadoPendiente, LadoPendiente];
}

/** Las dos llaves de cuartos, identificadas por los puestos que enfrentan. */
function cuartosDe(
  llaves: PartidoPlayoff[],
  puestos: [number, number],
  ordenTabla: string[],
): PartidoPlayoff | undefined {
  const [a, b] = puestos.map((p) => ordenTabla[p - 1]);
  if (!a || !b) return undefined;
  return llaves.find(
    (ll) =>
      ll.ronda === "cuartos" &&
      ((ll.equipo1_slug === a && ll.equipo2_slug === b) ||
        (ll.equipo1_slug === b && ll.equipo2_slug === a)),
  );
}

/** Puesto en la tabla general, 1-indexado. 0 si el equipo no aparece. */
function puestoDe(slug: string, ordenTabla: string[]): number {
  return ordenTabla.indexOf(slug) + 1;
}

/**
 * En qué renglón del cuadro va la llave dentro de su ronda.
 *
 * Las llaves llegan ordenadas por hora de arranque, y así el cuadro no se
 * sostenía: el primer cuarto de la noche podía ser el 3º-6º, que desemboca en
 * la segunda semifinal, y quedaba dibujado encima del que desemboca en la
 * primera. Las líneas se cruzaban y el cuadro dejaba de leerse.
 *
 * La ranura sale de los puestos de tabla que enfrenta: el cuarto que alimenta
 * la semifinal 1 va arriba, y esa semifinal es la del 1º. `Infinity` para lo
 * que no encaje en el cuadro previsto —una llave entre dos equipos que no son
 * los que tocaban—, que se dibuja al final sin estorbar al resto.
 */
function ranuraDe(llave: PartidoPlayoff, ordenTabla: string[]): number {
  if (llave.ronda === "final") return 0;

  const puestos = [
    puestoDe(llave.equipo1_slug, ordenTabla),
    puestoDe(llave.equipo2_slug, ordenTabla),
  ];

  const i =
    llave.ronda === "cuartos"
      ? CRUCES_SEMIFINAL.findIndex(({ cuartos }) =>
          cuartos.every((p) => puestos.includes(p)),
        )
      : CRUCES_SEMIFINAL.findIndex(({ anfitrion }) =>
          puestos.includes(anfitrion),
        );

  return i === -1 ? Infinity : i;
}

/**
 * Las rondas que faltan por jugarse, con lo que ya se sabe de ellas.
 *
 * Mientras el cuadro no existía entero, la pestaña de playoff pasaba de mostrar
 * la proyección completa a mostrar solo la ronda jugada: se perdía el «quién
 * sigue» justo cuando por fin era concreto. Aquí se rellenan los huecos.
 *
 * Una semifinal ya anotada manda sobre su proyección; se reconoce por el
 * anfitrión, que es quien tiene el puesto directo.
 */
function proyectar(
  llaves: PartidoPlayoff[],
  ordenTabla: string[],
): LlavePendiente[] {
  // Sin cuartos no hay nada que proyectar: o la edición no juega playoff, o
  // todavía no ha empezado y esa proyección la hace otra pantalla.
  if (!llaves.some((ll) => ll.ronda === "cuartos")) return [];

  const pendientes: LlavePendiente[] = [];
  const ganadoresSemi: LadoPendiente[] = [];

  CRUCES_SEMIFINAL.forEach(({ anfitrion, cuartos }, i) => {
    const anfitrionSlug = ordenTabla[anfitrion - 1];
    if (!anfitrionSlug) return;

    const jugada = llaves.find(
      (ll) =>
        ll.ronda === "semifinal" &&
        (ll.equipo1_slug === anfitrionSlug ||
          ll.equipo2_slug === anfitrionSlug),
    );
    if (jugada) {
      ganadoresSemi.push(
        jugada.ganador_slug
          ? { slug: jugada.ganador_slug, etiqueta: "" }
          : { slug: null, etiqueta: `Ganador semifinal ${i + 1}` },
      );
      return;
    }

    const llaveCuartos = cuartosDe(llaves, cuartos, ordenTabla);
    const rival: LadoPendiente = llaveCuartos?.ganador_slug
      ? { slug: llaveCuartos.ganador_slug, etiqueta: "" }
      : { slug: null, etiqueta: `Ganador ${cuartos[0]}º vs ${cuartos[1]}º` };

    pendientes.push({
      ronda: "semifinal",
      orden: i + 1,
      // «#1» y no «1º de la tabla»: en el cuadro a tres columnas la etiqueta
      // larga se come el nombre del equipo, y es como se nombran los puestos
      // en el resto de la pantalla.
      lados: [{ slug: anfitrionSlug, etiqueta: `#${anfitrion}` }, rival],
    });
    ganadoresSemi.push({ slug: null, etiqueta: `Ganador semifinal ${i + 1}` });
  });

  // La final solo se proyecta si no está anotada y si las dos semifinales
  // llegaron a plantearse; media final es peor que ninguna.
  if (
    !llaves.some((ll) => ll.ronda === "final") &&
    ganadoresSemi.length === 2
  ) {
    pendientes.push({
      ronda: "final",
      orden: 1,
      lados: [ganadoresSemi[0], ganadoresSemi[1]],
    });
  }

  return pendientes;
}

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
        style={{
          backgroundColor: colorDe(slug) ?? "#4B5563",
          opacity: apagado ? 0.45 : 1,
        }}
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
  return tiempo == null ? SIN_TIEMPO : `${Math.floor(tiempo / 60)}'`;
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
  if (tipo === "gol")
    return <IconoGol className="size-3 shrink-0 text-chalk-2" />;
  if (tipo === "autogol")
    return <IconoAutogol className="size-3 shrink-0 text-chalk-3" />;
  return <Tarjeta tipo={tipo} />;
}

/**
 * Un hecho del partido dentro del panel, ya colocado en la columna de su
 * equipo. El bando se lee por la columna, así que aquí no hace falta repetirlo
 * con un punto de color: sobra tinta y el ojo ya lo sabe.
 */
function EventoLado({
  evento,
  lado,
}: {
  evento: EventoLlave;
  lado: "izq" | "der";
}) {
  // La razón viaja como texto libre: si es una de las conocidas se traduce, y
  // si no, se muestra tal cual antes que dejar el hueco.
  const razon =
    evento.tipo === "amarilla" && evento.razon
      ? (RAZON_LABEL[evento.razon as RazonAmarilla] ?? evento.razon)
      : null;
  return (
    <div
      className={`flex min-w-0 items-start gap-1.5 ${
        lado === "der" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <span className="mt-0.5 shrink-0 text-xs leading-none">
        <IconoEvento tipo={evento.tipo} />
      </span>
      <div className="min-w-0">
        <span className="font-cond block truncate text-xs text-chalk">
          {evento.jugador ?? "En contra"}
        </span>
        {razon && (
          <span className="font-cond block truncate text-[0.625rem] text-chalk-3">
            {razon}
          </span>
        )}
      </div>
    </div>
  );
}

/** Un cobro de la tanda, en la columna de su equipo. */
function TiroLado({
  tiro,
  lado,
  colorDe,
}: {
  tiro: TiroPenal;
  lado: "izq" | "der";
  colorDe: ColorDe;
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-1.5 ${
        lado === "der" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <span
        className="size-2 shrink-0 rounded-full border"
        style={{
          borderColor: colorDe(tiro.equipoId) ?? "#4B5563",
          backgroundColor: tiro.convertido
            ? (colorDe(tiro.equipoId) ?? "#4B5563")
            : "transparent",
        }}
      />
      <span className="font-cond min-w-0 truncate text-xs text-chalk-2">
        {tiro.jugador}
      </span>
      <span className="font-cond shrink-0 text-[0.625rem] text-chalk-3">
        {tiro.convertido ? "gol" : "falló"}
      </span>
    </div>
  );
}

/**
 * Una fila del relato: el hecho en la columna de su equipo y, en medio, el
 * minuto. Las dos columnas caen bajo el equipo que las encabeza, así que el
 * partido se lee como se leería en cualquier acta.
 */
function FilaPanel({
  izquierda,
  centro,
  derecha,
}: {
  izquierda: React.ReactNode;
  centro: React.ReactNode;
  derecha: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1fr_2.75rem_1fr] items-start gap-2 px-4 py-1.5">
      <div className="min-w-0">{izquierda}</div>
      <span className="tnum font-data pt-0.5 text-center text-[0.625rem] text-chalk-3">
        {centro}
      </span>
      <div className="min-w-0">{derecha}</div>
    </div>
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
    return (
      <span className="font-cond text-[0.625rem] text-chalk-3">
        Definida por fuera
      </span>
    );
  }
  return null;
}

/** La misma clave que identifica la llave en el cuadro y en el panel. */
function claveDe(llave: PartidoPlayoff): string {
  return llave.partido_id ?? `${llave.ronda}-${llave.orden}`;
}

/** Si la llave tiene algo que contar: goles, tarjetas o una tanda. */
function hayDetalle(llave: PartidoPlayoff): boolean {
  return (
    (llave.eventos?.length ?? 0) > 0 ||
    (llave.definicion?.tiros?.length ?? 0) > 0
  );
}

/**
 * El pie de la llave: su estado y la puerta al detalle.
 *
 * Es un botón, no un desplegable. Antes el detalle crecía dentro de la propia
 * tarjeta y empujaba media columna hacia abajo cada vez que se abría; ahora
 * solo enciende el panel de abajo, que es común a todo el cuadro.
 */
function PieLlave({
  llave,
  abierta,
  onAbrir,
}: {
  llave: PartidoPlayoff;
  abierta: boolean;
  onAbrir: () => void;
}) {
  // Sin nada que contar no hay nada que abrir —una edición heredada no tiene
  // partido anotado—: la llave se queda con su línea de estado.
  if (!hayDetalle(llave)) {
    if (!tieneEstado(llave)) return null;
    return (
      <div className="flex items-center gap-1.5 border-t border-line px-3 py-1.5">
        <Estado llave={llave} />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-expanded={abierta}
      className={`flex w-full cursor-pointer items-center gap-1.5 border-t border-line px-3 py-1.5 text-left transition-colors hover:bg-raised/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
        abierta ? "bg-raised/70" : ""
      }`}
    >
      {tieneEstado(llave) ? (
        <Estado llave={llave} />
      ) : (
        <span className="font-cond text-[0.625rem] text-chalk-3">
          Detalle del partido
        </span>
      )}
      <span className="ml-auto flex items-center gap-2">
        <ResumenTarjetas eventos={llave.eventos ?? []} />
        <span
          aria-hidden
          className={`text-chalk-3 transition-transform ${abierta ? "rotate-45" : ""}`}
        >
          +
        </span>
      </span>
    </button>
  );
}

/**
 * Lo que pasó dentro de una llave: cada gol con su autor y su minuto, cada
 * tarjeta con su motivo y, si la hubo, la tanda de penales tiro a tiro.
 *
 * Vive debajo del cuadro y no dentro de la tarjeta, y solo hay uno abierto a
 * la vez. Así el cuadro no se deforma al mirar un partido —las columnas se
 * quedan donde estaban— y el relato tiene el ancho de la pantalla para
 * ponerse a dos columnas, una por equipo, como un acta.
 */
function PanelDetalle({
  llave,
  ronda,
  nombreDe,
  colorDe,
  onCerrar,
}: {
  llave: PartidoPlayoff;
  ronda: string;
  nombreDe: NombreDe;
  colorDe: ColorDe;
  onCerrar: () => void;
}) {
  const eventos = enOrden(llave.eventos ?? []);
  const tiros = llave.definicion?.tiros ?? [];
  const nombre1 = nombreDe(llave.equipo1_slug) || llave.equipo1_nombre;
  const nombre2 = nombreDe(llave.equipo2_slug) || llave.equipo2_nombre;

  return (
    <div className="rounded-sm border border-line bg-raised/30">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="font-cond shrink-0 text-[0.625rem] tracking-wider text-chalk-3 uppercase">
          {ronda}
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <span className="font-cond min-w-0 flex-1 truncate text-right text-sm text-chalk">
            {nombre1}
          </span>
          <span
            className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
            style={{
              backgroundColor: colorDe(llave.equipo1_slug) ?? "#4B5563",
            }}
          />
          <span className="tnum font-data shrink-0 text-sm font-bold text-chalk">
            {llave.goles1 ?? "—"}–{llave.goles2 ?? "—"}
          </span>
          <span
            className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
            style={{
              backgroundColor: colorDe(llave.equipo2_slug) ?? "#4B5563",
            }}
          />
          <span className="font-cond min-w-0 flex-1 truncate text-sm text-chalk">
            {nombre2}
          </span>
        </div>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar el detalle"
          className="font-cond shrink-0 cursor-pointer px-1 text-chalk-3 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
        >
          ×
        </button>
      </div>

      {eventos.length > 0 && (
        <div className="py-1.5">
          {eventos.map((ev) => {
            const local = ev.equipo_slug === llave.equipo1_slug;
            return (
              <FilaPanel
                key={ev.id}
                izquierda={local ? <EventoLado evento={ev} lado="der" /> : null}
                centro={minutoDe(ev.tiempo)}
                derecha={local ? null : <EventoLado evento={ev} lado="izq" />}
              />
            );
          })}
        </div>
      )}

      {tiros.length > 0 && (
        <div className="border-t border-line/60 py-1.5">
          <p className="font-cond px-4 pb-1 text-[0.625rem] tracking-wider text-chalk-3 uppercase">
            Tanda de penales
          </p>
          {tiros.map((t, i) => {
            const local = t.equipoId === llave.equipo1_slug;
            return (
              <FilaPanel
                key={t.id}
                izquierda={
                  local ? (
                    <TiroLado tiro={t} lado="der" colorDe={colorDe} />
                  ) : null
                }
                centro={i + 1}
                derecha={
                  local ? null : (
                    <TiroLado tiro={t} lado="izq" colorDe={colorDe} />
                  )
                }
              />
            );
          })}
          {llave.ganador_slug && (
            <p className="font-cond px-4 pt-1 text-center text-[0.625rem] text-chalk-3">
              Pasa {nombreDe(llave.ganador_slug)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Llave({
  llave,
  nombreDe,
  colorDe,
  abierta,
  onAbrir,
}: {
  llave: PartidoPlayoff;
  nombreDe: NombreDe;
  colorDe: ColorDe;
  abierta: boolean;
  onAbrir: () => void;
}) {
  const decidida = llave.ganador_slug != null;
  return (
    // La llave abierta se marca con el borde: el panel está abajo, y sin esto
    // no se sabría de cuál de las seis tarjetas se está leyendo el detalle.
    <div
      className={`rounded-sm border bg-raised/30 transition-colors ${
        abierta ? "border-chalk-3" : "border-line"
      }`}
    >
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
      <PieLlave llave={llave} abierta={abierta} onAbrir={onAbrir} />
    </div>
  );
}

/**
 * Una llave que todavía no se juega. Se dibuja apagada y con el borde
 * punteado: ocupa el sitio que va a ocupar el partido, pero se tiene que
 * notar que ahí aún no ha pasado nada.
 */
function LlaveProyectada({
  llave,
  nombreDe,
  colorDe,
}: {
  llave: LlavePendiente;
  nombreDe: NombreDe;
  colorDe: ColorDe;
}) {
  return (
    <div className="rounded-sm border border-dashed border-line bg-raised/10">
      {llave.lados.map((lado, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 px-3 py-2 ${i ? "border-t border-line" : ""}`}
        >
          <span
            className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
            style={{
              backgroundColor: lado.slug
                ? (colorDe(lado.slug) ?? "#4B5563")
                : "transparent",
              opacity: lado.slug ? 0.6 : 1,
            }}
          />
          {lado.slug ? (
            <>
              <span className="font-cond min-w-0 flex-1 truncate text-sm text-chalk-2">
                {nombreDe(lado.slug)}
              </span>
              {lado.etiqueta && (
                <span className="font-cond shrink-0 text-[0.625rem] text-chalk-3">
                  {lado.etiqueta}
                </span>
              )}
            </>
          ) : (
            <span className="font-cond min-w-0 flex-1 truncate text-sm text-chalk-3 italic">
              {lado.etiqueta}
            </span>
          )}
        </div>
      ))}
      <div className="border-t border-line px-3 py-1.5">
        <span className="font-cond text-[0.625rem] tracking-wider text-chalk-3 uppercase">
          Por jugar
        </span>
      </div>
    </div>
  );
}

export function CuadroPlayoffs({
  llaves,
  nombreDe,
  colorDe,
  campeonSlug,
  ordenTabla,
}: {
  llaves: PartidoPlayoff[];
  nombreDe: NombreDe;
  colorDe: ColorDe;
  /** Se resalta bajo la final; normalmente el ganador de esa misma llave. */
  campeonSlug?: string | null;
  /**
   * Equipos en orden de tabla general. Con ella el cuadro proyecta las rondas
   * que faltan; sin ella solo dibuja lo jugado, que es lo que quiere el
   * histórico de una edición terminada.
   */
  ordenTabla?: string[];
}) {
  // Un solo detalle abierto a la vez, y vive aquí y no en cada tarjeta: es la
  // forma de garantizar que no haya dos relatos compitiendo por la pantalla.
  const [abierta, setAbierta] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  const tabla = ordenTabla?.length ? ordenTabla : null;
  const pendientes = tabla ? proyectar(llaves, tabla) : [];

  // Solo se pintan las rondas que existen: una edición puede no jugar cuartos.
  // Las que faltan aparecen si la proyección las alcanza.
  //
  // Jugadas y pendientes van en la misma lista, no una tanda detrás de otra:
  // si se juega antes la segunda semifinal que la primera, cada una tiene que
  // seguir en su renglón.
  const rondas = RONDAS.map((r) => ({
    ...r,
    items: [
      ...llaves
        .filter((ll) => ll.ronda === r.key)
        .map((llave) => ({
          clave: llave.partido_id ?? `${llave.ronda}-${llave.orden}`,
          // Sin tabla no hay ranura que calcular: manda la hora de arranque,
          // que es lo único que se sabe de una edición heredada.
          ranura: tabla ? ranuraDe(llave, tabla) : llave.orden - 1,
          orden: llave.orden,
          jugada: llave,
          pendiente: null as LlavePendiente | null,
          titulo: r.titulo,
        })),
      ...pendientes
        .filter((ll) => ll.ronda === r.key)
        .map((llave) => ({
          clave: `pendiente-${llave.ronda}-${llave.orden}`,
          ranura: llave.orden - 1,
          orden: llave.orden,
          jugada: null as PartidoPlayoff | null,
          pendiente: llave,
          titulo: r.titulo,
        })),
    ].sort((a, b) =>
      a.ranura !== b.ranura ? a.ranura - b.ranura : a.orden - b.orden,
    ),
  })).filter((r) => r.items.length > 0);

  // La llave abierta se busca en la lista de cada render: en vivo las llaves
  // se recargan cada ocho segundos, y guardar el objeto dejaría el panel
  // contando un partido que ya avanzó. Si desaparece, el panel se va con ella.
  const seleccion = rondas
    .flatMap((r) => r.items)
    .find((i) => i.jugada && claveDe(i.jugada) === abierta);

  // Al cambiar de partido el panel se trae a la vista. `nearest` mueve lo
  // mínimo: si ya se veía, no se mueve nada.
  useEffect(() => {
    if (abierta)
      panel.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [abierta]);

  if (!rondas.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`grid grid-cols-1 gap-4 md:items-center ${COLUMNAS[rondas.length] ?? ""}`}
      >
        {rondas.map(({ key, titulo, Icono, items }) => (
          <div key={key} className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5">
              <Icono className="size-3.5 text-chalk-3" />
              <h3 className="font-cond text-[0.6875rem] tracking-wider text-chalk-2 uppercase">
                {titulo}
              </h3>
            </div>
            {items.map(({ clave, jugada, pendiente }) =>
              jugada ? (
                <Llave
                  key={clave}
                  llave={jugada}
                  nombreDe={nombreDe}
                  colorDe={colorDe}
                  abierta={abierta === clave}
                  onAbrir={() =>
                    setAbierta((actual) => (actual === clave ? null : clave))
                  }
                />
              ) : (
                <LlaveProyectada
                  key={clave}
                  llave={pendiente!}
                  nombreDe={nombreDe}
                  colorDe={colorDe}
                />
              ),
            )}
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

      {seleccion?.jugada && (
        <div ref={panel}>
          <PanelDetalle
            llave={seleccion.jugada}
            ronda={seleccion.titulo}
            nombreDe={nombreDe}
            colorDe={colorDe}
            onCerrar={() => setAbierta(null)}
          />
        </div>
      )}
    </div>
  );
}
