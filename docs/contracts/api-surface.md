# API Surface — Contrato v1

> Fuente de verdad compartida web + mobile + Supabase.  
> Alineado con `docs/database.md` (schema propuesto).

## Enums Postgres

### `user_role`
`seller` | `buyer` | `admin`

### `vehicle_status`
| Valor | Descripción |
|-------|-------------|
| `draft` | Captura inicial |
| `pending_documents` | Falta INE/factura |
| `pending_inspection` | Espera inspección |
| `inspection_failed` | Score < 75 |
| `published` | Visible en inventario |
| `offer_accepted` | Oferta aceptada |
| `sold` | Cierre documental/real |
| `withdrawn` | Retirado |

### `document_type`
`ine` | `invoice` | `circulation_card` | `other`

### `inspection_category`
`exterior` | `interior` | `mechanical` | `documentation` | `road_test`

### `offer_status`
`pending` | `accepted` | `rejected` | `countered` | `expired`

### `test_drive_status`
`scheduled` | `completed` | `cancelled` | `no_show`

### `transaction_status`
`initiated` | `confirmed` | `closing` | `closed`

### `inspection_severity` (app-level, no enum DB obligatorio en v1)
`low` | `medium` | `high` | `critical`

---

## Tablas y campos

### `profiles`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | FK → auth.users |
| role | user_role | seller \| buyer \| admin |
| full_name | text | nullable |
| phone | text | nullable |
| created_at | timestamptz | default now() |

### `vehicles`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| seller_id | uuid FK | → profiles.id |
| make | text | |
| model | text | |
| year | int | |
| trim | text | nullable |
| mileage | int | km |
| estimated_price | numeric | valuación |
| listing_price | numeric | nullable hasta publicar |
| status | vehicle_status | |
| published_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `vehicle_documents`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| vehicle_id | uuid FK | |
| document_type | document_type | |
| storage_path | text | bucket transaction-documents |
| uploaded_at | timestamptz | |

### `inspections`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| vehicle_id | uuid FK | unique en demo |
| inspector_name | text | |
| score | int | 0–100 |
| passed | boolean | score ≥ 75 |
| certified_at | timestamptz | nullable |
| notes | text | nullable |
| created_at | timestamptz | |

### `inspection_items`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| inspection_id | uuid FK | |
| category | inspection_category | |
| component | text | ej. "Frenos delanteros" |
| severity | text | low/medium/high/critical |
| description | text | |
| photo_path | text | nullable |

### `offers`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| vehicle_id | uuid FK | |
| buyer_id | uuid FK | → profiles.id |
| amount | numeric | MXN |
| status | offer_status | |
| expires_at | timestamptz | nullable |
| message | text | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `test_drive_appointments`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| offer_id | uuid FK | oferta aceptada |
| vehicle_id | uuid FK | |
| buyer_id | uuid FK | |
| scheduled_at | timestamptz | |
| location | text | |
| status | test_drive_status | |
| buyer_confirmed | boolean | post-prueba |
| seller_confirmed | boolean | post-prueba |
| created_at | timestamptz | |

### `transactions`
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| vehicle_id | uuid FK | |
| offer_id | uuid FK | |
| seller_id | uuid FK | |
| buyer_id | uuid FK | |
| status | transaction_status | |
| closed_at | timestamptz | nullable |
| created_at | timestamptz | |

---

## Storage buckets

| Bucket | Visibilidad | Path pattern |
|--------|-------------|--------------|
| `vehicle-photos` | Público lectura | `{vehicle_id}/{filename}` |
| `transaction-documents` | Privado | `{vehicle_id}/{doc_type}/{filename}` |
| `inspection-reports` | Privado autenticado | `{vehicle_id}/report.pdf` |

---

## Queries compartidas (`packages/shared/src/queries`)

Implementación: **Agente Supabase**. Firmas congeladas v1:

| Función | Input | Output | Usado en |
|---------|-------|--------|----------|
| `listPublishedVehicles(client)` | — | `Vehicle[]` | `/`, tabs index |
| `getVehicleWithInspection(client, id)` | vehicle id | `VehicleWithInspection \| null` | ficha detalle |
| `createOffer(client, payload)` | `CreateOfferPayload` | `{ id }` | flujo comprador |
| `scheduleTestDrive(client, payload)` | `ScheduleTestDrivePayload` | `{ id }` | post-oferta aceptada |
| `listSellerVehicles(client, sellerId)` | seller uuid | `Vehicle[]` | panel vendedor |
| `listBuyerOffers(client, buyerId)` | buyer uuid | `Offer[]` | mis ofertas |
| `listPendingOffers(client)` | — | `Offer[]` | admin cola |
| `acceptOffer(client, offerId)` | offer id | void | admin |
| `rejectOffer(client, offerId)` | offer id | void | admin |
| `listVehiclesPendingInspection(client)` | — | `Vehicle[]` | admin inspección |
| `createInspection(client, payload)` | `CreateInspectionPayload` | `{ id }` | admin |
| `publishVehicle(client, vehicleId, price)` | uuid, number | void | admin |
| `listAdminTransactions(client)` | — | `Transaction[]` | `/admin` |
| `createTransaction(client, offerId)` | offer id | `{ id }` | admin escrow simulado |
| `updateTransactionStatus(client, id, status)` | uuid, status | void | admin |

---

## RLS (resumen v2)

- **Buyer:** SELECT vehicles WHERE status = `published`; INSERT offers on published only; cannot change offer status.
- **Seller:** CRUD own vehicles (status limited); documents; cannot publish or write inspections.
- **Admin:** ALL; only admin changes offer status, publishes vehicles, writes inspections, creates transactions.
- **Storage:** path `{vehicle_id}/...` — seller + admin on private buckets.

---

## Constantes compartidas

Ver `packages/shared/src/constants`:
- `INSPECTION_MAX_SCORE = 100`
- `INSPECTION_MIN_PUBLISH_SCORE = 75`
