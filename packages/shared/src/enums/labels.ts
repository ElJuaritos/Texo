import type {
  DocumentType,
  InspectionCategory,
  OfferStatus,
  TestDriveStatus,
  TransactionStatus,
  UserRole,
  VehicleStatus,
} from "./types";

/** Etiquetas UI en español para roles. */
export const USER_ROLES: Record<UserRole, string> = {
  seller: "Vendedor",
  buyer: "Comprador",
  admin: "Administrador",
};

export const VEHICLE_STATUSES: Record<VehicleStatus, string> = {
  draft: "Borrador",
  pending_documents: "Pendiente documentos",
  pending_inspection: "Pendiente inspección",
  inspection_failed: "Inspección no aprobada",
  published: "Publicado",
  offer_accepted: "Oferta aceptada",
  sold: "Vendido",
  withdrawn: "Retirado",
};

export const DOCUMENT_TYPES: Record<DocumentType, string> = {
  ine: "INE",
  invoice: "Factura",
  circulation_card: "Tarjeta de circulación",
  other: "Otro",
};

export const INSPECTION_CATEGORIES: Record<InspectionCategory, string> = {
  exterior: "Exterior",
  interior: "Interior",
  mechanical: "Mecánica",
  documentation: "Documentación",
  road_test: "Prueba en ruta",
};

export const OFFER_STATUSES: Record<OfferStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
  countered: "Contraoferta",
  expired: "Expirada",
};

export const TEST_DRIVE_STATUSES: Record<TestDriveStatus, string> = {
  scheduled: "Agendada",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

export const TRANSACTION_STATUSES: Record<TransactionStatus, string> = {
  initiated: "Iniciada",
  confirmed: "Confirmada",
  closing: "En cierre",
  closed: "Cerrada",
};
