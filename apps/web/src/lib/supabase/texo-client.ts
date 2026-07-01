import type { TexoSupabaseClient } from "@texo/shared";
import { createClient as createBrowserClient } from "./client";

/** Adapta el cliente SSR/browser al tipo compartido de queries. */
export function asTexoClient(client: unknown): TexoSupabaseClient {
  return client as TexoSupabaseClient;
}

/** Cliente browser tipado para queries de @texo/shared. */
export function getTexoBrowserClient(): TexoSupabaseClient {
  return asTexoClient(createBrowserClient());
}
