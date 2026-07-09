/** Queries compartidas web + mobile — api-surface v1. */
export {
  listPublishedVehicles,
  listPublishedVehiclesForCatalog,
  getVehicleWithInspection,
  listSellerVehicles,
  listVehiclesPendingInspection,
} from "./vehicles";

export {
  createOffer,
  listBuyerOffers,
  listPendingOffers,
  acceptOffer,
  rejectOffer,
} from "./offers";

export {
  createInspection,
  publishVehicle,
  getInspectionByVehicleId,
} from "./inspections";

export { scheduleTestDrive } from "./test-drives";

export {
  listAdminTransactions,
  createTransaction,
  updateTransactionStatus,
} from "./transactions";

export {
  mapVehicle,
  mapInspection,
  mapInspectionItem,
  mapOffer,
  mapTransaction,
  assertNoError,
} from "./mappers";
