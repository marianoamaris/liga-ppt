import type { SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * El cliente de Supabase, traído solo cuando alguien lo pide.
 *
 * Se usa en dos sitios y ninguno es el arranque: la pantalla de En Vivo abre
 * un canal de Realtime para enterarse de los goles al instante, y `api.ts`
 * renueva la sesión cuando el backend responde 401. Todo lo demás va por la
 * API. Importarlo arriba metía sus 200 KB en el trozo inicial —`api.ts` lo
 * arrastraba y de `api.ts` cuelga la aplicación entera—, así que quien entraba
 * a ver la tabla se descargaba un cliente de websockets que no iba a abrir.
 *
 * Cargarlo tarde no se nota en ninguno de los dos: el directo tiene el sondeo
 * cada ocho segundos como red, y la renovación de sesión solo ocurre tras un
 * 401, que ya iba a costar un reintento.
 */
let promesa: Promise<SupabaseClient | null> | null = null;

export function clienteSupabase(): Promise<SupabaseClient | null> {
  if (!url || !anonKey) return Promise.resolve(null);
  // Una sola vez por sesión, aunque se entre y se salga de la pantalla.
  promesa ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true, // renueva ~10 min antes de que expire
        persistSession: true, // guarda sesión en localStorage
        detectSessionInUrl: false,
      },
    })
  );
  return promesa;
}
