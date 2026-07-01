import { HomeCatalog } from "@/components/vehicles/HomeCatalog";
import type { VehicleCatalogItem } from "@texo/shared";
import { fetchPublishedVehiclesForCatalog } from "@/lib/data/vehicles-server";

/** Inventario público con filtros básicos. */
export default async function HomePage() {
  let initialError: string | null = null;
  let vehicles: VehicleCatalogItem[] = [];

  try {
    vehicles = await fetchPublishedVehiclesForCatalog();
  } catch (e) {
    initialError = e instanceof Error ? e.message : "No se pudo cargar el inventario";
  }

  return <HomeCatalog initialVehicles={vehicles} initialError={initialError} />;
}
