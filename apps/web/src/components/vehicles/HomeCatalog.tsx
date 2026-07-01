"use client";

import type { VehicleCatalogItem } from "@texo/shared";
import { useFavorites } from "@/hooks/useFavorites";
import { VehicleInventory } from "@/components/vehicles/VehicleInventory";
import { ErrorState } from "@/components/ui/ErrorState";
import { useState } from "react";
import { fetchPublishedVehiclesForCatalog } from "@/lib/data/vehicles";

interface HomeCatalogProps {
  initialVehicles: VehicleCatalogItem[];
  initialError?: string | null;
}

/** Catálogo comprador con filtros y favoritos. */
export function HomeCatalog({ initialVehicles, initialError }: HomeCatalogProps) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [error, setError] = useState(initialError ?? null);
  const [loading, setLoading] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublishedVehiclesForCatalog();
      setVehicles(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Seminuevos certificados</h1>
        <div className="flex items-center gap-3">
          {loading && <span className="text-xs text-slate-400">Actualizando…</span>}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly((v) => !v)}
            className={`text-sm font-medium ${showFavoritesOnly ? "text-teal-700" : "text-slate-500"}`}
          >
            {showFavoritesOnly ? "Ver todos" : "Solo favoritos"}
          </button>
        </div>
      </div>
      <VehicleInventory
        vehicles={vehicles}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        showFavoritesOnly={showFavoritesOnly}
      />
    </div>
  );
}
