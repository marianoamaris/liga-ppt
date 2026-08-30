import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShareNodes, FaWhatsapp } from "react-icons/fa6";
import { CONTACTO_LIGA_EMAIL } from "../constants/ACTUALIZACION_DATOS_JUGADOR";
import { useSede } from "../context/SedeContext";
import { horarioDeSede } from "../utils/horarios";
import type { Sede } from "../types/jugador";

/**
 * Anuncios.
 *
 * Antes acumulaba el historial completo de versiones de la app junto a tres
 * anuncios de ediciones ya cerradas. El historial de versiones interesa a quien
 * desarrolla, no a quien juega, así que queda solo lo accionable: cómo entrar.
 *
 * Hay un anuncio por ciudad y se arman con los datos de la sede, no a mano: el
 * horario estaba escrito en el texto y habría mentido en cuanto abrió Bogotá,
 * que juega otros días y a otra hora.
 */

/** La primera edición de una ciudad es noticia; la quinta ya no. */
const esCiudadNueva = (sede: Sede) => (sede.edicion_activa?.numero_sede ?? 99) === 1;

function tituloDe(sede: Sede): string {
  return esCiudadNueva(sede)
    ? `La Liga PPT llega a ${sede.nombre}`
    : `¿Quieres jugar en la Liga PPT ${sede.nombre}?`;
}

function textoDe(sede: Sede): string {
  return esCiudadNueva(sede)
    ? `Arranca la primera edición en ${sede.nombre} y estamos armando los equipos. ` +
        "Inscríbete ahora y entra desde la primera jornada."
    : `Abrimos el grupo de reservas en ${sede.nombre}: una lista de espera oficial ` +
        "para quienes quieran unirse. Inscríbete, completa tu perfil y serás de los " +
        "primeros en entrar cuando haya un cupo.";
}

function AnuncioSede({ sede, destacado }: { sede: Sede; destacado: boolean }) {
  const navigate = useNavigate();
  const { cambiarSede } = useSede();

  const nueva = esCiudadNueva(sede);
  const titulo = tituloDe(sede);
  const texto = textoDe(sede);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/participa-en-la-liga-ppt`
      : "/participa-en-la-liga-ppt";

  /**
   * Inscribirse desde el anuncio de una ciudad deja esa ciudad seleccionada:
   * quien pulsa aquí ya dijo dónde quiere jugar, y llegar al formulario con la
   * otra preseleccionada sería justo lo contrario de lo que pidió.
   */
  const irAInscribirse = () => {
    cambiarSede(sede.id);
    navigate("/participa-en-la-liga-ppt");
  };

  const compartir = () => {
    if (typeof navigator === "undefined") return;
    if (navigator.share) void navigator.share({ title: titulo, text: texto, url });
    else if (navigator.clipboard) void navigator.clipboard.writeText(url);
  };

  return (
    <article
      className={`flex flex-col gap-4 rounded-md border bg-surface p-5 ${
        destacado ? "border-chalk-3" : "border-line"
      }`}
    >
      <div>
        <span className="font-cond inline-flex items-center gap-2 text-[0.6875rem] text-vivo">
          <span className="size-1.5 rounded-full bg-vivo" />
          {nueva ? "Ciudad nueva · inscripciones abiertas" : "Inscripciones abiertas"}
        </span>
        <h2 className="font-cond mt-2 text-xl text-chalk">{titulo}</h2>
      </div>

      <p className="max-w-prose text-sm text-chalk-2">{texto}</p>

      <ul className="flex flex-col gap-2 border-t border-line pt-4 text-sm text-chalk-2">
        <li className="flex gap-3">
          <span className="font-cond w-16 shrink-0 text-chalk-3">Cuándo</span>
          <span className="first-letter:uppercase">{horarioDeSede(sede)}</span>
        </li>
        <li className="flex gap-3">
          <span className="font-cond w-16 shrink-0 text-chalk-3">Dónde</span>
          {sede.ciudad}
        </li>
        <li className="flex gap-3">
          <span className="font-cond w-16 shrink-0 text-chalk-3">Cómo</span>
          {nueva
            ? "Déjanos tus datos y te contactamos para armar tu equipo"
            : "Déjanos tus datos y te escribimos cuando se abra un cupo"}
        </li>
      </ul>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={irAInscribirse}
          className="font-cond cursor-pointer rounded-sm bg-chalk px-4 py-2.5 text-sm text-ink transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
        >
          Quiero inscribirme
        </button>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`}
          target="_blank"
          rel="noreferrer"
          className="font-cond inline-flex cursor-pointer items-center gap-2 rounded-sm border border-line px-4 py-2.5 text-sm text-chalk-2 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
        >
          <FaWhatsapp aria-hidden className="size-4" />
          Compartir
        </a>

        <button
          type="button"
          onClick={compartir}
          className="font-cond inline-flex cursor-pointer items-center gap-2 rounded-sm border border-line px-4 py-2.5 text-sm text-chalk-2 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
        >
          <FaShareNodes aria-hidden className="size-4" />
          Copiar enlace
        </button>
      </div>
    </article>
  );
}

export const AnunciosPage: React.FC = () => {
  const { sedes, sedeId, loading } = useSede();

  // La ciudad que se está mirando va primero; el resto sigue visible, porque que
  // la liga abra en otra ciudad es noticia para todos.
  const ordenadas = [...sedes].sort(
    (a, b) => Number(b.id === sedeId) - Number(a.id === sedeId)
  );

  return (
    <div className="min-h-full bg-ink text-chalk">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
        <div>
          <h1 className="font-cond text-2xl text-chalk">Anuncios</h1>
          <p className="mt-1 text-sm text-chalk-3">Lo último de la Liga PPT.</p>
        </div>

        {loading ? (
          <p className="rounded-md border border-line bg-surface px-4 py-5 text-sm text-chalk-3">
            Cargando…
          </p>
        ) : (
          ordenadas.map((sede) => (
            <AnuncioSede key={sede.id} sede={sede} destacado={sede.id === sedeId} />
          ))
        )}

        <p className="text-sm text-chalk-3">
          ¿Dudas? Escríbenos a{" "}
          <a
            href={`mailto:${CONTACTO_LIGA_EMAIL}`}
            className="text-chalk-2 underline underline-offset-2 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
          >
            {CONTACTO_LIGA_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
};
