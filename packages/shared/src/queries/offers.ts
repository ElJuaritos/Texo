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
