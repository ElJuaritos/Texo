import type { Database } from "../types/database";
import type {
  Inspection,
  InspectionItem,
  Offer,
  Transaction,
  Vehicle,
} from "../types/domain";
import type { InspectionSeverity } from "../enums/types";

type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];
type InspectionRow = Database["public"]["Tables"]["inspections"]["Row"];
type InspectionItemRow = Database["public"]["Tables"]["inspection_items"]["Row"];
type OfferRow = Database["public"]["Tables"]["offers"]["Row"];
type TransactionRow = Database["public"]["Tables"]["transactions"]["Row"];

/** Convierte numeric de Postgres a number en dominio. */
function toNumber(value: number | string | null): number | null {
  if (value === null) return null;
  return typeof value === "number" ? value : Number(value);
}

/** Mapea fila DB → tipo dominio Vehicle. */
export function mapVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    seller_id: row.seller_id,
    make: row.make,
    model: row.model,
    year: row.year,
    trim: row.trim,
    mileage: row.mileage,
    estimated_price: toNumber(row.estimated_price),
    listing_price: toNumber(row.listing_price),
    status: row.status,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/** Mapea fila DB → tipo dominio Inspection. */
export function mapInspection(row: InspectionRow): Inspection {
  return {
    id: row.id,
    vehicle_id: row.vehicle_id,
    inspector_name: row.inspector_name,
    score: row.score,
    passed: row.passed,
    certified_at: row.certified_at,
    notes: row.notes,
    created_at: row.created_at,
  };
}

/** Mapea fila DB → tipo dominio InspectionItem. */
export function mapInspectionItem(row: InspectionItemRow): InspectionItem {
  return {
    id: row.id,
    inspection_id: row.inspection_id,
    category: row.category,
    component: row.component,
    severity: row.severity as InspectionSeverity,
    description: row.description,
    photo_path: row.photo_path,
  };
}

/** Mapea fila DB → tipo dominio Offer. */
export function mapOffer(row: OfferRow): Offer {
  return {
    id: row.id,
    vehicle_id: row.vehicle_id,
    buyer_id: row.buyer_id,
    amount: toNumber(row.amount) ?? 0,
    status: row.status,
    expires_at: row.expires_at,
    message: row.message,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/** Mapea fila DB → tipo dominio Transaction. */
export function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    vehicle_id: row.vehicle_id,
    offer_id: row.offer_id,
    seller_id: row.seller_id,
    buyer_id: row.buyer_id,
    status: row.status,
    closed_at: row.closed_at,
    created_at: row.created_at,
  };
}

/** Lanza error legible si Supabase devuelve error. */
export function assertNoError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}
