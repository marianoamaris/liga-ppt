import React from "react";

interface SidebarTabsProps {
  tabs: { id: string; label: string }[];
  tabSeleccionada: string;
  setTabSeleccionada: (id: string) => void;
  className?: string;
  setSearch?: (search: string) => void;
}

/**
 * Navegación entre secciones de Historia.
 *
 * En pantalla ancha va en columna; en móvil se convierte en una tira que
 * desplaza en horizontal, para no comerse la pantalla antes del contenido.
 */
export const SidebarTabs: React.FC<SidebarTabsProps> = ({
  tabs,
  tabSeleccionada,
  setTabSeleccionada,
  className = "",
  setSearch,
}) => (
  <nav
    aria-label="Secciones de historia"
    className={`-mx-4 flex shrink-0 gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:w-52 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 ${className}`}
  >
    {tabs.map((t) => {
      const activa = tabSeleccionada === t.id;
      return (
        <button
          key={t.id}
          type="button"
          onClick={() => {
            setTabSeleccionada(t.id);
            setSearch?.("");
          }}
          aria-current={activa}
          className={`font-cond shrink-0 cursor-pointer rounded-sm px-3 py-2 text-left text-sm whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk lg:whitespace-normal ${
            activa
              ? "bg-raised text-chalk"
              : "text-chalk-3 hover:bg-raised/60 hover:text-chalk-2"
          }`}
        >
          {t.label}
        </button>
      );
    })}
  </nav>
);
