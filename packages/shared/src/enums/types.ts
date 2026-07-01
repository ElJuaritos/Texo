/** Union types alineados con enums Postgres — ver docs/contracts/api-surface.md v1. */
export type UserRole = "seller" | "buyer" | "admin";

export type VehicleStatus =
  | "draft"
  | "pending_documents"
  | "pending_inspection"
  | "inspection_failed"
  | "published"
  | "offer_accepted"
  | "sold"
  | "withdrawn";

export type DocumentType = "ine" | "invoice" | "circulation_card" | "other";

export type InspectionCategory =
  | "exterior"
  | "interior"
  | "mechanical"
  | "documentation"
  | "road_test";

export type OfferStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "countered"
  | "expired";

export type TestDriveStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no_show";

export type TransactionStatus =
  | "initiated"
  | "confirmed"
  | "closing"
  | "closed";

export type InspectionSeverity = "low" | "medium" | "high" | "critical";
