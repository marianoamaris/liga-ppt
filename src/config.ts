/**
 * Configuración de la aplicación. No son datos de la liga: eso vive en la base
 * y se consume vía `hooks/useCatalogo` y `context/SedeContext`.
 */

/**
 * Sede que se abre en la primera visita, antes de que el usuario elija una.
 * Valledupar es donde nació la liga y donde está la mayoría de jugadores.
 */
export const SEDE_POR_DEFECTO = "vup";

/** Clave de localStorage donde se recuerda la última sede consultada. */
export const CLAVE_SEDE = "ligappt_sede";
