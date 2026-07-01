import { createClient } from "./server";
import { asTexoClient } from "./texo-client";
import type { TexoSupabaseClient } from "@texo/shared";

/** Cliente server tipado para queries de @texo/shared. */
export async function getTexoServerClient(): Promise<TexoSupabaseClient> {
  return asTexoClient(await createClient());
}
