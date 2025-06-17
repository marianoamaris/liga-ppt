// Este archivo es el encargado de popular la información que se muestra en la página principal (Home) de la Liga PPT.
// Aquí se encuentran los datos en vivo de equipos, goleadores, arqueros y cualquier otra estadística relevante.
// Se separa en su propio archivo para facilitar la actualización diaria de la información sin tener que modificar la lógica del Home.
// Actualiza este archivo cada vez que quieras mostrar nueva información o modificar los datos visibles en el Home.

export const GOLEADORES = [
  {
    nombre: "José Hernández",
    equipo: "Sport Boys",
    color: "#ffc0cb",
    goles: 27,
  },
  { nombre: "Mario Orozco", equipo: "Fiorentina", color: "#a020f0", goles: 17 },
  { nombre: "Yassir Fuentes", equipo: "Holanda", color: "#ffa500", goles: 16 },
  {
    nombre: "Jürgen Hassler",
    equipo: "Inglaterra",
    color: "#ffff",
    goles: 14,
  },
  {
    nombre: "Keiler Fonseca",
    equipo: "Rosario Centrar",
    color: "#ffe135",
    goles: 12,
  },
];
export const ARQUEROS = [
  {
    nombre: "Brayan Cadena",
    equipo: "Sport Boys",
    color: "#ffc0cb",
    derrotas: 32,
  },
  {
    nombre: "Fernando Gómez",
    equipo: "Holanda",
    color: "#ffa500",
    derrotas: 33,
  },
  {
    nombre: "Leonardo Cadena",
    equipo: "Alemania",
    color: "#000000",
    derrotas: 33,
  },
  {
    nombre: "Camilo Laborde",
    equipo: "AC Milan",
    color: "#ff0000",
    derrotas: 37,
  },
  {
    nombre: "Santiago Sánchez",
    equipo: "Celta de Vigo",
    color: "#339cff",
    derrotas: 37,
  },
];

export const EQUIPOS_FULL = [
  {
    nombre: "Sport Boys",
    color: "#ffc0cb", // rosado
    pj: 106,
    v: 60,
    e: 14,
    d: 32,
    perc: "57%",
    pts: 134,
  },
  {
    nombre: "Fiorentina",
    color: "#a020f0", // morado
    pj: 111,
    v: 53,
    e: 10,
    d: 48,
    perc: "48%",
    pts: 116,
  },
  {
    nombre: "Holanda",
    color: "#ffa500", // naranja
    pj: 91,
    v: 46,
    e: 12,
    d: 33,
    perc: "51%",
    pts: 104,
  },
  {
    nombre: "Alemania",
    color: "#000000", // negro
    pj: 88,
    v: 39,
    e: 16,
    d: 33,
    perc: "44%",
    pts: 94,
  },
  {
    nombre: "Inglaterra",
    color: "#ffffff", // blanco
    pj: 91,
    v: 39,
    e: 14,
    d: 38,
    perc: "43%",
    pts: 92,
  },
  {
    nombre: "AC Milan",
    color: "#ff0000", // rojo
    pj: 85,
    v: 36,
    e: 12,
    d: 37,
    perc: "42%",
    pts: 84,
  },
  {
    nombre: "Palmeiras",
    color: "#00ff00", // verde
    pj: 95,
    v: 33,
    e: 6,
    d: 56,
    perc: "35%",
    pts: 72,
  },
  {
    nombre: "Celta de Vigo",
    color: "#339cff", // azul
    pj: 78,
    v: 28,
    e: 13,
    d: 37,
    perc: "36%",
    pts: 69,
  },
  {
    nombre: "Rosario Central",
    color: "#ffe135", // amarillo
    pj: 81,
    v: 26,
    e: 11,
    d: 44,
    perc: "32%",
    pts: 63,
  },
];
