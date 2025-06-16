import React from "react";

type TabId = string;

interface TabsProps {
  tabs: { id: TabId; label: string }[];
  tabSeleccionada: TabId;
  setTabSeleccionada: (id: TabId) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  tabSeleccionada,
  setTabSeleccionada,
}) => (
  <div className="flex gap-0 md:gap-2 mb-6">
    {tabs.map(({ id, label }) => (
      <button
        key={id}
        onClick={() => setTabSeleccionada(id)}
        className={`
          px-2 md:px-4 py-1 md:py-2 cursor-pointer rounded-t-lg font-semibold transition border-b-2 focus:outline-none
          ${
            tabSeleccionada === id
              ? "border-blue-600 bg-white text-blue-700"
              : "border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200"
          }
        `}
      >
        {label}
      </button>
    ))}
  </div>
);
