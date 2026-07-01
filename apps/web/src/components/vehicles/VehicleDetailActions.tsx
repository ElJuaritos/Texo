"use client";

import type { VehicleWithInspection } from "@texo/shared";
import { useFavorites } from "@/hooks/useFavorites";
import { BuyerActions } from "@/components/offers/BuyerActions";

interface VehicleDetailActionsProps {
  vehicle: VehicleWithInspection;
}

/** Acciones del comprador: favorito, oferta y test drive. */
export function VehicleDetailActions({ vehicle }: VehicleDetailActionsProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.has(vehicle.id);
  const price = vehicle.listing_price ?? vehicle.estimated_price;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => toggleFavorite(vehicle.id)}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300"
      >
        {isFavorite ? "♥ En favoritos" : "♡ Agregar a favoritos"}
      </button>
      <BuyerActions vehicleId={vehicle.id} listingPrice={price} />
    </div>
  );
}
