/** Puntuación máxima del reporte de inspección. */
export const INSPECTION_MAX_SCORE = 100;

/** Mínimo para publicar en inventario (certificación dual). */
export const INSPECTION_MIN_PUBLISH_SCORE = 75;

/** Comisión Texo al vendedor (~5%). */
export const SELLER_COMMISSION_RATE = 0.05;

/** ICP ticket promedio referencia (MXN). */
export const ICP_AVERAGE_TICKET_MXN = 450_000;

/** North star: días objetivo de venta (MVP productivo). */
export const NORTH_STAR_SALE_DAYS = 21;

/** Buckets Supabase Storage — alineado con docs/architecture.md. */
export const STORAGE_BUCKETS = {
  vehiclePhotos: "vehicle-photos",
  transactionDocuments: "transaction-documents",
  inspectionReports: "inspection-reports",
} as const;

/** Moneda por defecto del marketplace. */
export const DEFAULT_CURRENCY = "MXN";
