import { INSPECTION_MIN_PUBLISH_SCORE } from "../constants";
import type { TexoSupabaseClient } from "../supabase/client";
import type { CreateInspectionPayload, Inspection } from "../types/domain";
import { assertNoError, mapInspection } from "./mappers";

/** Admin registra inspección certificada. */
export async function createInspection(
  client: TexoSupabaseClient,
  payload: CreateInspectionPayload,
): Promise<{ id: string }> {
  const passed = payload.score >= INSPECTION_MIN_PUBLISH_SCORE;

  const { data: inspection, error: inspectionError } = await client
    .from("inspections")
    .insert({
      vehicle_id: payload.vehicle_id,
      inspector_name: payload.inspector_name,
      score: payload.score,
      passed,
      certified_at: passed ? new Date().toISOString() : null,
      notes: payload.notes ?? null,
    })
    .select("id")
    .single();

  assertNoError(inspectionError);
  if (!inspection) throw new Error("Failed to create inspection");

  if (payload.items?.length) {
    const { error: itemsError } = await client.from("inspection_items").insert(
      payload.items.map((item) => ({
        inspection_id: inspection.id,
        category: item.category,
        component: item.component,
        severity: item.severity,
        description: item.description,
        photo_path: item.photo_path ?? null,
      })),
    );

    assertNoError(itemsError);
  }

  return { id: inspection.id };
}

/** Admin publica vehículo tras inspección aprobada. */
export async function publishVehicle(
  client: TexoSupabaseClient,
  vehicleId: string,
  listingPrice: number,
): Promise<void> {
  const { data: inspection, error: inspectionError } = await client
    .from("inspections")
    .select("score, passed")
    .eq("vehicle_id", vehicleId)
    .maybeSingle();

  assertNoError(inspectionError);

  if (!inspection?.passed || inspection.score < INSPECTION_MIN_PUBLISH_SCORE) {
    throw new Error(
      `Vehicle requires inspection score >= ${INSPECTION_MIN_PUBLISH_SCORE}`,
    );
  }

  const { error } = await client
    .from("vehicles")
    .update({
      status: "published",
      listing_price: listingPrice,
      published_at: new Date().toISOString(),
    })
    .eq("id", vehicleId);

  assertNoError(error);
}

/** Inspección de un vehículo (admin o publicado). */
export async function getInspectionByVehicleId(
  client: TexoSupabaseClient,
  vehicleId: string,
): Promise<Inspection | null> {
  const { data, error } = await client
    .from("inspections")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .maybeSingle();

  assertNoError(error);
  return data ? mapInspection(data) : null;
}
