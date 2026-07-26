import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { usePlantillasEdicion } from "../../hooks/useCatalogo";
import { camisetaEquipo } from "../../utils/imagenesEquipos";

/**
 * Carrusel de plantillas de una edición.
 *
 * Sustituye a los tres carruseles que había, uno por edición y con los equipos
 * escritos a mano. Las tarjetas salen de `assets/LIGA_<n>/` según el color de
 * camiseta y los jugadores de `/ediciones/:n/plantillas`, así que una edición
 * nueva solo necesita sus imágenes y sus datos: ningún componente más.
 */
export const CarruselEquipos: React.FC<{ edicion: number }> = ({ edicion }) => {
  const { equipos, loading, error } = usePlantillasEdicion(edicion);
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
      const url = camisetaEquipo(edicion, eq.color_slug);
      if (!url) continue;
      const img = new Image();
      img.src = url;
    }
  }, [equipos, edicion]);

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
  const imagenActual = camisetaEquipo(edicion, actual.color_slug);

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
        ) : (
          // Ediciones sin tarjeta gráfica: la plantilla se lista en texto
          <ul className="absolute inset-0 flex flex-col flex-wrap content-start gap-x-6 gap-y-1 overflow-auto p-4">
            {actual.jugadores.map((j) => (
              <li key={j.nombre} className="font-cond text-sm text-chalk-2">
                {j.esArquero && <span aria-hidden>🧤 </span>}
                {j.nombre}
              </li>
            ))}
          </ul>
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
