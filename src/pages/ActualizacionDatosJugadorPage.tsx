import React, { useState } from "react";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import {
  ACTUALIZACION_DATOS_JUGADOR,
  CONTACTO_LIGA_EMAIL,
  NETLIFY_FORM_ACTUALIZACION_DATOS,
  isFormularioActualizacionDatosAbierto,
} from "../constants/ACTUALIZACION_DATOS_JUGADOR";

export const ActualizacionDatosJugadorPage: React.FC = () => {
  const abierto = isFormularioActualizacionDatosAbierto();
  const [exito, setExito] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

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
        <Card className="border border-gray-200 bg-white p-6 text-gray-900 shadow-md md:p-8">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Actualizar mis datos en la liga
          </h1>
          <p className="mb-4 text-center text-sm text-gray-600">
            Ayúdanos a corregir nombres o estadísticas si algo no cuadra con tu
            ficha. <strong>Todo lo que envíes llegará a</strong>{" "}
            <a
              className="font-semibold text-pink-600 underline"
              href={`mailto:${CONTACTO_LIGA_EMAIL}`}
            >
              {CONTACTO_LIGA_EMAIL}
            </a>
            .
          </p>

          {!ACTUALIZACION_DATOS_JUGADOR.ligasTemporadaFinalizadas ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-900">
              Este formulario estará disponible cuando{" "}
              <strong>finalicen las ligas</strong> de la temporada. Vuelve más
              adelante.
            </p>
          ) : !abierto ? (
            <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-700">
              El periodo de corrección de datos ya cerró. Si necesitas algo
              urgente, escribe a{" "}
              <a
                className="font-semibold text-pink-600 underline"
                href={`mailto:${CONTACTO_LIGA_EMAIL}`}
              >
                {CONTACTO_LIGA_EMAIL}
              </a>
              .
            </p>
          ) : (
            <>
              <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50/80 p-4 text-sm text-gray-800">
                <p className="mb-2 font-semibold text-blue-900">
                  ¿Cuándo aplica este formulario?
                </p>
                <ul className="list-inside list-disc space-y-1 text-gray-700">
                  <li>
                    Solo tiene sentido{" "}
                    <strong>después de finalizar las ligas</strong> de la
                    temporada (la organización activa o desactiva esto en
                    configuración).
                  </li>
                  <li>
                    Permanecerá abierto hasta el{" "}
                    <strong>inicio del Mundial PPT</strong>.
                  </li>
                </ul>
              </div>

              {exito ? (
                <div
                  className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-900"
                  role="status"
                >
                  <p className="font-semibold">¡Listo! Recibimos tu mensaje.</p>
                  <p className="mt-2 text-sm">
                    Revisaremos tu información y, si hace falta, te
                    contactaremos al correo que indicaste en el formulario.
                  </p>
                  <Button
                    type="button"
                    className="mt-4 bg-gray-800 text-white hover:bg-gray-700"
                    onClick={() => setExito(false)}
                  >
                    Enviar otra respuesta
                  </Button>
                </div>
              ) : (
                <form
                  name={NETLIFY_FORM_ACTUALIZACION_DATOS}
                  method="POST"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="relative space-y-4"
                >
                  <input
                    type="hidden"
                    name="form-name"
                    value={NETLIFY_FORM_ACTUALIZACION_DATOS}
                  />
                  <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="bot-field-hp">No completar</label>
                    <input
                      id="bot-field-hp"
                      name="bot-field"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="nombreEnLiga" className="text-sm font-semibold">
                      Nombre en la liga (como quieres que figure){" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="nombreEnLiga"
                      name="nombreEnLiga"
                      required
                      maxLength={120}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="Ej. Juan Pérez o @usuario si así te conocen"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-semibold">
                      Tu correo (para responderte){" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="tu@correo.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="jugadorDesde" className="text-sm font-semibold">
                      ¿Desde cuándo eres jugador de la Liga PPT?{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="jugadorDesde"
                      name="jugadorDesde"
                      required
                      maxLength={200}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="Ej. desde la liga 12, o desde 2023"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="mensaje" className="text-sm font-semibold">
                      Sugerencias, dudas o datos que crees incorrectos{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      required
                      rows={5}
                      maxLength={4000}
                      className="resize-y rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="Describe qué debería cambiar (nombre mal escrito, ligas jugadas, posición, etc.)."
                    />
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
                    className="w-full bg-pink-600 text-white hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {enviando ? "Enviando…" : "Enviar"}
                  </Button>
                </form>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
