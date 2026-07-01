import { createTexoSupabaseClient, listPublishedVehiclesForCatalog } from "@texo/shared";
import type { VehicleCatalogItem } from "@texo/shared";

/** Lista vehículos publicados con score (client-side refresh). */
export async function fetchPublishedVehiclesForCatalog(): Promise<
  VehicleCatalogItem[]
> {
  const client = createTexoSupabaseClient({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
  return listPublishedVehiclesForCatalog(client);
}
