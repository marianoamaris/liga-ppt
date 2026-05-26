import React, { useState } from "react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import {
  CONTACTO_LIGA_EMAIL,
  NETLIFY_FORM_GRUPO_RESERVAS,
} from "../constants/ACTUALIZACION_DATOS_JUGADOR";
import ContadorJugadores from "../components/common/ContadorJugadores";

const POSICIONES = ["Arquero", "Defensa", "Mediocampista", "Delantero"] as const;
type Posicion = (typeof POSICIONES)[number];

export const ActualizacionDatosJugadorPage: React.FC = () => {
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posiciones, setPosiciones] = useState<Set<Posicion>>(new Set());
  const [posicionError, setPosicionError] = useState(false);

  const togglePosicion = (p: Posicion) => {
    setPosiciones((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
    setPosicionError(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (posiciones.size === 0) {
      setPosicionError(true);
      return;
    }

    if (import.meta.env.DEV) {
      setError(
        "Netlify Forms solo procesa envíos en el sitio desplegado. Prueba en ligappt.com tras publicar los cambios.",
      );
      return;
    }

    const form = e.currentTarget;
    setEnviando(true);
    try {
      const raw = new FormData(form);
      raw.set("posiciones", [...posiciones].join(", "));
      const params = new URLSearchParams();
      raw.forEach((value, key) => {
        params.append(key, typeof value === "string" ? value : "");
      });
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (!res.ok) throw new Error("http");
      setExito(true);
      form.reset();
      setPosiciones(new Set());
    } catch {
      setError(
        "No se pudo enviar. Revisa la conexión o inténtalo más tarde. Si el problema continúa, escribe a contacto@ligappt.com.",
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-4 pb-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <Card className="border border-gray-200 bg-white p-6 text-gray-900 shadow-md md:p-8">
          <div className="mb-4 flex flex-col items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-green-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Inscripciones abiertas
            </span>
            <h1 className="text-center text-2xl font-bold text-gray-900">
              Participar en la Liga PPT
            </h1>

            {/* Contador de cupos (dinámico desde API) */}
            <ContadorJugadores />

            <p className="text-center text-sm text-gray-600">
              Únete al <strong>Grupo de Reservas</strong> y entra a la lista de espera. Si un cupo queda
              libre, te contactamos para que puedas participar en la liga rápidamente.
            </p>
          </div>

          {/* Info box: cómo funciona */}
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-gray-800 space-y-2">
            <p className="font-semibold text-blue-900">¿Cómo funciona el Grupo de Reservas?</p>
            <ul className="list-inside list-disc space-y-1 text-gray-700">
              <li>
                Es una <strong>lista de espera</strong>: cuando alguien activo en la liga libere su cupo,
                avisamos al grupo de reservas para que alguien pueda entrar de inmediato.
              </li>
              <li>
                Las jornadas son los <strong>jueves a las 6:00 PM</strong>. Es requisito estar disponible
                esa noche de forma habitual.
              </li>
              <li>
                Una vez aprobado, te agregamos al grupo de WhatsApp de reservas.
              </li>
            </ul>
          </div>

          {/* Ventajas */}
          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm space-y-2">
            <p className="font-semibold text-green-900">Ventajas de estar en el grupo</p>
            <ul className="list-inside list-disc space-y-1 text-gray-700">
              <li>
                Ocasionalmente se organizan <strong>partidos dentro del mismo grupo de reservas</strong>,
                así mantienes el ritmo y la comunidad.
              </li>
              <li>
                La administración usa tu perfil para <strong>asignarte un nivel y posición</strong>,
                lo que agiliza tu integración cuando se abra un cupo.
              </li>
              <li>
                Cuando llegue tu turno, <strong>el ingreso a la liga es mucho más rápido</strong> porque
                ya tienes tu ficha lista.
              </li>
            </ul>
          </div>

          {exito ? (
            <div
              className="rounded-xl border border-green-200 bg-green-50 p-5 text-center text-green-900"
              role="status"
            >
              <p className="text-lg font-bold">¡Listo, recibimos tu solicitud!</p>
              <p className="mt-2 text-sm">
                Te contactaremos por WhatsApp cuando haya un cupo disponible. Si tienes dudas, escribe a{" "}
                <a className="font-semibold text-green-700 underline" href={`mailto:${CONTACTO_LIGA_EMAIL}`}>
                  {CONTACTO_LIGA_EMAIL}
                </a>
                .
              </p>
              <Button
                type="button"
                className="mt-4 bg-gray-800 text-white hover:bg-gray-700"
                onClick={() => setExito(false)}
              >
                Enviar otra solicitud
              </Button>
            </div>
          ) : (
            <form
              name={NETLIFY_FORM_GRUPO_RESERVAS}
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <input type="hidden" name="form-name" value={NETLIFY_FORM_GRUPO_RESERVAS} />
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="bot-field-hp">No completar</label>
                <input id="bot-field-hp" name="bot-field" tabIndex={-1} autoComplete="off" />
              </div>

              {/* Nombre */}
              <div className="flex flex-col gap-1">
                <label htmlFor="nombre" className="text-sm font-semibold">
                  Nombre completo <span className="text-red-600">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  required
                  maxLength={120}
                  autoComplete="name"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              {/* Edad */}
              <div className="flex flex-col gap-1">
                <label htmlFor="edad" className="text-sm font-semibold">
                  Edad <span className="text-red-600">*</span>
                </label>
                <input
                  id="edad"
                  name="edad"
                  type="number"
                  required
                  min={14}
                  max={70}
                  className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="25"
                />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1">
                <label htmlFor="whatsapp" className="text-sm font-semibold">
                  Número de WhatsApp <span className="text-red-600">*</span>
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  maxLength={20}
                  autoComplete="tel"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Ej. 3001234567"
                />
              </div>

              {/* Posición */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">
                  Posición(es) en la que juegas <span className="text-red-600">*</span>
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {POSICIONES.map((p) => {
                    const selected = posiciones.has(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePosicion(p)}
                        className={`rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all ${
                          selected
                            ? "border-green-500 bg-green-50 text-green-800"
                            : "border-gray-200 bg-white text-gray-700 hover:border-green-300"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                {posicionError && (
                  <p className="text-xs text-red-600">Selecciona al menos una posición.</p>
                )}
                {/* hidden input para netlify */}
                <input type="hidden" name="posiciones" value={[...posiciones].join(", ")} />
              </div>

              {/* Disponibilidad - confirmación */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="disponibilidad_jueves"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-green-600"
                  />
                  <span className="text-sm text-gray-800">
                    Confirmo que puedo estar <strong>disponible todos los jueves a las 6:00 PM</strong> para
                    participar en las jornadas de la Liga PPT. Entiendo que esta es una condición
                    indispensable para pertenecer al grupo de reservas.
                  </span>
                </label>
              </div>

              {error ? (
                <p
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={enviando}
                className="w-full bg-green-600 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando ? "Enviando…" : "Enviar solicitud"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
