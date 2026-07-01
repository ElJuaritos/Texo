"use client";

import { useMemo, useState } from "react";
import type { VehicleCatalogItem } from "@texo/shared";
import {
  filterCatalogVehicles,
  getCatalogMakes,
} from "@texo/shared";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface VehicleInventoryProps {
  vehicles: VehicleCatalogItem[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  showFavoritesOnly?: boolean;
}

/** Filtros básicos y grid de inventario. */
export function VehicleInventory({
  vehicles,
  favorites,
  onToggleFavorite,
  showFavoritesOnly = false,
}: VehicleInventoryProps) {
  const [make, setMake] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");

  const makes = useMemo(() => getCatalogMakes(vehicles), [vehicles]);

  const filtered = useMemo(
    () =>
      filterCatalogVehicles(
        vehicles,
        {
          make: make || undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          minYear: minYear ? Number(minYear) : undefined,
        },
        { favoriteIds: favorites, favoritesOnly: showFavoritesOnly },
      ),
    [vehicles, make, minPrice, maxPrice, minYear, favorites, showFavoritesOnly],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Marca</span>
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">Todas</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Precio mín.</span>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="300000"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Precio máx.</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="600000"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Año desde</span>
          <input
            type="number"
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
            placeholder="2018"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay vehículos"
          description="Prueba ajustando los filtros o vuelve más tarde."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isFavorite={favorites.has(vehicle.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
