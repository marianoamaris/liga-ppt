import React, { useEffect, useState } from "react";
import {
  CONTACTO_LIGA_EMAIL,
  NETLIFY_FORM_GRUPO_RESERVAS,
} from "../constants/ACTUALIZACION_DATOS_JUGADOR";
import { useSede } from "../context/SedeContext";
import { horarioDeSede } from "../utils/horarios";

const POSICIONES = ["Arquero", "Defensa", "Mediocampista", "Delantero"] as const;
type Posicion = (typeof POSICIONES)[number];

export const ActualizacionDatosJugadorPage: React.FC = () => {
  const { sedes, sedeId } = useSede();
  // La ciudad decide el horario que se pide confirmar, así que se pregunta
  // antes que nada. Arranca en la que el visitante venía mirando.
  const [sedeElegida, setSedeElegida] = useState(sedeId);
  useEffect(() => setSedeElegida(sedeId), [sedeId]);

  const sede = sedes.find((s) => s.id === sedeElegida) ?? null;
  const horario = sede ? horarioDeSede(sede) : null;

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
      raw.set("ciudad", sede?.nombre ?? sedeElegida);
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
    <div className="min-h-full bg-ink p-4 pb-12 text-chalk">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        {/* Header */}
        <div className="rounded-md border border-line bg-surface p-5 md:p-6">
          <div className="mb-4 flex flex-col items-center gap-2">
            <span className="font-cond inline-flex items-center gap-2 text-[0.6875rem] text-vivo">
              <span className="size-1.5 rounded-full bg-vivo" />
              Inscripciones abiertas
            </span>
            <h1 className="font-cond text-center text-2xl text-chalk">
              Participar en la Liga PPT
              {sede && <span className="text-chalk-2"> · {sede.nombre}</span>}
            </h1>

            <p className="text-center text-sm text-chalk-2">
              Únete al <strong>Grupo de Reservas</strong> y entra a la lista de espera. Si un cupo queda
              libre, te contactamos para que puedas participar en la liga rápidamente.
            </p>
          </div>

          {/* Info box: cómo funciona */}
          <div className="mb-4 space-y-2 rounded-sm border border-line p-4 text-sm">
            <p className="font-cond text-chalk">¿Cómo funciona el grupo de reservas?</p>
            <ul className="list-inside list-disc space-y-1 text-chalk-2">
              <li>
                Es una <strong>lista de espera</strong>: cuando alguien activo en la liga libere su cupo,
                avisamos al grupo de reservas para que alguien pueda entrar de inmediato.
              </li>
              <li>
                {horario ? (
                  <>
                    En {sede?.nombre} las jornadas son <strong>{horario}</strong>. Es requisito estar
                    disponible esas noches de forma habitual.
                  </>
                ) : (
                  "Es requisito estar disponible de forma habitual la noche de las jornadas."
                )}
              </li>
              <li>
                Una vez aprobado, te agregamos al grupo de WhatsApp de reservas.
              </li>
            </ul>
          </div>

          {/* Ventajas */}
          <div className="mb-5 space-y-2 rounded-sm border border-line p-4 text-sm">
            <p className="font-cond text-chalk">Ventajas de estar en el grupo</p>
            <ul className="list-inside list-disc space-y-1 text-chalk-2">
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
              className="rounded-sm border border-line bg-raised p-5 text-center"
              role="status"
            >
              <p className="font-cond text-lg text-chalk">Listo, recibimos tu solicitud</p>
              <p className="mt-2 text-sm text-chalk-2">
                Te contactaremos por WhatsApp cuando haya un cupo disponible. Si tienes dudas, escribe a{" "}
                <a className="text-chalk underline underline-offset-2" href={`mailto:${CONTACTO_LIGA_EMAIL}`}>
                  {CONTACTO_LIGA_EMAIL}
                </a>
                .
              </p>
              <button
                type="button"
                className="font-cond mt-4 cursor-pointer rounded-sm border border-line px-4 py-2 text-sm text-chalk-2 transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
                onClick={() => setExito(false)}
              >
                Enviar otra solicitud
              </button>
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

              {/* Ciudad — va primero porque determina el horario que se confirma abajo */}
              {sedes.length > 1 && (
                <div className="flex flex-col gap-2">
                  <span className="font-cond text-sm text-chalk-2">
                    ¿En qué ciudad quieres jugar? <span className="text-vivo">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {sedes.map((s) => {
                      const activa = s.id === sedeElegida;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSedeElegida(s.id)}
                          aria-pressed={activa}
                          className={`font-cond rounded-sm border px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                            activa
                              ? "border-chalk-3 bg-raised text-chalk"
                              : "border-line text-chalk-3 hover:text-chalk-2"
                          }`}
                          style={
                            activa && s.color_hex
                              ? { boxShadow: `inset 0 -2px 0 ${s.color_hex}` }
                              : undefined
                          }
                        >
                          {s.nombre}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-chalk-3">
                    {horario
                      ? `Jornadas ${horario}.`
                      : "Cargando el horario de la ciudad…"}
                  </p>
                </div>
              )}
              {/* Netlify recibe la ciudad aunque solo haya una */}
              <input type="hidden" name="ciudad" value={sede?.nombre ?? sedeElegida} />

              {/* Nombre */}
              <div className="flex flex-col gap-1">
                <label htmlFor="nombre" className="font-cond text-sm text-chalk-2">
                  Nombre completo <span className="text-vivo">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  required
                  maxLength={120}
                  autoComplete="name"
                  className="rounded-sm border border-line bg-ink px-3 py-2.5 text-chalk placeholder:text-chalk-3 focus:border-chalk-3 focus:outline-none"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              {/* Edad */}
              <div className="flex flex-col gap-1">
                <label htmlFor="edad" className="font-cond text-sm text-chalk-2">
                  Edad <span className="text-vivo">*</span>
                </label>
                <input
                  id="edad"
                  name="edad"
                  type="number"
                  required
                  min={14}
                  max={70}
                  className="w-28 rounded-sm border border-line bg-ink px-3 py-2.5 text-chalk placeholder:text-chalk-3 focus:border-chalk-3 focus:outline-none"
                  placeholder="25"
                />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1">
                <label htmlFor="whatsapp" className="font-cond text-sm text-chalk-2">
                  Número de WhatsApp <span className="text-vivo">*</span>
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  maxLength={20}
                  autoComplete="tel"
                  className="rounded-sm border border-line bg-ink px-3 py-2.5 text-chalk placeholder:text-chalk-3 focus:border-chalk-3 focus:outline-none"
                  placeholder="Ej. 3001234567"
                />
              </div>

              {/* Posición */}
              <div className="flex flex-col gap-2">
                <span className="font-cond text-sm text-chalk-2">
                  Posición(es) en la que juegas <span className="text-vivo">*</span>
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {POSICIONES.map((p) => {
                    const selected = posiciones.has(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePosicion(p)}
                        aria-pressed={selected}
                        className={`font-cond rounded-sm border px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${
                          selected
                            ? "border-chalk-3 bg-raised text-chalk"
                            : "border-line text-chalk-3 hover:text-chalk-2"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                {posicionError && (
                  <p className="text-xs text-vivo">Selecciona al menos una posición.</p>
                )}
                {/* hidden input para netlify */}
                <input type="hidden" name="posiciones" value={[...posiciones].join(", ")} />
              </div>

              {/* Disponibilidad - confirmación */}
              {/* Destaca sobre fondo oscuro, no con una tarjeta clara: el texto
                  secundario sobre crema quedaba en 1.7:1, muy lejos del 4.5:1
                  que se fija el proyecto. */}
              <div className="rounded-sm border border-vivo/40 bg-vivo/10 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="disponibilidad"
                    required
                    className="mt-0.5 size-4 shrink-0 accent-chalk"
                  />
                  <span className="text-sm text-chalk-2">
                    Confirmo que puedo estar{" "}
                    <strong>
                      disponible {horario ?? "la noche de las jornadas"}
                    </strong>{" "}
                    para participar en las jornadas de la Liga PPT
                    {sede ? ` en ${sede.nombre}` : ""}. Entiendo que esta es una condición
                    indispensable para pertenecer al grupo de reservas.
                  </span>
                </label>
              </div>

              {error ? (
                <p
                  className="rounded-sm bg-vivo/15 px-3 py-2.5 text-sm text-chalk-2"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={enviando}
                className="font-cond w-full cursor-pointer rounded-sm bg-chalk px-4 py-3 text-sm text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
              >
                {enviando ? "Enviando…" : "Enviar solicitud"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
