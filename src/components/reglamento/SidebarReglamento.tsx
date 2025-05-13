import React from "react";

const SECTIONS = [
  {
    id: "1. Información General",
    label: "1. Información General",
    children: [
      { id: "1.1 Liga PPT", label: "1.1 Liga PPT" },
      { id: "1.2 Tabla de posiciones", label: "1.2 Tabla de posiciones" },
      { id: "1.3 Administración", label: "1.3 Administración" },
      { id: "1.4 Equipos y jugadores", label: "1.4 Equipos y jugadores" },
      { id: "1.5 Capitanes", label: "1.5 Capitanes" },
      { id: "1.6 Jugadores", label: "1.6 Jugadores" },
    ],
  },
  {
    id: "2. Elección de Jugadores y Transferencias",
    label: "2. Elección de Jugadores y Transferencias",
    children: [
      { id: "2.1 Elección de jugadores", label: "2.1 Elección de jugadores" },
      { id: "2.2 Transferencias", label: "2.2 Transferencias" },
    ],
  },
  {
    id: "3. Formato de los Partidos",
    label: "3. Formato de los Partidos",
    children: [
      { id: "3.1 Estructura", label: "3.1 Estructura" },
      { id: "3.2 Duración", label: "3.2 Duración" },
      { id: "3.3 Inicio de los partidos", label: "3.3 Inicio de los partidos" },
      {
        id: "3.4 Desarrollo del juego",
        label: "3.4 Desarrollo del juego",
        children: [
          { id: "Goles y puntos", label: "Goles y puntos" },
          { id: "Reglas específicas", label: "Reglas específicas" },
          { id: "Faltas y manos", label: "Faltas y manos" },
        ],
      },
    ],
  },
  { id: "5. Premios y Reconocimientos", label: "5. Premios y Reconocimientos" },
  {
    id: "6. Participación de Jugadores Externos",
    label: "6. Participación de Jugadores Externos",
    children: [
      {
        id: "6.1 Mínimo de jugadores por equipo",
        label: "6.1 Mínimo de jugadores por equipo",
      },
      {
        id: "6.2 Condiciones para la aprobación de externos",
        label: "6.2 Condiciones para la aprobación de externos",
      },
    ],
  },
  {
    id: "7. Pago por Jornada e Inscripción",
    label: "7. Pago por Jornada e Inscripción",
  },
  {
    id: "8. Sanciones",
    label: "8. Sanciones",
    children: [
      { id: "8.1 Faltas sancionables", label: "8.1 Faltas sancionables" },
      { id: "8.2 Reglas de Conducta", label: "8.2 Reglas de Conducta" },
      {
        id: "8.3 Nueva regla sobre el calzado",
        label: "8.3 Nueva regla sobre el calzado",
      },
      { id: "8.4 Tipos de sanciones", label: "8.4 Tipos de sanciones" },
      { id: "8.5 Cuidado de Petos", label: "8.5 Cuidado de Petos" },
    ],
  },
  { id: "9. Anotador", label: "9. Anotador" },
  {
    id: "10. Requisitos para ser considerado jugador del equipo campeón",
    label: "10. Requisitos para ser considerado jugador del equipo campeón",
  },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderMenu(items: any[], activeId: string, level = 0) {
  return (
    <ul className={level === 0 ? "space-y-1" : "ml-4 space-y-0.5"}>
      {items.map((item) => (
        <li key={item.id}>
          <button
            className={`w-full text-left px-2 py-1 rounded transition font-medium text-sm
              ${
                activeId === item.id
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-blue-100 text-gray-800"
              }
              ${level === 0 ? "font-bold" : "font-normal"}
            `}
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
          {item.children && renderMenu(item.children, activeId, level + 1)}
        </li>
      ))}
    </ul>
  );
}

export const SidebarReglamento: React.FC<{ activeId: string }> = ({
  activeId,
}) => (
  <aside className="w-72 min-w-[200px] max-w-xs bg-white border-r border-gray-200 p-4 h-screen sticky top-0 overflow-y-auto shadow-sm">
    <div className="mb-4 text-lg font-bold text-blue-700">
      Reglamento Liga PPT
    </div>
    {renderMenu(SECTIONS, activeId)}
  </aside>
);
