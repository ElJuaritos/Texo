import "server-only";

import { getTexoServerClient } from "@/lib/supabase/server-client";
import { listPublishedVehiclesForCatalog } from "@texo/shared";
import type { VehicleCatalogItem } from "@texo/shared";

/** Catálogo SSR con score de inspección. */
export async function fetchPublishedVehiclesForCatalog(): Promise<
  VehicleCatalogItem[]
> {
  const client = await getTexoServerClient();
  return listPublishedVehiclesForCatalog(client);
}
