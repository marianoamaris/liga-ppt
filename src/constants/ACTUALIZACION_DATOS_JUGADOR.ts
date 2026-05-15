/** Correo de contacto de la liga (notificaciones Netlify Forms → configurar a esta dirección). */
export const CONTACTO_LIGA_EMAIL = "contacto@ligappt.com";

/** Nombre del formulario en Netlify (debe coincidir con `index.html` y con `form-name`). */
export const NETLIFY_FORM_ACTUALIZACION_DATOS = "actualizacion-datos-jugador";

/**
 * Ventana del formulario “Actualizar mis datos” (jugadores → liga).
 *
 * - `ligasTemporadaFinalizadas`: pon en `false` mientras la temporada siga en
 *   curso; en `true` cuando todas las ligas relevantes hayan terminado.
 * - `mundialPptInicio`: el módulo se oculta desde esta fecha/hora (inicio del
 *   Mundial PPT). Ajusta el valor cuando tengas la fecha oficial (ISO 8601).
 */
export const ACTUALIZACION_DATOS_JUGADOR = {
  ligasTemporadaFinalizadas: true,
  mundialPptInicio: "2026-08-01T10:00:00-05:00",
} as const;

export function isFormularioActualizacionDatosAbierto(): boolean {
  if (!ACTUALIZACION_DATOS_JUGADOR.ligasTemporadaFinalizadas) return false;
  return Date.now() < Date.parse(ACTUALIZACION_DATOS_JUGADOR.mundialPptInicio);
}
