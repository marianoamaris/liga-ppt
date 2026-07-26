import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  DESTINOS_MOVIL,
  GRUPOS_SECUNDARIOS,
  ICONO_MAS,
} from "../../constants/navegacion";

const claseDestino = (activo: boolean) =>
  `font-cond flex flex-1 flex-col items-center gap-1 py-2 text-[0.625rem] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-chalk ${
    activo ? "text-chalk" : "text-chalk-3"
  }`;

/** Rutas que viven detrás de «Más»; sirve para marcarlo como activo. */
const RUTAS_SECUNDARIAS = GRUPOS_SECUNDARIOS.flatMap((g) =>
  g.destinos.map((d) => d.path)
);

/**
 * Navegación de móvil. Los tres destinos de uso diario quedan al alcance del
 * pulgar y el resto detrás de «Más»; antes todo vivía tras un botón de menú
 * en la esquina superior derecha, que es justo donde no llega la mano.
 */
export const BarraInferior: React.FC = () => {
  const [abierto, setAbierto] = useState(false);
  const { pathname } = useLocation();
  const botonMas = useRef<HTMLButtonElement>(null);

  // El cajón se cierra al navegar
  useEffect(() => setAbierto(false), [pathname]);

  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        botonMas.current?.focus();
      }
    };
    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  }, [abierto]);

  const enSecundaria = RUTAS_SECUNDARIAS.includes(pathname);

  return (
    <>
      {abierto && (
        <div
          className="fixed inset-0 z-40 bg-ink/80 md:hidden"
          onClick={() => setAbierto(false)}
          aria-hidden
        />
      )}

      {abierto && (
        <div
          id="cajon-navegacion"
          className="fixed inset-x-0 bottom-[3.75rem] z-50 max-h-[65vh] overflow-y-auto border-t border-line bg-surface px-4 pt-4 pb-5 md:hidden"
        >
          {GRUPOS_SECUNDARIOS.map((grupo) => (
            <div key={grupo.id} className="mb-4 last:mb-0">
              <h2 className="font-cond mb-2 text-[0.625rem] text-chalk-3">
                {grupo.titulo}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {grupo.destinos.map(({ id, label, path, Icono }) => (
                  <NavLink
                    key={id}
                    to={path}
                    className={({ isActive }) =>
                      `font-cond flex items-center gap-2.5 rounded-sm border border-line px-3 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                        isActive ? "bg-raised text-chalk" : "text-chalk-2"
                      }`
                    }
                  >
                    <Icono aria-hidden className="size-4 shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <nav
        aria-label="Secciones"
        className="fixed inset-x-0 bottom-0 z-50 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {DESTINOS_MOVIL.map(({ id, label, path, Icono }) => (
          <NavLink
            key={id}
            to={path}
            end={path === "/"}
            className={({ isActive }) => claseDestino(isActive && !abierto)}
          >
            <Icono aria-hidden className="size-[1.125rem]" />
            {label}
          </NavLink>
        ))}
        <button
          ref={botonMas}
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="cajon-navegacion"
          className={claseDestino(abierto || enSecundaria)}
        >
          <ICONO_MAS aria-hidden className="size-[1.125rem]" />
          Más
        </button>
      </nav>
    </>
  );
};
