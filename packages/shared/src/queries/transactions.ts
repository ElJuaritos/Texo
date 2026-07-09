import type { TexoSupabaseClient } from "../supabase/client";
import type { TransactionStatus } from "../enums/types";
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

/** Admin crea transacción simulada tras acuerdo de precio. */
export async function createTransaction(
  client: TexoSupabaseClient,
  offerId: string,
): Promise<{ id: string }> {
  const { data: offer, error: offerError } = await client
    .from("offers")
    .select("id, vehicle_id, buyer_id, status")
    .eq("id", offerId)
    .single();

  assertNoError(offerError);
  if (!offer) throw new Error("Offer not found");
  if (offer.status !== "accepted") {
    throw new Error("Offer must be accepted to create transaction");
  }

  const { data: vehicle, error: vehicleError } = await client
    .from("vehicles")
    .select("seller_id")
    .eq("id", offer.vehicle_id)
    .single();

  assertNoError(vehicleError);
  if (!vehicle) throw new Error("Vehicle not found");

  const { data, error } = await client
    .from("transactions")
    .insert({
      vehicle_id: offer.vehicle_id,
      offer_id: offer.id,
      seller_id: vehicle.seller_id,
      buyer_id: offer.buyer_id,
      status: "initiated",
    })
    .select("id")
    .single();

  assertNoError(error);
  if (!data) throw new Error("Failed to create transaction");

  await client
    .from("vehicles")
    .update({ status: "offer_accepted" })
    .eq("id", offer.vehicle_id);

  return { id: data.id };
}

/** Admin avanza estado documental simulado (escrow demo). */
export async function updateTransactionStatus(
  client: TexoSupabaseClient,
  transactionId: string,
  status: TransactionStatus,
): Promise<void> {
  const updates: { status: TransactionStatus; closed_at?: string | null } = {
    status,
  };

  if (status === "closed") {
    updates.closed_at = new Date().toISOString();
  }

  const { error } = await client
    .from("transactions")
    .update(updates)
    .eq("id", transactionId);

  assertNoError(error);

  if (status === "closed") {
    const { data: tx } = await client
      .from("transactions")
      .select("vehicle_id")
      .eq("id", transactionId)
      .single();

    if (tx?.vehicle_id) {
      await client
        .from("vehicles")
        .update({ status: "sold" })
        .eq("id", tx.vehicle_id);
    }
  }
}
