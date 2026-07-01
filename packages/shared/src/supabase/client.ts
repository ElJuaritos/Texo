import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database";

export type TexoSupabaseClient = SupabaseClient<Database>;

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/**
 * Factory del cliente Supabase tipado.
 * Web y mobile pasan sus env vars; mobile puede inyectar storage adapter aparte.
 */
export function createTexoSupabaseClient(
  env: SupabaseEnv,
  options?: Parameters<typeof createClient<Database>>[2],
): TexoSupabaseClient {
  return createClient<Database>(env.url, env.anonKey, options);
}

export function getSupabaseEnvFromProcess(): SupabaseEnv {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    "";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    "";

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env: NEXT_PUBLIC_* (web) or EXPO_PUBLIC_* (mobile)",
    );
  }

  return { url, anonKey };
}
