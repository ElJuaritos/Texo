import type { VehicleCatalogItem } from "@texo/shared";
import { INSPECTION_MIN_PUBLISH_SCORE, resolveVehiclePrice } from "@texo/shared";
import type { FilterChipId } from "../components/ui/FilterChips";

/** Filtros por chip — paridad con web HomeCatalog. */
export function applyChipFilter(
  vehicles: VehicleCatalogItem[],
  chip: FilterChipId,
): VehicleCatalogItem[] {
  switch (chip) {
    case "certified":
      return vehicles.filter(
        (v) =>
          v.inspection_score != null &&
          v.inspection_score >= INSPECTION_MIN_PUBLISH_SCORE,
      );
    case "sedan":
      return vehicles.filter((v) =>
        ["corolla", "sentra", "jetta", "c-class", "sedan"].some((k) =>
          `${v.make} ${v.model} ${v.trim ?? ""}`.toLowerCase().includes(k),
        ),
      );
    case "suv":
      return vehicles.filter((v) =>
        ["suv", "cx", "x3", "x5", "rav4", "cr-v"].some((k) =>
          `${v.make} ${v.model}`.toLowerCase().includes(k),
        ),
      );
    case "under400k":
      return vehicles.filter(
        (v) =>
          (resolveVehiclePrice(v.listing_price, v.estimated_price) ?? 0) < 400000,
      );
    case "under600k":
      return vehicles.filter(
        (v) =>
          (resolveVehiclePrice(v.listing_price, v.estimated_price) ?? 0) < 600000,
      );
    default:
      return vehicles;
  }
}

/** Búsqueda local por marca, modelo o año. */
export function searchCatalog(
  vehicles: VehicleCatalogItem[],
  query: string,
): VehicleCatalogItem[] {
  if (!query.trim()) return vehicles;
  const q = query.toLowerCase();
  return vehicles.filter(
    (v) =>
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      String(v.year).includes(q),
  );
}
