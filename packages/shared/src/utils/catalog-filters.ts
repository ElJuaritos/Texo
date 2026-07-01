import type { VehicleCatalogItem } from "../types/domain";
import { resolveVehiclePrice } from "./format";

export interface VehicleCatalogFilters {
  make?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
}

/** Filtros básicos de inventario — paridad web/mobile. */
export function filterCatalogVehicles(
  vehicles: VehicleCatalogItem[],
  filters: VehicleCatalogFilters,
  options?: { favoriteIds?: Set<string>; favoritesOnly?: boolean },
): VehicleCatalogItem[] {
  return vehicles.filter((vehicle) => {
    if (options?.favoritesOnly && !options.favoriteIds?.has(vehicle.id)) {
      return false;
    }
    if (filters.make && vehicle.make !== filters.make) return false;

    const price = resolveVehiclePrice(
      vehicle.listing_price,
      vehicle.estimated_price,
    );
    if (filters.minPrice != null && (price ?? 0) < filters.minPrice) return false;
    if (filters.maxPrice != null && (price ?? 0) > filters.maxPrice) return false;
    if (filters.minYear != null && vehicle.year < filters.minYear) return false;

    return true;
  });
}

/** Marcas únicas ordenadas para select de filtros. */
export function getCatalogMakes(vehicles: VehicleCatalogItem[]): string[] {
  return [...new Set(vehicles.map((v) => v.make))].sort();
}
