import type { Vehicle } from "@texo/shared";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPriceMxn } from "@/lib/format";
import Link from "next/link";

interface SellerVehicleListProps {
  vehicles: Vehicle[];
}

/** Listado de borradores y vehículos del vendedor. */
export function SellerVehicleList({ vehicles }: SellerVehicleListProps) {
  if (vehicles.length === 0) return null;

  return (
    <section className="mt-8 space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Mis vehículos</h2>
      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {vehicles.map((v) => (
          <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">
                {v.year} {v.make} {v.model}
              </p>
              <p className="text-sm text-slate-500">
                {formatPriceMxn(v.listing_price ?? v.estimated_price)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={v.status} />
              {v.status === "draft" && (
                <Link
                  href={`/sell/documents?vehicleId=${v.id}`}
                  className="text-sm font-medium text-teal-700 hover:underline"
                >
                  Subir docs
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
