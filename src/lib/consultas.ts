import {
  analisisApi,
  edicionesApi,
  jugadoresApi,
  logrosApi,
  palmaresApi,
  partidosApi,
  recordsApi,
  sedesApi,
  statsApi,
} from "./api";
import { invalidar, type Consulta } from "./cache";

/**
 * Todas las lecturas de la app, con su clave de caché y su frescura.
 *
 * Están juntas para que dos pantallas que piden lo mismo usen la misma clave:
 * si Inicio y En Vivo escribieran cada una la suya, la caché no podría
 * compartir nada entre ellas.
 *
 * Las claves de lo que depende de una edición terminan en `:<numero>`. Es lo
 * que usa `invalidarEdicion` cuando el anotador escribe.
 *
 * La frescura va según lo que tarda en cambiar cada cosa:
 *   - el padrón, las sedes, el palmarés o las ediciones cambian cuando alguien
 *     edita la liga, que es rara vez;
 *   - lo derivado de los partidos solo cambia mientras se juega, y por eso lo
 *     del directo pide su frescura según haya o no partido en curso.
 */

const MIN = 60_000;

/** Lo que cambia cuando alguien edita la liga. */
const CATALOGO = 5 * MIN;
/** Lo derivado de los partidos, fuera del directo. */
const DERIVADO = 2 * MIN;
/** Lo derivado de los partidos con partido en curso. */
const DIRECTO = 10_000;

function q<T>(clave: string, pedir: () => Promise<T>, frescoMs: number): Consulta<T> {
  return { clave, pedir, frescoMs };
}

export const consultas = {
  sedes: () => q("sedes", () => sedesApi.list(), CATALOGO),

  jugadores: (p: { incluirInciertos: boolean; sede?: string }) =>
    q(
      `jugadores:${p.incluirInciertos ? "todos" : "activos"}:${p.sede ?? "*"}`,
      () =>
        jugadoresApi
          .list({
            activo: p.incluirInciertos ? "todos" : "true",
            inciertos: p.incluirInciertos,
            ...(p.sede ? { sede: p.sede } : {}),
          })
          .then((r) => r.jugadores),
      CATALOGO
    ),
  perfil: (slug: string) => q(`perfil:${slug}`, () => jugadoresApi.perfil(slug), DERIVADO),

  ediciones: (sede?: string) =>
    q(`ediciones:${sede ?? "*"}`, () => edicionesApi.list(sede).then((r) => r.ediciones), CATALOGO),
  finales: (sede?: string) =>
    q(`finales:${sede ?? "*"}`, () => edicionesApi.finales(sede).then((r) => r.finales), CATALOGO),
  edicion: (numero: number) => q(`edicion:${numero}`, () => edicionesApi.get(numero), CATALOGO),
  equipos: (numero: number) => q(`equipos:${numero}`, () => edicionesApi.equipos(numero), CATALOGO),
  plantillas: (numero: number) =>
    q(`plantillas:${numero}`, () => edicionesApi.plantillas(numero), CATALOGO),
  historico: (numero: number) =>
    q(`historico:${numero}`, () => edicionesApi.historico(numero), DERIVADO),
  analisis: (numero: number) => q(`analisis:${numero}`, () => analisisApi.edicion(numero), DERIVADO),
  dorsales: (numero: number) => q(`dorsales:${numero}`, () => edicionesApi.dorsales(numero), DERIVADO),
  dorsalesHistorico: (sede: string) =>
    q(`dorsales-historico:${sede}`, () => edicionesApi.dorsalesHistorico(sede), DERIVADO),

  palmares: (sede?: string) =>
    q(`palmares:${sede ?? "*"}`, () => palmaresApi.todo(sede).then((r) => r.palmares), CATALOGO),
  titulos: (sede?: string) =>
    q(`titulos:${sede ?? "*"}`, () => palmaresApi.titulos(sede).then((r) => r.titulos), CATALOGO),
  logros: (sede: string) => q(`logros:${sede}`, () => logrosApi.todo(sede), DERIVADO),
  records: (sede?: string) =>
    q(`records:${sede ?? "*"}`, () => recordsApi.todo(sede).then((r) => r.records), CATALOGO),

  // ── Directo ────────────────────────────────────────────────────────────────
  // `vivo` solo cambia la frescura, no la clave: es el mismo dato, y lo que
  // pidió Inicio sirve en En Vivo.
  enVivo: (numero: number) =>
    q(`en-vivo:${numero}`, () => partidosApi.getEnVivo(numero).then((r) => r.enVivo), DIRECTO),
  clasificacion: (numero: number, vivo: boolean) =>
    q(
      `clasificacion:${numero}`,
      () => statsApi.clasificacion(numero).then((r) => r.standings),
      vivo ? DIRECTO : DERIVADO
    ),
  goleadores: (numero: number, vivo: boolean) =>
    q(
      `goleadores:${numero}`,
      () => statsApi.goleadores(numero).then((r) => r.goleadores),
      vivo ? DIRECTO : DERIVADO
    ),
  arqueros: (numero: number, vivo: boolean) =>
    q(
      `arqueros:${numero}`,
      () => statsApi.arqueros(numero).then((r) => r.arqueros),
      vivo ? DIRECTO : DERIVADO
    ),
  disciplina: (numero: number, vivo: boolean) =>
    q(
      `disciplina:${numero}`,
      () => statsApi.disciplina(numero).then((r) => r.disciplina),
      vivo ? DIRECTO : DERIVADO
    ),
};

/**
 * Da por viejo lo que se calcula a partir de los partidos de una edición —tabla,
 * rankings, histórico, análisis—, pero no el directo ni los catálogos.
 *
 * Es para cuando un partido empieza o termina: fuera del directo la tabla tiene
 * dos minutos de frescura, y la del cierre de la jornada tiene que verse ya.
 */
export function invalidarDerivados(numero: number) {
  const derivados = /^(clasificacion|goleadores|arqueros|disciplina|historico|analisis|dorsales):/;
  invalidar((clave) => derivados.test(clave) && clave.endsWith(`:${numero}`));
}
