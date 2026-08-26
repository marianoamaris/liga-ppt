import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { usePlantillasEdicion } from "../../hooks/useCatalogo";
import { camisetaEquipo } from "../../utils/imagenesEquipos";
import type { ArqueroEdicion, FilaClasificacion } from "../../types/jugador";

/**
 * Lo que se sabe de un equipo cuando no hay ni tarjeta ni plantilla. De las
 * ediciones anteriores a la 19 solo constan la clasificación y, en algunas, el
 * arquero: los goleadores históricos nunca registraron a qué equipo pertenecían.
 */
function FichaEquipo({
  nombre,
  color,
  fila,
  arquero,
}: {
  nombre: string;
  color: string | null;
  fila?: FilaClasificacion;
  arquero?: ArqueroEdicion;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
      <span
        className="size-14 rounded-full ring-2 ring-chalk-3"
        style={{ backgroundColor: color ?? "#4B5563" }}
      />
      <h3 className="font-cond text-2xl text-chalk">{nombre}</h3>

      {fila ? (
        <div className="flex flex-wrap items-start justify-center gap-6">
          <div>
            <div className="tnum font-data text-2xl leading-none font-bold text-chalk">
              {fila.posicion}º
            </div>
            <div className="font-cond mt-1 text-[0.625rem] text-chalk-3">Posición</div>
          </div>
          <div>
            <div className="tnum font-data text-2xl leading-none font-bold text-chalk">
              {fila.puntos}
            </div>
            <div className="font-cond mt-1 text-[0.625rem] text-chalk-3">Puntos</div>
          </div>
          {fila.victorias != null && (
            <div>
              <div className="tnum font-data text-2xl leading-none font-bold text-chalk">
                {fila.victorias}·{fila.empates}·{fila.derrotas ?? "—"}
              </div>
              <div className="font-cond mt-1 text-[0.625rem] text-chalk-3">V·E·D</div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-chalk-3">Sin registro en la tabla de esta edición.</p>
      )}

      {arquero && (
        <p className="font-cond text-sm text-chalk-2">
          <span aria-hidden>🧤 </span>
          {arquero.jugador_nombre}
          <span className="tnum font-data text-chalk-3">
            {" "}
            · {arquero.goles_recibidos} recibidos
          </span>
        </p>
      )}

      <p className="max-w-xs text-[0.6875rem] text-chalk-3">
        La plantilla de esta edición no quedó registrada.
      </p>
    </div>
  );
}

interface Props {
  edicion: number | null;
  /** Para las ediciones sin tarjeta ni plantilla: lo que sí consta del equipo. */
  clasificacion?: FilaClasificacion[];
  arqueros?: ArqueroEdicion[];
}

/**
 * Carrusel de equipos de una edición.
 *
 * Sustituye a los tres carruseles que había, uno por edición y con los equipos
 * escritos a mano. Las tarjetas salen de `assets/LIGA_<n>/` según el color de
 * camiseta y los jugadores de `/ediciones/:n/plantillas`, así que una edición
 * nueva solo necesita sus imágenes y sus datos.
 *
 * Las ediciones antiguas no tienen ni tarjeta ni plantilla registrada: de ellas
 * se muestra lo que sí consta —posición, récord, arquero— en vez de un hueco.
 */
export const CarruselEquipos: React.FC<Props> = ({
  edicion,
  clasificacion = [],
  arqueros = [],
}) => {
  const { equipos, sede_id, numero_sede, loading, error } = usePlantillasEdicion(edicion);
  const [slide, setSlide] = useState(0);
  const inicioTactil = useRef<number | null>(null);

  // Al cambiar de edición el índice anterior puede no existir
  useEffect(() => setSlide(0), [edicion]);

  const total = equipos.length;

  const ir = useCallback(
    (dir: -1 | 1) => {
      if (!total) return;
      setSlide((s) => (s + dir + total) % total);
    },
    [total]
  );

  // Precarga para que al pasar de equipo la camiseta ya esté
  useEffect(() => {
    for (const eq of equipos) {
      const url = camisetaEquipo(sede_id, numero_sede, eq.color_slug, eq.color_hex);
      if (!url) continue;
      const img = new Image();
      img.src = url;
    }
  }, [equipos, sede_id, numero_sede]);

  if (error) {
    return (
      <p className="rounded-md border border-line bg-surface px-4 py-3 text-sm text-chalk-3">
        No se pudieron cargar los equipos: {error}
      </p>
    );
  }

  if (loading && !total) {
    return (
      <p className="rounded-md border border-line bg-surface px-4 py-3 text-sm text-chalk-3">
        Cargando equipos…
      </p>
    );
  }

  if (!total) return null;

  const actual = equipos[slide];
  const imagenActual = camisetaEquipo(sede_id, numero_sede, actual.color_slug, actual.color_hex);

  return (
    <section className="rounded-md border border-line bg-surface p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-cond text-xs text-chalk-2">Plantillas</h2>
        <span className="font-cond text-[0.6875rem] text-chalk-3">
          {slide + 1} de {total}
        </span>
      </div>

      <div
        className="relative h-[min(320px,55vw)] w-full overflow-hidden rounded-sm bg-ink md:h-[380px]"
        onTouchStart={(e) => {
          inicioTactil.current = e.targetTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const inicio = inicioTactil.current;
          inicioTactil.current = null;
          if (inicio == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? inicio) - inicio;
          if (dx > 56) ir(-1);
          else if (dx < -56) ir(1);
        }}
      >
        {imagenActual ? (
          <img
            src={imagenActual}
            alt={`Plantilla de ${actual.nombre}`}
            width={800}
            height={600}
            decoding="async"
            className="absolute inset-0 mx-auto size-full object-contain"
          />
        ) : actual.jugadores.length > 0 ? (
          // Sin tarjeta gráfica pero con plantilla registrada
          <ul className="absolute inset-0 flex flex-col flex-wrap content-start gap-x-6 gap-y-1 overflow-auto p-4">
            {actual.jugadores.map((j) => (
              <li key={j.nombre} className="font-cond text-sm text-chalk-2">
                {j.esArquero && <span aria-hidden>🧤 </span>}
                {j.nombre}
              </li>
            ))}
          </ul>
        ) : (
          <FichaEquipo
            nombre={actual.nombre}
            color={actual.color_hex}
            fila={clasificacion.find((c) => c.equipo_slug === actual.slug)}
            arquero={arqueros.find((a) => a.equipo_slug === actual.slug)}
          />
        )}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          aria-label="Equipo anterior"
          onClick={() => ir(-1)}
          className="cursor-pointer rounded-sm border border-line p-2 text-chalk-3 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
        >
          <FaChevronLeft aria-hidden />
        </button>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full ring-[1.5px] ring-chalk-3"
              style={{ backgroundColor: actual.color_hex ?? "#4B5563" }}
            />
            <span className="font-cond truncate text-base text-chalk">
              {actual.nombre}
            </span>
          </div>
          <div className="flex max-w-full flex-wrap justify-center gap-1.5">
            {equipos.map((eq, i) => (
              <button
                key={eq.slug}
                type="button"
                aria-label={`Ver ${eq.nombre}`}
                aria-current={i === slide}
                onClick={() => setSlide(i)}
                className={`h-2.5 rounded-full transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                  i === slide ? "w-6 bg-chalk" : "w-2.5 bg-line hover:bg-chalk-3"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Equipo siguiente"
          onClick={() => ir(1)}
          className="cursor-pointer rounded-sm border border-line p-2 text-chalk-3 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
        >
          <FaChevronRight aria-hidden />
        </button>
      </div>

      {actual.arqueroDesignado && (
        <p className="mt-2 text-[0.6875rem] text-chalk-3">
          Arquero: {actual.arqueroDesignado}
        </p>
      )}
    </section>
  );
};
