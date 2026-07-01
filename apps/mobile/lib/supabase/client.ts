import Constants from "expo-constants";
import { createTexoSupabaseClient, type TexoSupabaseClient } from "@texo/shared";
import { secureStoreAdapter } from "./storage-adapter";

let clientInstance: TexoSupabaseClient | null = null;

/** Lee credenciales Supabase desde app.config extra o env. */
function getSupabaseEnv() {
  const extra = Constants.expoConfig?.extra ?? {};
  const url =
    (extra.supabaseUrl as string | undefined) ??
    process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey =
    (extra.supabaseAnonKey as string | undefined) ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/** Cliente Supabase singleton con persistencia SecureStore. */
export function getSupabaseMobileClient(): TexoSupabaseClient | null {
  if (clientInstance) return clientInstance;

  const env = getSupabaseEnv();
  if (!env) return null;

  clientInstance = createTexoSupabaseClient(env, {
    auth: {
      storage: secureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  return clientInstance;
}
