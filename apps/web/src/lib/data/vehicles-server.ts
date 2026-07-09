import { getBuildTimeClient } from "@/lib/supabase/build-client";
import { getTexoServerClient } from "@/lib/supabase/server-client";
import { listPublishedVehiclesForCatalog } from "@texo/shared";
import type { VehicleCatalogItem } from "@texo/shared";

const isStaticExport = process.env.STATIC_EXPORT === "true";

/** Catálogo SSR/SSG con score de inspección. */
export async function fetchPublishedVehiclesForCatalog(): Promise<
  VehicleCatalogItem[]
> {
  const client = isStaticExport
    ? getBuildTimeClient()
    : await getTexoServerClient();
  return listPublishedVehiclesForCatalog(client);
}
