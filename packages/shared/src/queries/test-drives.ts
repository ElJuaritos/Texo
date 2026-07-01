import type { TexoSupabaseClient } from "../supabase/client";
import type { ScheduleTestDrivePayload } from "../types/domain";
import { assertNoError } from "./mappers";

/** Agenda prueba de manejo — requiere oferta aceptada y sesión del comprador. */
export async function scheduleTestDrive(
  client: TexoSupabaseClient,
  payload: ScheduleTestDrivePayload,
): Promise<{ id: string }> {
  const {
    data: { user },
    error: authError,
  } = await client.auth.getUser();

  if (authError || !user) {
    throw new Error("Authentication required");
  }

  const { data: offer, error: offerError } = await client
    .from("offers")
    .select("id, vehicle_id, buyer_id, status")
    .eq("id", payload.offer_id)
    .single();

  assertNoError(offerError);
  if (!offer) throw new Error("Offer not found");
  if (offer.status !== "accepted") {
    throw new Error("Offer must be accepted before scheduling test drive");
  }
  if (offer.buyer_id !== user.id) {
    throw new Error("Only the buyer can schedule a test drive");
  }

  const { data, error } = await client
    .from("test_drive_appointments")
    .insert({
      offer_id: offer.id,
      vehicle_id: offer.vehicle_id,
      buyer_id: user.id,
      scheduled_at: payload.scheduled_at,
      location: payload.location,
      status: "scheduled",
    })
    .select("id")
    .single();

  assertNoError(error);
  if (!data) throw new Error("Failed to schedule test drive");

  return { id: data.id };
}
