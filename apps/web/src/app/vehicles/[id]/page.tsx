import { notFound } from "next/navigation";
import { getBuildTimeClient } from "@/lib/supabase/build-client";
import { getTexoServerClient } from "@/lib/supabase/server-client";
import { getVehicleWithInspection } from "@texo/shared";
import { VehicleDetailView } from "@/components/vehicles/VehicleDetailView";

interface VehiclePageProps {
  params: Promise<{ id: string }>;
}

const isStaticExport = process.env.STATIC_EXPORT === "true";

/** IDs publicados para export estático (GitHub Pages). */
export async function generateStaticParams() {
  if (!isStaticExport) return [];

  const client = getBuildTimeClient();
  const { data } = await client
    .from("vehicles")
    .select("id")
    .eq("status", "published");

  return (data ?? []).map((v) => ({ id: v.id }));
}

/** Ficha completa del vehículo con inspección y acciones del comprador. */
export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  const { id } = await params;
  const supabase = isStaticExport
    ? getBuildTimeClient()
    : await getTexoServerClient();
  const vehicle = await getVehicleWithInspection(supabase, id);

  if (!vehicle || vehicle.status !== "published") {
    notFound();
  }

  return <VehicleDetailView vehicle={vehicle} />;
}
