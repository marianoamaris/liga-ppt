import React from "react";
import { Card } from "../components/common/Card";
import { FaHandshake } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { PATROCINADORES } from "../constants/PATROCINADORES";

const instagramProfileUrl = (handle: string) =>
  `https://www.instagram.com/${handle.replace(/^@/, "").replace(/\/$/, "")}/`;

export const PatrocinadoresPage: React.FC = () => (
  <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-4 pb-10">
    <div className="w-full max-w-5xl space-y-8">
      <Card className="flex w-full flex-col items-center justify-center border border-black bg-black p-8 text-white">
        <FaHandshake className="mb-4 text-5xl text-pink-500" aria-hidden />
        <h1 className="mb-2 text-center text-2xl font-bold text-white md:text-3xl">
          Patrocinadores
        </h1>
        <p className="max-w-2xl text-center text-base text-white/90">
          Gracias a quienes apoyan la Liga PPT. Conoce a nuestros aliados y síguelos en Instagram.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PATROCINADORES.map((p) => (
          <Card
            key={p.id}
            className="flex h-full flex-col overflow-hidden border border-gray-200 bg-white p-0 text-gray-900 shadow-lg"
          >
            <div className="flex min-h-[140px] items-center justify-center bg-gray-50 px-6 py-5">
              <img
                src={p.logo}
                alt={p.nombre}
                className="max-h-32 w-full max-w-[220px] object-contain"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5 pt-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-lg font-bold leading-tight text-gray-900">{p.nombre}</h2>
                <a
                  href={instagramProfileUrl(p.instagramHandle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                  aria-label={`Instagram de ${p.nombre} (@${p.instagramHandle})`}
                >
                  <FaInstagram className="text-lg" aria-hidden />
                  <span className="max-w-[10rem] truncate sm:max-w-none">
                    @{p.instagramHandle}
                  </span>
                </a>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">{p.descripcion}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 text-center text-gray-800">
        <h2 className="mb-2 text-lg font-bold">¿Quieres patrocinar?</h2>
        <p className="mb-4 text-sm text-gray-600">
          Escríbenos y te contamos opciones de alianza, presencia en partidos y en nuestras redes.
        </p>
        <a
          href="mailto:contacto@ligappt.com?subject=Patrocinio%20Liga%20PPT"
          className="inline-block rounded bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700"
        >
          contacto@ligappt.com
        </a>
      </Card>
    </div>
  </div>
);
