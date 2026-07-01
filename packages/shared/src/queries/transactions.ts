import type { TexoSupabaseClient } from "../supabase/client";
import type { Transaction } from "../types/domain";
import { assertNoError, mapTransaction } from "./mappers";

/** Transacciones para panel admin (requiere rol admin vía RLS). */
export async function listAdminTransactions(
  client: TexoSupabaseClient,
): Promise<Transaction[]> {
  const { data, error } = await client
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });

  assertNoError(error);
  return (data ?? []).map(mapTransaction);
}
