import type { TexoSupabaseClient } from "../supabase/client";
import type { CreateOfferPayload, Offer } from "../types/domain";
import { assertNoError, mapOffer } from "./mappers";

/** Crea oferta formal — buyer_id desde sesión activa. */
export async function createOffer(
  client: TexoSupabaseClient,
  payload: CreateOfferPayload,
): Promise<{ id: string }> {
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication required");
  }

  if (payload.amount <= 0) {
    throw new Error("Offer amount must be greater than zero");
  }

  const { data, error } = await client
    .from("offers")
    .insert({
      vehicle_id: payload.vehicle_id,
      buyer_id: user.id,
      amount: payload.amount,
      message: payload.message ?? null,
      expires_at: payload.expires_at ?? null,
      status: "pending",
    })
    .select("id")
    .single();

  assertNoError(error);
  if (!data) throw new Error("Failed to create offer");

  return { id: data.id };
}

/** Ofertas de un comprador. */
export async function listBuyerOffers(
  client: TexoSupabaseClient,
  buyerId: string,
): Promise<Offer[]> {
  const { data, error } = await client
    .from("offers")
    .select("*")
    .eq("buyer_id", buyerId)
    .order("created_at", { ascending: false });

  assertNoError(error);
  return (data ?? []).map(mapOffer);
}

/** Ofertas pendientes para moderación admin. */
export async function listPendingOffers(
  client: TexoSupabaseClient,
): Promise<Offer[]> {
  const { data, error } = await client
    .from("offers")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  assertNoError(error);
  return (data ?? []).map(mapOffer);
}

/** Admin acepta oferta formal. */
export async function acceptOffer(
  client: TexoSupabaseClient,
  offerId: string,
): Promise<void> {
  const { error } = await client
    .from("offers")
    .update({ status: "accepted" })
    .eq("id", offerId);

  assertNoError(error);
}

/** Admin rechaza oferta formal. */
export async function rejectOffer(
  client: TexoSupabaseClient,
  offerId: string,
): Promise<void> {
  const { error } = await client
    .from("offers")
    .update({ status: "rejected" })
    .eq("id", offerId);

  assertNoError(error);
}
