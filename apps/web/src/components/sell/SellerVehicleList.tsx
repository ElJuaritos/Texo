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
    <section className="mx-auto max-w-lg space-y-3">
      <h2 className="text-lg font-semibold text-texo-text-primary">Mis vehículos</h2>
      <ul className="divide-y divide-texo-border overflow-hidden rounded-2xl border border-texo-border bg-texo-surface">
        {vehicles.map((v) => (
          <li
            key={v.id}
            className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
          >
            <div>
              <p className="font-medium text-texo-text-primary">
                {v.year} {v.make} {v.model}
              </p>
              <p className="text-sm text-texo-text-secondary">
                {formatPriceMxn(v.listing_price ?? v.estimated_price)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={v.status} />
              {(v.status === "draft" || v.status === "pending_documents") && (
                <Link
                  href={`/sell/documents?vehicleId=${v.id}`}
                  className="text-sm font-medium text-texo-primary hover:underline"
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
