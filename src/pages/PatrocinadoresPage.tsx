import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { PATROCINADORES } from "../constants/PATROCINADORES";
import { CONTACTO_LIGA_EMAIL } from "../constants/ACTUALIZACION_DATOS_JUGADOR";

const instagram = (handle: string) =>
  `https://www.instagram.com/${handle.replace(/^@/, "").replace(/\/$/, "")}/`;

export const PatrocinadoresPage: React.FC = () => (
  <div className="min-h-full bg-ink text-chalk">
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
      <div>
        <h1 className="font-cond text-2xl text-chalk">Patrocinadores</h1>
        <p className="mt-1 max-w-prose text-sm text-chalk-3">
          Los negocios que hacen posible la liga. Síguelos.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-3">
        {PATROCINADORES.map((p) => (
          <article
            key={p.id}
            className="flex flex-col overflow-hidden rounded-md border border-line bg-surface"
          >
            {/* Los logos vienen sobre fondo claro, así que se les da uno propio */}
            <div className="flex min-h-[8.5rem] items-center justify-center bg-chalk p-5">
              <img
                src={p.logo}
                alt={p.nombre}
                loading="lazy"
                className="max-h-28 w-full max-w-[13rem] object-contain"
              />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
              <h2 className="font-cond text-base text-chalk">{p.nombre}</h2>
              <p className="flex-1 text-sm text-chalk-2">{p.descripcion}</p>
              <a
                href={instagram(p.instagramHandle)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-cond inline-flex w-fit items-center gap-2 rounded-sm border border-line px-2.5 py-1.5 text-xs text-chalk-2 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
              >
                <FaInstagram aria-hidden className="size-4" />
                @{p.instagramHandle}
              </a>
            </div>
          </article>
        ))}
      </div>

      <section className="rounded-md border border-line p-5">
        <h2 className="font-cond text-base text-chalk">¿Quieres patrocinar?</h2>
        <p className="mt-1 max-w-prose text-sm text-chalk-3">
          Escríbenos y te contamos las opciones de alianza, presencia en los partidos
          y en las redes de la liga.
        </p>
        <a
          href={`mailto:${CONTACTO_LIGA_EMAIL}?subject=Patrocinio%20Liga%20PPT`}
          className="font-cond mt-3 inline-block rounded-sm bg-chalk px-4 py-2.5 text-sm text-ink transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
        >
          {CONTACTO_LIGA_EMAIL}
        </a>
      </section>
    </div>
  </div>
);
