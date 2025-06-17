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
      { id: "3.4 Desarrollo del juego", label: "3.4 Desarrollo del juego" },
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

function EquipoDemo({ nombre, color }: { nombre: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 mb-1 mr-3">
      <span
        className="inline-block w-4 h-4 border border-gray-400 rounded-full"
        style={{ background: color }}
        title={nombre}
      />
      <span className="text-xs font-semibold" style={{ color }}>
        {nombre}
      </span>
    </span>
  );
}

function BracketDemo() {
  // Equipos demo
  const equipos = [
    { nombre: "Rojo", color: "#D00027" },
    { nombre: "Verde", color: "#22C55E" },
    { nombre: "Azul", color: "#2563EB" },
    { nombre: "Morado", color: "#9333EA" },
    { nombre: "Naranja", color: "#F97316" },
    { nombre: "Negro", color: "#222222" },
    { nombre: "Amarillo", color: "#FFD600" },
    { nombre: "Rosado", color: "#FF69B4" },
    { nombre: "Marrón", color: "#7A263A" },
  ];
  // Tabla de posiciones demo
  const tabla = [
    "Rojo",
    "Verde",
    "Azul",
    "Morado",
    "Naranja",
    "Negro",
    "Amarillo",
    "Rosado",
    "Marrón",
  ];
  return (
    <div className="my-4">
      <div className="mb-2 font-bold text-blue-700">
        Ejemplo visual de tabla de posiciones y playoffs
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Tabla de posiciones */}
        <div>
          <div className="mb-1 text-sm font-semibold text-gray-700">
            Tabla de posiciones (ejemplo)
          </div>
          <table className="min-w-[180px] text-xs border rounded shadow bg-white">
            <thead>
              <tr className="text-gray-600 bg-gray-100">
                <th className="px-2 py-1">#</th>
                <th className="px-2 py-1">Equipo</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((eq, i) => {
                let rowBg = "";
                if (i < 2) rowBg = "bg-yellow-100"; // 1 y 2 dorado suave
                else if (i >= 2 && i <= 5) rowBg = "bg-blue-100"; // 3-6 azulito
                else if (i >= 6) rowBg = "bg-red-100"; // 7-9 rojo leve
                return (
                  <tr key={eq} className={`border-b last:border-b-0 ${rowBg}`}>
                    <td className="px-2 py-1 font-bold text-center text-gray-500">
                      {i + 1}
                    </td>
                    <td className="px-2 py-1">
                      <EquipoDemo nombre={eq} color={equipos[i].color} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Bracket demo */}
        <div className="flex-1 min-w-[220px]">
          <div className="mb-1 text-sm font-semibold text-gray-700">
            Playoffs (ejemplo)
          </div>
          <div className="flex flex-col gap-2">
            {/* Cuartos de final */}
            <div>
              <div className="mb-1 text-xs font-bold text-gray-600">
                Cuartos de final
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <EquipoDemo nombre="Azul" color="#2563EB" />
                  <span className="text-xs">vs</span>
                  <EquipoDemo nombre="Negro" color="#222222" />
                </div>
                <div className="flex items-center gap-2">
                  <EquipoDemo nombre="Morado" color="#9333EA" />
                  <span className="text-xs">vs</span>
                  <EquipoDemo nombre="Naranja" color="#F97316" />
                </div>
              </div>
            </div>
            {/* Semifinales */}
            <div>
              <div className="mb-1 text-xs font-bold text-gray-600">
                Semifinales
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <EquipoDemo nombre="Rojo" color="#D00027" />
                  <span className="text-xs">vs</span>
                  <EquipoDemo nombre="Morado" color="#9333EA" />
                </div>
                <div className="flex items-center gap-2">
                  <EquipoDemo nombre="Verde" color="#22C55E" />
                  <span className="text-xs">vs</span>
                  <EquipoDemo nombre="Naranja" color="#F97316" />
                </div>
              </div>
            </div>
            {/* Final */}
            <div>
              <div className="mb-1 text-xs font-bold text-gray-600">Final</div>
              <div className="flex items-center gap-2">
                <EquipoDemo nombre="Rojo" color="#D00027" />
                <span className="text-xs">vs</span>
                <EquipoDemo nombre="Naranja" color="#F97316" />
                <span className="ml-2 text-xs font-bold text-blue-700">
                  🏆 Campeón: Rojo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-600">
        <b>Nota:</b> Los equipos que terminan 1º y 2º en la tabla avanzan
        directo a semifinales. Los puestos 3º a 6º juegan cuartos de final. Los
        ganadores avanzan a semifinales y luego a la final. <br />
        <b>Colores y nombres de equipos son solo ejemplo visual.</b>
      </div>
    </div>
  );
}

function getReglamentoContent(id: string) {
  switch (id) {
    case "1.1 Liga PPT":
      return (
        <div className="space-y-2">
          <p>
            La Liga PPT es una liga de fútbol 6 aficionado que se organiza en:
          </p>
          <ul className="pl-6 list-disc">
            <li>
              <b>Fase Regular:</b> Consta de 6 jornadas regulares, que se juegan
              los jueves de 6:00 p.m. a 8:00 p.m., salvo que el Consejo
              Administrativo decida lo contrario.
              <br />
              <b>Ubicación:</b> Canchas 1, 2 y 3 de Omar Geles, Carrera 4, a
              menos que se indique lo contrario por parte del Consejo
              Administrativo.
            </li>
            <li>
              <b>Fase Final – Playoff Expandido (6 clasificados):</b> Tras la
              fase regular, se clasifican los 6 mejores equipos para disputar la
              etapa final.
              <ul className="pl-6 mt-1 list-disc">
                <li>
                  <b>Descanso / Recompensa para 1.º y 2.º lugar:</b> Los equipos
                  que terminen en 1.ª y 2.ª posición avanzan directamente a las
                  semifinales, como premio a su rendimiento durante la fase
                  regular.
                </li>
                <li>
                  <b>Cuartos de Final:</b> Los equipos que terminen en 3.º a 6.º
                  lugar disputan una ronda previa de cuartos de final.
                  <ul className="pl-6 mt-1 list-disc">
                    <li>
                      Emparejamientos de cuartos de final:
                      <ul className="pl-6 mt-1 list-disc">
                        <li>3.º vs 6.º</li>
                        <li>4.º vs 5.º</li>
                      </ul>
                    </li>
                    <li>
                      Los ganadores de estos partidos avanzan a las semifinales.
                    </li>
                  </ul>
                </li>
                <li>
                  <b>Semifinales:</b>
                  <ul className="pl-6 mt-1 list-disc">
                    <li>
                      Semifinal A: 1.º (clasificado directo) vs ganador del 4.º
                      vs 5.º
                    </li>
                    <li>
                      Semifinal B: 2.º (clasificado directo) vs ganador del 3.º
                      vs 6.º
                    </li>
                  </ul>
                </li>
                <li>
                  <b>Final:</b> Los ganadores de las semifinales se enfrentan en
                  un partido único para definir al campeón.
                </li>
              </ul>
            </li>
          </ul>
          <BracketDemo />
        </div>
      );
    case "1.2 Tabla de posiciones":
      return (
        <div className="space-y-2">
          <p>
            A lo largo del torneo se elaborará una tabla de posiciones que se
            actualizará tras cada jornada. Esta tabla servirá para determinar
            los cruces en las fases eliminatorias (cuartos de final, semifinales
            y final), y se organizará teniendo en cuenta los siguientes
            criterios:
          </p>
          <ol className="pl-6 list-decimal">
            <li>
              <b>Puntos:</b> se otorgan 2 puntos por victoria, 1 punto por
              empate y 0 puntos por derrota.
            </li>
            <li>
              <b>Desempates:</b>
              <ul className="pl-6 mt-1 list-disc">
                <li>
                  En caso de empate en puntos entre dos o más equipos, se
                  aplicarán los siguientes criterios, en orden:
                  <ol className="pl-6 mt-1 list-decimal">
                    <li>Mayor cantidad de victorias.</li>
                    <li>Menor cantidad de goles recibidos.</li>
                  </ol>
                </li>
              </ul>
            </li>
            <li>
              <b>Ventaja en eliminación directa:</b>
              <ul className="pl-6 mt-1 list-disc">
                <li>
                  Si en cuartos de final, semifinal o final hay empate al
                  finalizar el partido, el equipo que esté más arriba en la
                  tabla de posiciones avanzará automáticamente.
                </li>
                <li>
                  Por ello, la tabla no solo define los cruces, sino que también
                  puede ser determinante en las fases eliminatorias.
                </li>
              </ul>
            </li>
          </ol>
          {/* Ejemplo visual de tabla de posiciones con stats */}
          <div className="my-4">
            <div className="mb-2 font-bold text-blue-700">
              Ejemplo práctico de tabla de posiciones
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[320px] text-xs border rounded shadow bg-white">
                <thead>
                  <tr className="text-gray-600 bg-gray-100">
                    <th className="px-2 py-1">#</th>
                    <th className="px-2 py-1">Equipo</th>
                    <th className="px-2 py-1">V</th>
                    <th className="px-2 py-1">E</th>
                    <th className="px-2 py-1">D</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { nombre: "Rojo", color: "#D00027", v: 4, e: 1, d: 1 },
                    { nombre: "Verde", color: "#22C55E", v: 3, e: 2, d: 1 },
                    { nombre: "Azul", color: "#2563EB", v: 3, e: 1, d: 2 },
                    { nombre: "Morado", color: "#9333EA", v: 2, e: 3, d: 1 },
                    { nombre: "Naranja", color: "#F97316", v: 2, e: 2, d: 2 },
                    { nombre: "Negro", color: "#222222", v: 2, e: 1, d: 3 },
                    { nombre: "Amarillo", color: "#FFD600", v: 1, e: 2, d: 3 },
                    { nombre: "Rosado", color: "#FF69B4", v: 1, e: 1, d: 4 },
                    { nombre: "Marrón", color: "#7A263A", v: 0, e: 2, d: 4 },
                  ].map((row, i) => {
                    let rowBg = "";
                    if (i < 2) rowBg = "bg-yellow-100";
                    else if (i >= 2 && i <= 5) rowBg = "bg-blue-100";
                    else if (i >= 6) rowBg = "bg-red-100";
                    return (
                      <tr
                        key={row.nombre}
                        className={`border-b last:border-b-0 ${rowBg}`}
                      >
                        <td className="px-2 py-1 font-bold text-center text-gray-500">
                          {i + 1}
                        </td>
                        <td className="px-2 py-1">
                          <EquipoDemo nombre={row.nombre} color={row.color} />
                        </td>
                        <td className="px-2 py-1 font-bold text-center text-green-700">
                          {row.v}
                        </td>
                        <td className="px-2 py-1 font-bold text-center text-yellow-700">
                          {row.e}
                        </td>
                        <td className="px-2 py-1 font-bold text-center text-red-700">
                          {row.d}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <b>V = Victorias:</b> Partidos ganados (otorgan 2 puntos).
              <br />
              <b>E = Empates:</b> Partidos que terminaron igualados y no hubo
              gol en los 8 minutos reglamentarios (1 punto).
              <br />
              <b>D = Derrotas:</b> Partidos perdidos (0 puntos).
              <br />
            </div>
          </div>
        </div>
      );
    case "1.3 Administración":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>
              La Liga es gestionada por un Consejo Administrativo, que organiza
              cada edición, realiza comunicados oficiales, gestiona el dinero y
              toma decisiones importantes.
            </li>
            <li>
              Todas las decisiones y acciones relacionadas con la Liga están
              sujetas a la supervisión y aprobación del Consejo Administrativo.
            </li>
            <li>
              El Consejo Administrativo tiene la autoridad final en todos los
              asuntos de la Liga, y sus decisiones son definitivas e
              inapelables.
            </li>
            <li>
              Los participantes deben acatar todas las resoluciones y
              directrices del Consejo Administrativo.
            </li>
            <li>
              Los administradores establecerán un grupo de WhatsApp oficial,
              donde estarán capitanes, jugadores y administradores. Toda
              información relevante se comunicará por este medio.
            </li>
          </ul>
        </div>
      );
    case "1.4 Equipos y jugadores":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>Número de equipos: 9.</li>
            <li>
              Cada equipo está compuesto por 8 jugadores (7 de campo + 1
              arquero), aunque se juega con 6 (1 arquero y 5 jugadores de
              campo). Se pueden hacer cuantos cambios deseen, incluso durante
              los partidos, siempre y cuando el balón no esté en juego.
            </li>
            <li>
              Los nombres de los equipos y colores de petos (negro, verde,
              naranja, azul, morado, rojo, rosado, amarillo, marrón) se definen
              antes de cada edición mediante dinámica establecida por los
              administradores.
            </li>
            <li>
              Los petos son entregados por el Consejo Administrativo al inicio
              de la temporada y deben ser devueltos en óptimas condiciones al
              finalizar.
            </li>
          </ul>
        </div>
      );
    case "1.5 Capitanes":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>
              Cada equipo tiene un capitán, elegido por el Consejo
              Administrativo.
            </li>
            <li>
              <b>Responsabilidades del capitán:</b>
              <ul className="pl-6 mt-1 list-disc">
                <li>Seleccionar jugadores antes del inicio de la temporada.</li>
                <li>
                  Gestionar pagos y entregarlos al encargado de finanzas antes
                  de cada jornada, cuartos de final, semifinal o final.
                </li>
                <li>
                  Definir la alineación y realizar cambios durante los partidos.
                </li>
                <li>Participar en piedra, papel o tijera en caso de empate.</li>
                <li>
                  Comunicar novedades, inquietudes y pagos a los
                  administradores.
                </li>
                <li>
                  Mantener buen ambiente interno y evitar conflictos o
                  comportamientos antideportivos.
                </li>
                <li>
                  Velar por la conducta respetuosa de sus jugadores hacia
                  compañeros, rivales, árbitros y espectadores.
                </li>
                <li>
                  Estar disponible para contacto con los administradores en
                  cualquier momento.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      );
    case "1.6 Jugadores":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>
              Cada jugador debe estar pendiente de los horarios y fechas de los
              partidos.
            </li>
            <li>
              Debe informar a su capitán sobre ausencias o retrasos con
              antelación.
            </li>
          </ul>
        </div>
      );
    case "2.1 Elección de jugadores":
      return (
        <div className="space-y-4">
          <ul className="pl-6 list-disc">
            <li>
              Antes de cada edición, los capitanes eligen a sus jugadores
              mediante la dinámica definida por el Consejo Administrativo.
            </li>
          </ul>
          <div className="my-2">
            <div className="mb-1 font-bold text-blue-700">
              Ejemplo práctico de elección de jugadores
            </div>
            <div className="mb-2 text-sm text-gray-700">
              Para lograr equipos equilibrados y evitar que se repitan los
              mismos equipos cada liga, los jugadores se agrupan en "bolsas"
              según su posición:
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Bolsas por posición */}
              <div>
                <div className="mb-1 text-xs font-semibold text-gray-600">
                  Bolsas de jugadores
                </div>
                <table className="min-w-[180px] text-xs border rounded shadow bg-white">
                  <thead>
                    <tr className="text-gray-600 bg-gray-100">
                      <th className="px-2 py-1">Posición</th>
                      <th className="px-2 py-1">Jugadores</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-1 font-bold text-blue-700">
                        Arqueros
                      </td>
                      <td className="px-2 py-1">
                        Juan, Pedro, Andrés, Diego, Luis, Carlos, Mateo, Pablo,
                        Sergio
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 font-bold text-green-700">
                        Defensas
                      </td>
                      <td className="px-2 py-1">
                        Mario, Felipe, David, Jorge, Samuel, Tomás, Julián,
                        Esteban, Nicolás
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 font-bold text-yellow-700">
                        Mediocampistas
                      </td>
                      <td className="px-2 py-1">
                        Alejandro, Martín, Camilo, Daniel, Sebastián, Hugo,
                        Simón, Lucas, Emiliano
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 font-bold text-red-700">
                        Delanteros
                      </td>
                      <td className="px-2 py-1">
                        Oscar, Bruno, Rafael, Iván, Kevin, Adrián, Fabián,
                        Ramiro, Elías
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Turnos de elección */}
              <div className="flex-1 min-w-[180px]">
                <div className="mb-1 text-xs font-semibold text-gray-600">
                  Turnos de elección (ejemplo)
                </div>
                <table className="min-w-[120px] text-xs border rounded shadow bg-white">
                  <thead>
                    <tr className="text-gray-600 bg-gray-100">
                      <th className="px-2 py-1">Ronda</th>
                      <th className="px-2 py-1">Capitán que elige</th>
                      <th className="px-2 py-1">Posición</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-1 text-center">1</td>
                      <td className="px-2 py-1">Capitán 3</td>
                      <td className="px-2 py-1">Arquero</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 text-center">2</td>
                      <td className="px-2 py-1">Capitán 1</td>
                      <td className="px-2 py-1">Defensa</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 text-center">3</td>
                      <td className="px-2 py-1">Capitán 2</td>
                      <td className="px-2 py-1">Mediocampista</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 text-center">4</td>
                      <td className="px-2 py-1">Capitán 4</td>
                      <td className="px-2 py-1">Delantero</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 text-center">5</td>
                      <td className="px-2 py-1">Capitán 2</td>
                      <td className="px-2 py-1">Arquero</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <b>¿Cómo funciona?</b> Los jugadores se agrupan por posición. El
              orden de elección de los capitanes se define de forma aleatoria en
              cada ronda y para cada posición. Así, cada capitán va eligiendo un
              jugador de la bolsa correspondiente en su turno. Esto permite que
              los equipos sean más equilibrados y que haya sorpresa en la
              conformación de los equipos, evitando que se repitan los mismos
              equipos en cada edición.
            </div>
          </div>
        </div>
      );
    case "2.2 Transferencias":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>Permitidas hasta el final de la jornada 3.</li>
            <li>
              <b>Requisitos:</b>
              <ul className="pl-6 mt-1 list-disc">
                <li>Ambos capitanes deben estar de acuerdo.</li>
                <li>La transferencia debe ser uno por uno.</li>
                <li>Los jugadores no pueden rechazar una transferencia.</li>
                <li>Desde la jornada 4, no se permiten más transferencias.</li>
              </ul>
            </li>
          </ul>
        </div>
      );
    case "3.1 Estructura":
      return (
        <div className="space-y-4">
          <ul className="pl-6 list-disc">
            <li>
              Cada edición contará con 9 equipos, distribuidos en 3 canchas por
              jornada, de modo que haya 3 equipos por cada cancha.
            </li>
            <li>
              En cada cancha habrá un triangular rotativo: cada equipo juega
              contra los otros dos.
            </li>
            <li>
              La distribución de los equipos en las canchas se define mediante
              sorteo previo a cada edición.
            </li>
          </ul>
          <div className="my-2">
            <div className="mb-1 font-bold text-blue-700">
              Ejemplo práctico de estructura de jornada
            </div>
            <div className="mb-2 text-sm text-gray-700">
              Supongamos que los 9 equipos se sortean y quedan así para una
              jornada:
            </div>
            <div className="flex flex-col gap-4 md:flex-row">
              {/* Tabla de distribución */}
              <div>
                <div className="mb-1 text-xs font-semibold text-gray-600">
                  Distribución por canchas
                </div>
                <table className="min-w-[180px] text-xs border rounded shadow bg-white">
                  <thead>
                    <tr className="text-gray-600 bg-gray-100">
                      <th className="px-2 py-1">Cancha</th>
                      <th className="px-2 py-1">Equipos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-1 font-bold text-blue-700">1</td>
                      <td className="px-2 py-1">Rojo, Verde, Azul</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 font-bold text-green-700">2</td>
                      <td className="px-2 py-1">Morado, Naranja, Negro</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 font-bold text-yellow-700">3</td>
                      <td className="px-2 py-1">Amarillo, Rosado, Marrón</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Triangular rotativo */}
              <div className="flex-1 min-w-[180px]">
                <div className="mb-1 text-xs font-semibold text-gray-600">
                  Triangular en cada cancha
                </div>
                <table className="min-w-[120px] text-xs border rounded shadow bg-white">
                  <thead>
                    <tr className="text-gray-600 bg-gray-100">
                      <th className="px-2 py-1">Partido</th>
                      <th className="px-2 py-1">Equipos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-2 py-1 text-center">1</td>
                      <td className="px-2 py-1">Rojo vs Verde</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 text-center">2</td>
                      <td className="px-2 py-1">Verde vs Azul</td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 text-center">3</td>
                      <td className="px-2 py-1">Azul vs Rojo</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 text-xs text-gray-600">
                  <b>Nota:</b> En cada cancha, los tres equipos juegan entre sí.
                  Así, todos tienen dos partidos por jornada y el orden de
                  partidos puede variar.
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              <b>¿Cómo se define?</b> Antes de cada edición, se realiza un
              sorteo para asignar los equipos a las canchas. Esto le da variedad
              y sorpresa a cada jornada.
            </div>
          </div>
        </div>
      );
    case "3.2 Duración":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>
              Cada partido regular dura 8 minutos cronometrados, a menos que
              haya gol antes.
            </li>
            <li>
              Si al finalizar el tiempo no hay goles, se permite una última
              jugada hasta que el balón salga. Si hay gol, el equipo que lo
              marque gana y se queda en cancha. Si no hay gol, los capitanes
              juegan piedra, papel o tijera y el que gane se queda en cancha y
              juega con el siguiente equipo.
            </li>
            <li>Cuartos de final, semifinales y final duran 1 hora.</li>
          </ul>
        </div>
      );
    case "3.3 Inicio de los partidos":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>En la primera jornada, se sortea el saque inicial.</li>
            <li>
              Desde la segunda jornada:
              <ul className="pl-6 mt-1 list-disc">
                <li>
                  El primer partido lo disputan los dos equipos mejor
                  clasificados.
                </li>
                <li>El mejor clasificado hace el saque inicial.</li>
              </ul>
            </li>
          </ul>
        </div>
      );
    case "3.4 Desarrollo del juego":
      return (
        <div className="space-y-4">
          <div>
            <b>Goles y puntos:</b>
            <ul className="pl-6 mt-1 list-disc">
              <li>El equipo que anota un gol gana y recibe 2 puntos.</li>
              <li>Si no hay goles tras 8 minutos: 1 punto por equipo.</li>
              <li>
                En caso de empate, se define con piedra, papel o tijera entre
                capitanes. El ganador se queda en cancha.
              </li>
            </ul>
          </div>
          <div>
            <b>Reglas específicas:</b>
            <ul className="pl-6 mt-1 list-disc">
              <li>
                El saque inicial es desde la mitad, con primer toque hacia
                atrás. En caso de no hacerlo así, se reinicia el saque.
              </li>
              <li>
                Saque de banda y esquina con las manos, por encima de la cabeza,
                en máximo 8 segundos. Si el anotador cuenta más de 8 segundos
                desde que el jugador que hará el saque tiene el balón, decidirá
                un cambio de saque para el otro equipo.
              </li>
              <li>
                Si el balón sale por el lado del arquero, él reanuda el juego.
              </li>
              <li>
                Si golpea la malla superior, se reinicia con saque de banda
                desde la mitad para el rival.
              </li>
              <li>
                No se permiten goles con la mano por parte del arquero, salvo
                desvío o rebote. En caso de un gol así, el arquero contrario
                reiniciará el juego.
              </li>
              <li>
                El arquero no puede tomar con las manos un pase intencionado con
                los pies de su compañero. En caso de hacerlo, será falta y
                reiniciará el juego el arquero contrario.
              </li>
              <li>
                Si el arquero suelta el balón de las manos y lo juega con los
                pies, ya no puede tomarlo nuevamente con las manos. En caso de
                hacerlo, será falta y reiniciará el juego el arquero contrario.
              </li>
              <li>
                Una vez que el arquero lo tome con las manos, debe despejarlo en
                máximo 8 segundos. En caso de no hacerlo y una vez que el
                anotador cuente los 8 segundos, será falta y reiniciará el juego
                el arquero contrario.
              </li>
            </ul>
          </div>
          <div>
            <b>Faltas y manos:</b>
            <ul className="pl-6 mt-1 list-disc">
              <li>
                Deben reclamarse diciendo "falta" o "mano" inmediatamente. No se
                aceptan expresiones como "hey" o "juez". Las faltas debe
                reclamarla el jugador que la recibió, no sus compañeros. La mano
                puede ser reclamada por cualquier jugador dentro de la cancha.
              </li>
              <li>
                Si hay desacuerdo, el anotador en cancha decide si es falta, si
                es mano, o si no hay nada. Durante este tiempo de decisión, no
                se puede seguir jugando.
              </li>
              <li>
                Si el anotador decide que hay falta/mano, reinicia el juego el
                arquero del equipo que recibió la falta o la mano. Si el
                anotador decide que no hay falta/mano, reinicia el juego el
                arquero al que le cobraron la sanción inicialmente.
              </li>
            </ul>
          </div>
        </div>
      );
    case "5. Premios y Reconocimientos":
      return (
        <div className="space-y-2">
          <b>Premios generales:</b>
          <ul className="pl-6 list-disc">
            <li>Equipo campeón: $1.000.000 pesos.</li>
            <li>Segundo lugar: $320.000</li>
            <li>Máximo goleador: $80.000 pesos.</li>
            <li>Mejor arquero: $80.000 pesos.</li>
            <li>MVP de la liga: $80.000 pesos.</li>
            <li>MVP de la final: $80.000 pesos.</li>
          </ul>
          <div className="text-xs text-gray-700">
            Los premios son basados en las estadísticas de las 6 jornadas
            regulares, excepto para el MVP de la final. Es decir, máximo
            goleador y mejor arquero serán el que más goles haga en las 6
            jornadas y el que menos goles reciba en las 6 jornadas,
            respectivamente. Tanto el premio MVP de la liga como el MVP de la
            final los decide el Consejo Administrativo. Todos los premios son
            dados en la final de la liga, y en caso de ganarlos, la condición es
            que el ganador del premio, en caso de ser individual, tendrá que ir
            a la final para reclamarlo.
          </div>
          <b>Premio especial:</b>
          <ul className="pl-6 list-disc">
            <li>
              <b>King of the Hill:</b> $300.000. Se concede solo si un equipo
              queda de primero en la tabla durante las 6 jornadas consecutivas.
              Si ningún equipo lo logra, no se da este premio. Es independiente
              de los demás y se entrega al final de la liga.
            </li>
          </ul>
        </div>
      );
    case "6.1 Mínimo de jugadores por equipo":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>6 jugadores (1 arquero y 5 jugadores de campo).</li>
            <li>
              Con 5 jugadores o menos, se pueden incluir externos aprobados por
              el Consejo Administrativo.
            </li>
          </ul>
        </div>
      );
    case "6.2 Condiciones para la aprobación de externos":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>
              Al menos un administrador debe conocer al jugador externo y
              aprobarlo.
            </li>
            <li>No se permiten externos si ya hay 6 jugadores en el equipo.</li>
            <li>
              Si un equipo va incompleto y no logra conseguir externos, los
              otros equipos pueden prestarle jugadores. Si van 5, les prestan el
              arquero cuando su equipo no esté en cancha; si van menos, les
              pueden prestar otros jugadores. Esto es decisión de los demás
              equipos y sus capitanes. Si deciden no prestar a nadie, el equipo
              jugará con los jugadores que tenga disponibles.
            </li>
          </ul>
        </div>
      );
    case "7. Pago por Jornada e Inscripción":
      return (
        <div className="space-y-2">
          <b>Cuota por jugador:</b>
          <ul className="pl-6 list-disc">
            <li>
              $10.000 es la cuota de inscripción antes de cada liga para poder
              participar.
            </li>
            <li>
              $8.500 antes de cada jornada, cuartos de final, semifinal y final.
            </li>
            <li>El capitán consigna el dinero al encargado de finanzas.</li>
            <li>
              Cada jugador debe realizar el pago mediante transferencia bancaria
              antes de cada jornada.
            </li>
            <li>
              El capitán es responsable de verificar los pagos y consignar el
              monto total al encargado de finanzas del Consejo Administrativo.
            </li>
            <li>
              El pago debe realizarse a más tardar 5:00 pm del día de la
              jornada.
            </li>
          </ul>
        </div>
      );
    case "8.1 Faltas sancionables":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>
              La hora máxima de llegada es 6:29. A partir de las 6:30 hay
              sanción por llegar tarde a menos que haya avisado antes.
            </li>
            <li>
              Llegadas tarde sin aviso previo. Un jugador que no pueda asistir a
              una jornada, cuartos de final, semifinal o final tiene hasta las
              5:00 pm del mismo día para avisar a su capitán que no podrá
              asistir o que llegará tarde. El capitán debe informar
              inmediatamente a un administrador.
            </li>
            <li>Agresiones físicas.</li>
            <li>Irrespeto a otros participantes.</li>
            <li>
              No llevar o dañar el peto. Si un jugador no lleva peto, queda
              inhabilitado para jugar esa jornada.
            </li>
            <li>Reclamar faltas o manos sin fundamento y/o reiteradamente.</li>
            <li>Amenazar con retirarse reiteradamente.</li>
            <li>Incumplir reglamentos en general.</li>
            <li>Irrespetar a un administrador o anotador.</li>
            <li>
              Todos los jugadores deben haber realizado su pago antes de jugar
              cada jornada. Quien no haya pagado, no podrá ingresar al partido,
              sin excepciones. Si por error un jugador no habilitado llega a
              participar, el equipo podrá perder puntos y se evaluará si aplica
              una sanción adicional. La responsabilidad es compartida entre el
              jugador y el capitán.
            </li>
            <li>
              Solo pueden ingresar a la cancha jugadores registrados y
              organizadores de la liga. Personas externas o invitados NO pueden
              entrar a la cancha en ningún momento. Todo invitado será
              únicamente espectador, desde fuera del campo. El incumplimiento de
              esta norma puede generar sanciones graves al jugador responsable o
              incluso al equipo.
            </li>
          </ul>
        </div>
      );
    case "8.2 Reglas de Conducta":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>No se tolera violencia física.</li>
            <li>No se permite abandonar jornadas sin motivo mayor.</li>
            <li>
              Es obligatorio acatar las reglas y decisiones del Consejo
              Administrativo.
            </li>
            <li>Evitar conflictos con otros participantes.</li>
          </ul>
        </div>
      );
    case "8.3 Nueva regla sobre el calzado":
      return (
        <div className="space-y-2">
          <div>
            <b>
              A partir de la Liga 14, será obligatorio el uso de zapatillas para
              cancha sintética o calzado deportivo sin taches grandes.
            </b>
          </div>
          <ul className="pl-6 list-disc">
            <li>
              Queda prohibido el uso de guayos de fútbol con taches
              pronunciados, ya sean de goma, plástico o aluminio.
            </li>
            <li>
              Calzado permitido:
              <ul className="pl-6 mt-1 list-disc">
                <li>Zapatillas para cancha sintética</li>
                <li>Tenis deportivos sin taches grandes</li>
              </ul>
            </li>
            <li>
              No se permitirá jugar a quienes no cumplan con esta norma a partir
              de la Liga 14. Durante la Liga 13 será flexible, pero se
              recomienda comenzar a usar el calzado adecuado desde ya.
            </li>
          </ul>
        </div>
      );
    case "8.4 Tipos de sanciones":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>
              Pueden incluir restricciones de juego, tiempo en cancha, exclusión
              de partidos/jornadas o expulsión de la liga. Estas sanciones las
              decide el Consejo Administrativo y el capitán de cada equipo las
              puede apelar, sin embargo la administración tiene la última
              palabra.
            </li>
          </ul>
        </div>
      );
    case "8.5 Cuidado de Petos":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>
              Los petos son proporcionados por el Consejo Administrativo al
              inicio de cada temporada a cada jugador.
            </li>
            <li>
              Cada jugador es responsable de cuidar su peto en óptimas
              condiciones.
            </li>
            <li>
              Al final de cada edición de la liga, los jugadores deben entregar
              los petos limpios y sin daños.
            </li>
            <li>
              Cualquier deterioro o pérdida del peto será sancionado
              económicamente o con restricción de participación en futuras
              ediciones.
            </li>
            <li>
              El valor de reposición de un peto dañado o extraviado será
              descontado del premio del jugador en caso de que gane alguno o
              cobrado directamente al mismo.
            </li>
          </ul>
        </div>
      );
    case "9. Anotador":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>
              En las 6 jornadas regulares, habrá un anotador en cada cancha,
              quien se encargará de:
            </li>
            <ul className="pl-10 list-disc">
              <li>
                Registrar goles, puntos, arqueros que reciben goles y posibles
                sanciones.
              </li>
              <li>
                Entregar la planilla al administrador encargado de transcribir y
                publicar las estadísticas.
              </li>
            </ul>
          </ul>
        </div>
      );
    case "10. Requisitos para ser considerado jugador del equipo campeón":
      return (
        <div className="space-y-2">
          <ul className="pl-6 list-disc">
            <li>Jugar por lo menos 4 jornadas durante la fase regular.</li>
            <li>
              Participar un mínimo de 15 minutos tanto en semifinales como en la
              final.
            </li>
          </ul>
          <div className="text-xs text-gray-700">
            Todo jugador debe cumplir con este reglamento para garantizar el
            buen desarrollo de la Liga PPT. Al aceptar entrar en la liga, tiene
            presente que debe cumplir todas las reglas anteriormente
            mencionadas.
          </div>
        </div>
      );
    default:
      return null;
  }
}

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
          {getReglamentoContent(item.id) || ""}
        </div>
        {item.children && renderSections(item.children, level + 1)}
      </section>
    );
  });
}

export const ReglamentoViewer: React.FC = () => (
  <div>{renderSections(SECTIONS)}</div>
);
