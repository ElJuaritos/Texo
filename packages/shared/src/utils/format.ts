import { DEFAULT_CURRENCY } from "../constants";

/** Formatea precio en MXN para UI (web + mobile). */
export function formatPriceMxn(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: DEFAULT_CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Alias corto usado en mobile. */
export const formatPrice = formatPriceMxn;

/** Formatea kilometraje con separador de miles. */
export function formatMileage(km: number): string {
  return new Intl.NumberFormat("es-MX").format(km);
}

/** Estimación demo de rango de mercado según año y km. */
export function estimatePriceRange(
  year: number,
  mileage: number,
): { min: number; max: number } {
  const age = new Date().getFullYear() - year;
  const base = 450_000;
  const depreciation = age * 28_000 + Math.floor(mileage / 10_000) * 12_000;
  const mid = Math.max(80_000, base - depreciation);
  return { min: Math.round(mid * 0.92), max: Math.round(mid * 1.08) };
}

/** Precio de listado con fallback a estimado (vehículos publicados). */
export function resolveVehiclePrice(
  listingPrice: number | null,
  estimatedPrice: number | null,
): number | null {
  return listingPrice ?? estimatedPrice;
}
