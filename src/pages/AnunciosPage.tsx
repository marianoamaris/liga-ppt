import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShareNodes, FaWhatsapp } from "react-icons/fa6";
import { CONTACTO_LIGA_EMAIL } from "../constants/ACTUALIZACION_DATOS_JUGADOR";

const TITULO = "¿Quieres jugar en la Liga PPT?";
const TEXTO =
  "Abrimos el grupo de reservas: una lista de espera oficial para quienes quieran unirse. " +
  "Inscríbete, completa tu perfil y serás de los primeros en entrar cuando haya un cupo.";

/**
 * Anuncios.
 *
 * Antes acumulaba el historial completo de versiones de la app junto a tres
 * anuncios de ediciones ya cerradas. El historial de versiones interesa a quien
 * desarrolla, no a quien juega, así que queda solo lo accionable: cómo entrar.
 */
export const AnunciosPage: React.FC = () => {
  const navigate = useNavigate();

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/participa-en-la-liga-ppt`
      : "/participa-en-la-liga-ppt";

  const copiarEnlace = () => {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      void navigator.share({ title: TITULO, text: TEXTO, url });
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-full bg-ink text-chalk">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
        <div>
          <h1 className="font-cond text-2xl text-chalk">Anuncios</h1>
          <p className="mt-1 text-sm text-chalk-3">Lo último de la Liga PPT.</p>
        </div>

        <article className="flex flex-col gap-4 rounded-md border border-line bg-surface p-5">
          <div>
            <span className="font-cond inline-flex items-center gap-2 text-[0.6875rem] text-vivo">
              <span className="size-1.5 rounded-full bg-vivo" />
              Inscripciones abiertas
            </span>
            <h2 className="font-cond mt-2 text-xl text-chalk">{TITULO}</h2>
          </div>

          <p className="max-w-prose text-sm text-chalk-2">{TEXTO}</p>

          <ul className="flex flex-col gap-2 border-t border-line pt-4 text-sm text-chalk-2">
            <li className="flex gap-3">
              <span className="font-cond w-16 shrink-0 text-chalk-3">Cuándo</span>
              Los jueves, a las 6:00 PM
            </li>
            <li className="flex gap-3">
              <span className="font-cond w-16 shrink-0 text-chalk-3">Dónde</span>
              Valledupar
            </li>
            <li className="flex gap-3">
              <span className="font-cond w-16 shrink-0 text-chalk-3">Cómo</span>
              Déjanos tus datos y te escribimos cuando se abra un cupo
            </li>
          </ul>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate("/participa-en-la-liga-ppt")}
              className="font-cond cursor-pointer rounded-sm bg-chalk px-4 py-2.5 text-sm text-ink transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
            >
              Quiero inscribirme
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${TITULO} ${url}`)}`}
              target="_blank"
              rel="noreferrer"
              className="font-cond inline-flex cursor-pointer items-center gap-2 rounded-sm border border-line px-4 py-2.5 text-sm text-chalk-2 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
            >
              <FaWhatsapp aria-hidden className="size-4" />
              Compartir
            </a>

            <button
              type="button"
              onClick={copiarEnlace}
              className="font-cond inline-flex cursor-pointer items-center gap-2 rounded-sm border border-line px-4 py-2.5 text-sm text-chalk-2 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
            >
              <FaShareNodes aria-hidden className="size-4" />
              Copiar enlace
            </button>
          </div>
        </article>

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
