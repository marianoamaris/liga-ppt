import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { Card } from "../common/Card";
import { EDICION_ACTUAL } from "../../config";
import { useEdicion, useEquiposEdicion } from "../../hooks/useCatalogo";

/** Altura fija del visor para que no colapse al cambiar de slide */
const VIEWPORT_CLASS =
  "relative h-[min(320px,55vw)] w-full md:h-[400px]";

function preloadImagenes(urls: string[]): void {
  for (const url of urls) {
    if (!url) continue;
    const img = new Image();
    img.src = url;
  }
}

const Liga20DestacadoCarousel: React.FC = () => {
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const { edicion } = useEdicion(EDICION_ACTUAL);
  const { locales } = useEquiposEdicion(EDICION_ACTUAL);
  const slideCount = locales.length;
  const equipo = locales[slide];

  useEffect(() => {
    preloadImagenes(locales.map((e) => e.imagen));
  }, [locales]);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (slideCount === 0) return;
      setSlide((s) => (s + dir + slideCount) % slideCount);
    },
    [slideCount]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const dx = end - start;
    if (dx > 56) go(-1);
    else if (dx < -56) go(1);
  };

  return (
    <Card className="relative mb-8 w-full max-w-5xl overflow-hidden border border-indigo-800/30 bg-gradient-to-b from-indigo-950 via-slate-950 to-black p-0 text-white shadow-xl">
      <div className="border-b border-white/10 px-4 py-3 md:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-sky-400/90">
          {edicion?.subtitulo}
        </p>
        <h2 className="text-center text-lg font-bold text-white md:text-xl">
          🏴󠁧󠁢󠁥󠁮󠁧󠁿⚽ {edicion?.nombre}
        </h2>
      </div>

      <div
        className="touch-pan-y px-3 pb-3 pt-3 md:px-6 md:pb-4 md:pt-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <p className="mb-4 text-center text-sm leading-relaxed text-gray-200 md:text-base">
          {edicion?.descripcion}
        </p>

        <div
          className={`${VIEWPORT_CLASS} overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-inner`}
        >
          {locales.map((eq, i) => (
            <img
              key={eq.id}
              src={eq.imagen}
              alt={`Equipo ${eq.nombre} – Liga PPT ${EDICION_ACTUAL}`}
              width={800}
              height={600}
              decoding="sync"
              loading="eager"
              fetchPriority={i === 0 ? "high" : "auto"}
              aria-hidden={slide !== i}
              className={`absolute inset-0 mx-auto h-full w-full object-contain transition-opacity duration-150 ${
                slide === i
                  ? "z-10 opacity-100"
                  : "pointer-events-none z-0 opacity-0"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-base font-bold text-sky-300 md:text-lg">
          {equipo?.nombre ?? " "}
        </p>
        <p className="mt-1 text-center text-xs text-gray-400">
          {slideCount === 0
            ? "Cargando equipos…"
            : `${slide + 1} de ${slideCount} equipos`}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-black/50 px-3 py-3 md:px-6">
        <button
          type="button"
          className="rounded-full p-2 text-white transition hover:bg-white/10"
          aria-label="Equipo anterior"
          onClick={() => go(-1)}
        >
          <FaChevronLeft className="text-xl" />
        </button>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div className="flex max-w-full flex-wrap justify-center gap-1.5 px-1">
            {locales.map((eq, i) => (
              <button
                key={eq.id}
                type="button"
                aria-label={`Ver equipo ${eq.nombre}`}
                title={eq.nombre}
                className={`h-2.5 rounded-full transition-all ${
                  slide === i
                    ? "w-6 bg-sky-400"
                    : "w-2.5 bg-white/30 hover:bg-white/50"
                }`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-sky-300 underline-offset-2 hover:underline md:text-sm"
            onClick={() => navigate("/en-vivo")}
          >
            Sigue la nueva temporada en vivo →
          </button>
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-white transition hover:bg-white/10"
          aria-label="Equipo siguiente"
          onClick={() => go(1)}
        >
          <FaChevronRight className="text-xl" />
        </button>
      </div>
    </Card>
  );
};

export default Liga20DestacadoCarousel;
