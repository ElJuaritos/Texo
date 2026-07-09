import { SearchCatalog } from "@/components/vehicles/HomeCatalog";
import { fetchPublishedVehiclesForCatalog } from "@/lib/data/vehicles-server";

/** Página de búsqueda dedicada. */
export default async function SearchPage() {
  let vehicles: Awaited<ReturnType<typeof fetchPublishedVehiclesForCatalog>> = [];
  try {
    vehicles = await fetchPublishedVehiclesForCatalog();
  } catch {
    vehicles = [];
  }

  return <SearchCatalog initialVehicles={vehicles} />;
}
