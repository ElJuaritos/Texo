import Link from "next/link";
import { notFound } from "next/navigation";
import { getTexoServerClient } from "@/lib/supabase/server-client";
import { getVehicleWithInspection } from "@texo/shared";
import { InspectionReport } from "@/components/vehicles/InspectionReport";
import { VehicleDetailActions } from "@/components/vehicles/VehicleDetailActions";
import { InspectionScore } from "@/components/ui/InspectionScore";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatMileage, formatPriceMxn } from "@/lib/format";

interface VehiclePageProps {
  params: Promise<{ id: string }>;
}

/** Ficha completa del vehículo con inspección y acciones del comprador. */
export default async function VehicleDetailPage({ params }: VehiclePageProps) {
  const { id } = await params;
  const supabase = await getTexoServerClient();
  const vehicle = await getVehicleWithInspection(supabase, id);

  if (!vehicle || vehicle.status !== "published") {
    notFound();
  }

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const price = vehicle.listing_price ?? vehicle.estimated_price;

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm font-medium text-teal-700 hover:underline">
        ← Volver al inventario
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="aspect-video rounded-xl bg-slate-100" />

          <header className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
              <StatusBadge status={vehicle.status} />
            </div>
            <p className="text-slate-500">
              {formatMileage(vehicle.mileage)} km
              {vehicle.trim ? ` · ${vehicle.trim}` : ""}
            </p>
            <p className="text-3xl font-bold text-slate-900">{formatPriceMxn(price)}</p>
            {vehicle.inspection && (
              <InspectionScore score={vehicle.inspection.score} />
            )}
          </header>

          {vehicle.inspection ? (
            <InspectionReport
              inspection={vehicle.inspection}
              items={vehicle.inspection_items}
            />
          ) : (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              Inspección pendiente de publicación.
            </p>
          )}
        </div>

        <aside>
          <VehicleDetailActions vehicle={vehicle} />
        </aside>
      </div>
    </div>
  );
}
