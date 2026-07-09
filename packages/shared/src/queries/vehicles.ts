import type { TexoSupabaseClient } from "../supabase/client";
import type { Vehicle, VehicleCatalogItem, VehicleWithInspection } from "../types/domain";
import { assertNoError, mapInspection, mapInspectionItem, mapVehicle } from "./mappers";

/** Listado publicado con score de inspección — paridad catálogo web/mobile. */
export async function listPublishedVehiclesForCatalog(
  client: TexoSupabaseClient,
): Promise<VehicleCatalogItem[]> {
  const { data, error } = await client
    .from("vehicles")
    .select("*, inspections(score)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  assertNoError(error);

  return (data ?? []).map((row) => {
    const inspection = row.inspections as { score: number } | null;
    return {
      ...mapVehicle(row),
      inspection_score: inspection?.score ?? null,
    };
  });
}

/** Listado de vehículos publicados para inventario comprador. */
export async function listPublishedVehicles(
  client: TexoSupabaseClient,
): Promise<Vehicle[]> {
  const { data, error } = await client
    .from("vehicles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  assertNoError(error);
  return (data ?? []).map(mapVehicle);
}

/** Ficha de vehículo con inspección e ítems. */
export async function getVehicleWithInspection(
  client: TexoSupabaseClient,
  id: string,
): Promise<VehicleWithInspection | null> {
  const { data: vehicle, error: vehicleError } = await client
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  assertNoError(vehicleError);
  if (!vehicle) return null;

  const { data: inspection, error: inspectionError } = await client
    .from("inspections")
    .select("*")
    .eq("vehicle_id", id)
    .maybeSingle();

  assertNoError(inspectionError);

  let inspectionItems: ReturnType<typeof mapInspectionItem>[] = [];
  if (inspection) {
    const { data: items, error: itemsError } = await client
      .from("inspection_items")
      .select("*")
      .eq("inspection_id", inspection.id)
      .order("category", { ascending: true });

    assertNoError(itemsError);
    inspectionItems = (items ?? []).map(mapInspectionItem);
  }

  return {
    ...mapVehicle(vehicle),
    inspection: inspection ? mapInspection(inspection) : null,
    inspection_items: inspectionItems,
  };
}

/** Vehículos del vendedor autenticado o por sellerId (admin). */
export async function listSellerVehicles(
  client: TexoSupabaseClient,
  sellerId: string,
): Promise<Vehicle[]> {
  const { data, error } = await client
    .from("vehicles")
    .select("*")
    .eq("seller_id", sellerId)
    .order("updated_at", { ascending: false });

  assertNoError(error);
  return (data ?? []).map(mapVehicle);
}

/** Vehículos en cola de inspección (admin). */
export async function listVehiclesPendingInspection(
  client: TexoSupabaseClient,
): Promise<Vehicle[]> {
  const { data, error } = await client
    .from("vehicles")
    .select("*")
    .eq("status", "pending_inspection")
    .order("updated_at", { ascending: true });

  assertNoError(error);
  return (data ?? []).map(mapVehicle);
}
