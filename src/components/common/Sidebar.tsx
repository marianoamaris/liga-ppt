import React from "react";
import { NavLink } from "react-router-dom";
import { NAVEGACION } from "../../constants/navegacion";

/**
 * Navegación de escritorio. Los destinos van agrupados por frecuencia de uso
 * y son enlaces reales: antes eran `<li onClick>`, que no reciben foco ni se
 * pueden abrir en otra pestaña.
 */
export const Sidebar: React.FC<{ className?: string }> = ({ className = "" }) => (
  <nav
    aria-label="Secciones"
    className={`flex w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-line bg-surface py-4 ${className}`}
  >
    <div className="flex items-center gap-2.5 px-4 pb-4">
      <img
        src="/PPT.png"
        alt=""
        className="size-8 shrink-0 rounded-full bg-chalk object-contain p-0.5"
      />
      <span className="font-cond text-base text-chalk">Liga PPT</span>
    </div>

    {NAVEGACION.map((grupo) => (
      <div key={grupo.id} className="flex flex-col gap-0.5">
        {grupo.titulo && (
          <h2 className="font-cond mx-4 mt-4 mb-1 border-t border-line pt-3 text-[0.625rem] text-chalk-3">
            {grupo.titulo}
          </h2>
        )}
        {grupo.destinos.map(({ id, label, path, Icono }) => (
          <NavLink
            key={id}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `font-cond mx-2 flex items-center gap-2.5 rounded-sm px-2 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                isActive
                  ? "bg-raised text-chalk"
                  : "text-chalk-3 hover:bg-raised/60 hover:text-chalk-2"
              }`
            }
          >
            <Icono aria-hidden className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </div>
    ))}
  </nav>
);
