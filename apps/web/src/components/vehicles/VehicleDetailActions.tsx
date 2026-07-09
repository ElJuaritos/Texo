"use client";

import type { VehicleWithInspection } from "@texo/shared";
import { useFavorites } from "@/hooks/useFavorites";
import { BuyerActions } from "@/components/offers/BuyerActions";
import { cn } from "@/lib/cn";

interface VehicleDetailActionsProps {
  vehicle: VehicleWithInspection;
  offerModalOpen?: boolean;
  onOfferModalOpenChange?: (open: boolean) => void;
}

/** Acciones del comprador en sidebar desktop. */
export function VehicleDetailActions({
  vehicle,
  offerModalOpen,
  onOfferModalOpenChange,
}: VehicleDetailActionsProps) {
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.has(vehicle.id);
  const price = vehicle.listing_price ?? vehicle.estimated_price;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => toggleFavorite(vehicle.id)}
        className={cn(
          "w-full rounded-full border px-4 py-3 text-sm font-medium transition",
          isFavorite
            ? "border-texo-error/30 bg-texo-error/10 text-texo-error"
            : "border-texo-border bg-texo-surface text-texo-text-primary hover:border-texo-primary/50",
        )}
      >
        {isFavorite ? "♥ En favoritos" : "♡ Agregar a favoritos"}
      </button>
      <BuyerActions
        vehicleId={vehicle.id}
        listingPrice={price}
        modalOpen={offerModalOpen}
        onModalOpenChange={onOfferModalOpenChange}
      />
    </div>
  );
}
