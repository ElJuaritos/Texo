import type {
  DocumentType,
  InspectionCategory,
  InspectionSeverity,
  OfferStatus,
  TestDriveStatus,
  TransactionStatus,
  UserRole,
  VehicleStatus,
} from "../enums/types";

/** Perfil extendido de auth.users. */
export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

/** Vehículo publicado o en flujo de venta. */
export interface Vehicle {
  id: string;
  seller_id: string;
  make: string;
  model: string;
  year: number;
  trim: string | null;
  mileage: number;
  estimated_price: number | null;
  listing_price: number | null;
  cover_image_url: string | null;
  status: VehicleStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Referencia a documento en Storage. */
export interface VehicleDocument {
  id: string;
  vehicle_id: string;
  document_type: DocumentType;
  storage_path: string;
  uploaded_at: string;
}

/** Reporte de inspección certificada. */
export interface Inspection {
  id: string;
  vehicle_id: string;
  inspector_name: string;
  score: number;
  passed: boolean;
  certified_at: string | null;
  notes: string | null;
  created_at: string;
}

/** Ítem individual del reporte de inspección. */
export interface InspectionItem {
  id: string;
  inspection_id: string;
  category: InspectionCategory;
  component: string;
  severity: InspectionSeverity;
  description: string;
  photo_path: string | null;
}

/** Oferta formal de un comprador. */
export interface Offer {
  id: string;
  vehicle_id: string;
  buyer_id: string;
  amount: number;
  status: OfferStatus;
  expires_at: string | null;
  message: string | null;
  created_at: string;
  updated_at: string;
}

/** Cita de prueba de manejo. */
export interface TestDriveAppointment {
  id: string;
  offer_id: string;
  vehicle_id: string;
  buyer_id: string;
  scheduled_at: string;
  location: string;
  status: TestDriveStatus;
  buyer_confirmed: boolean;
  seller_confirmed: boolean;
  created_at: string;
}

/** Transacción simplificada (estados documentales en demo). */
export interface Transaction {
  id: string;
  vehicle_id: string;
  offer_id: string;
  seller_id: string;
  buyer_id: string;
  status: TransactionStatus;
  closed_at: string | null;
  created_at: string;
}

/** Vehículo con inspección para ficha de detalle. */
export interface VehicleWithInspection extends Vehicle {
  inspection: Inspection | null;
  inspection_items: InspectionItem[];
}

/** Vehículo en catálogo con score de inspección para listados. */
export interface VehicleCatalogItem extends Vehicle {
  inspection_score: number | null;
}

/** Payload para crear una oferta formal. */
export interface CreateOfferPayload {
  vehicle_id: string;
  amount: number;
  message?: string;
  expires_at?: string;
}

/** Payload para agendar prueba de manejo. */
export interface ScheduleTestDrivePayload {
  offer_id: string;
  scheduled_at: string;
  location: string;
}

/** Ítem de inspección al registrar reporte (admin). */
export interface CreateInspectionItemPayload {
  category: InspectionCategory;
  component: string;
  severity: InspectionSeverity;
  description: string;
  photo_path?: string;
}

/** Payload para crear inspección certificada (admin). */
export interface CreateInspectionPayload {
  vehicle_id: string;
  inspector_name: string;
  score: number;
  notes?: string;
  items?: CreateInspectionItemPayload[];
}

export type { Database } from "./database";
