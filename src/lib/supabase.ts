import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Only create the client if both env vars are present and non-empty
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;
