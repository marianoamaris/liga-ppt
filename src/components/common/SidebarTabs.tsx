import React from "react";

interface SidebarTabsProps {
  tabs: { id: string; label: string }[];
  tabSeleccionada: string;
  setTabSeleccionada: (id: string) => void;
  className?: string;
}

export const SidebarTabs: React.FC<SidebarTabsProps> = ({
  tabs,
  tabSeleccionada,
  setTabSeleccionada,
  className = "",
}) => (
  <aside className={`min-w-[160px] flex flex-col gap-2 pt-2 ${className}`}>
    {tabs.map((t) => (
      <button
        key={t.id}
        onClick={() => setTabSeleccionada(t.id)}
        className={`px-4 py-2 rounded-lg font-semibold text-left transition border-l-4
          ${
            tabSeleccionada === t.id
              ? "bg-gray-900 text-white border-l-blue-500 shadow-lg"
              : "bg-gray-200 text-gray-700 border-l-transparent hover:bg-gray-300"
          }
        `}
      >
        {t.label}
      </button>
    ))}
  </aside>
);
