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

function renderSections(items: any[], level = 0) {
  return items.map((item) => {
    const Tag = level === 0 ? "h2" : level === 1 ? "h3" : "h4";
    return (
      <section
        key={item.id}
        id={item.id}
        data-section-id={item.id}
        className="mb-8 scroll-mt-24"
      >
        <Tag
          className={`font-bold mb-2 ${
            level === 0
              ? "text-2xl text-blue-700"
              : level === 1
              ? "text-xl text-blue-600"
              : "text-lg text-blue-500"
          }`}
        >
          {item.label}
        </Tag>
        <div className="mb-2 text-gray-700">
          {/* Aquí iría el contenido real del reglamento para {item.label} */}
          <span className="italic text-gray-400">
            Contenido de {item.label}...
          </span>
        </div>
        {item.children && renderSections(item.children, level + 1)}
      </section>
    );
  });
}

export const ReglamentoViewer: React.FC = () => (
  <div>{renderSections(SECTIONS)}</div>
);
