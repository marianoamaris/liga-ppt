import React from "react";
import type { IconType } from "react-icons";
import { FaRegEnvelope } from "react-icons/fa6";
import { FaYoutube, FaInstagram } from "react-icons/fa6";
import { CONTACTO_LIGA_EMAIL } from "../constants/ACTUALIZACION_DATOS_JUGADOR";

interface Canal {
  id: string;
  Icono: IconType;
  titulo: string;
  descripcion: string;
  etiqueta: string;
  href: string;
  externo?: boolean;
}

const CANALES: Canal[] = [
  {
    id: "correo",
    Icono: FaRegEnvelope,
    titulo: "Correo",
    descripcion: "Dudas, sugerencias o cualquier cosa sobre la liga.",
    etiqueta: CONTACTO_LIGA_EMAIL,
    href: `mailto:${CONTACTO_LIGA_EMAIL}`,
  },
  {
    id: "youtube",
    Icono: FaYoutube,
    titulo: "YouTube",
    descripcion: "Partidos completos, resúmenes y lo mejor de cada jornada.",
    etiqueta: "@ligappt",
    href: "https://www.youtube.com/@ligappt",
    externo: true,
  },
  {
    id: "instagram",
    Icono: FaInstagram,
    titulo: "Instagram",
    descripcion: "Resultados del día, goleadores, arqueros y MVPs.",
    etiqueta: "@ligappt",
    href: "https://www.instagram.com/ligappt",
    externo: true,
  },
];

export const Contacto: React.FC = () => (
  <div className="min-h-full bg-ink text-chalk">
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
      <div>
        <h1 className="font-cond text-2xl text-chalk">Contacto</h1>
        <p className="mt-1 max-w-prose text-sm text-chalk-3">
          Los canales oficiales de la Liga PPT.
        </p>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-3">
        {CANALES.map(({ id, Icono, titulo, descripcion, etiqueta, href, externo }) => (
          <li key={id}>
            <a
              href={href}
              {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex h-full flex-col gap-2 rounded-md border border-line bg-surface p-4 transition-colors hover:border-chalk-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
            >
              <Icono aria-hidden className="size-5 text-chalk-2" />
              <h2 className="font-cond text-base text-chalk">{titulo}</h2>
              <p className="flex-1 text-sm text-chalk-3">{descripcion}</p>
              <span className="font-cond text-sm text-chalk-2">{etiqueta}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
