# Agent Sync Board

Tablero de coordinación multi-agente. **Cada agente lee al iniciar y escribe al terminar.**

## Estado global

| Agente | Estado | Branch sugerido | Bloqueado por |
|--------|--------|-----------------|---------------|
| Orquestador | done | — | — |
| Supabase | **done** | `feat/supabase-initial-schema` | — |
| Web | **done (Slices 1–3)** | `feat/web-slice-1` | — |
| Mobile | **done (Slices 1–3)** | `feat/mobile-slice-1` | — |
| Integración | **v1 complete** | — | — |

**Fase actual:** ✅ **Integración v1** — paridad demo verificada · ver `docs/integration-report.md`

## Decisiones tomadas (orden cronológico)

| Fecha | Agente | Decisión | Afecta a |
|-------|--------|----------|----------|
| 2025-06-30 | Orquestador | Monorepo npm workspaces + Turborepo | Todos |
| 2025-06-30 | Orquestador | `@texo/shared` = única fuente types/enums/queries | Web, Mobile, Supabase |
| 2025-06-30 | Orquestador | Contratos v1 congelados en `docs/contracts/` | Todos |
| 2025-06-30 | Orquestador | Auth demo: email+password | Web, Mobile |
| 2025-06-30 | Orquestador | Mobile styling: NativeWind v4 recomendado | Mobile |
| 2025-06-30 | Supabase | Migración `20250630120000_initial_schema.sql` — 8 tablas + RLS + buckets | Web, Mobile |
| 2025-06-30 | Supabase | Queries v1 implementadas en `packages/shared/src/queries/` | Web, Mobile |
| 2025-06-30 | Supabase | `database.ts` alineado con schema (manual, equivalente a gen types) | Web, Mobile |
| 2025-06-30 | Supabase | Trigger signup: rol desde `user_metadata.role`, default `buyer` | Auth Web/Mobile |
| 2025-06-30 | Supabase | Migración remota Texo vía MCP `user-supabase_texo` (8 tablas, RLS, buckets) | Remoto |
| 2025-06-30 | Web | Favoritos demo en `localStorage` (sin tabla DB) | Web |
| 2025-06-30 | Web | Seed demo + storage policies vía MCP `user-supabase_texo` | Remoto |
| 2025-06-30 | Integración | Lógica catálogo/filtros/format → `@texo/shared` | Web, Mobile |

## Contratos congelados (NO cambiar sin Orquestador)

- [x] api-surface.md **v1**
- [x] design-tokens.md **v1**
- [x] auth-flow.md **v1**

## Handoff pendientes

- [x] **Supabase → Web/Mobile:** migración SQL + `database.ts` + queries implementadas
- [x] **Aplicar migración en proyecto Supabase remoto**
- [x] **Storage policies** + seed demo
- [x] **Web Slice 1–3**
- [x] **Mobile Slice 1–3**
- [x] **Integración v1** — `docs/integration-report.md`

## Breaking changes

**Ninguno** respecto a api-surface v1. Adiciones en `@texo/shared` son backward-compatible.

## Propuestas de cambio de contrato

| Fecha | Agente | Propuesta | Estado |
|-------|--------|-----------|--------|
| 2025-06-30 | Integración | Añadir `listPublishedVehiclesForCatalog` + `VehicleCatalogItem` a api-surface v2 | pending |

---

## Paridad Web ↔ Mobile

| Pantalla | Ruta Web | Ruta Mobile | Estado paridad |
|----------|----------|-------------|----------------|
| Inventario + filtros | `/` | `(tabs)/index` | ✅ |
| Ficha vehículo | `/vehicles/[id]` | `vehicle/[id]` | ✅ |
| Valuación vendedor | `/sell` | `(tabs)/sell` | ✅ |
| Documentos | `/sell/documents` | `sell/documents` | ✅ |
| Admin | `/admin` | `admin/index` | ✅ |
| Login | `/login` | `(auth)/login` | ✅ |
| Registro | `/register` | `(auth)/login` (toggle) | ⚠️ UX distinta |

---

## `@texo/shared` — queries y utils

| Función | Archivo | Usado en |
|---------|---------|----------|
| `listPublishedVehicles` | queries/vehicles.ts | legacy listados |
| `listPublishedVehiclesForCatalog` | queries/vehicles.ts | web `/`, mobile index |
| `getVehicleWithInspection` | queries/vehicles.ts | ficha detalle |
| `listSellerVehicles` | queries/vehicles.ts | panel vendedor |
| `createOffer`, `listBuyerOffers` | queries/offers.ts | flujo comprador |
| `scheduleTestDrive` | queries/test-drives.ts | post-oferta accepted |
| `listAdminTransactions` | queries/transactions.ts | admin |
| `formatPriceMxn`, `filterCatalogVehicles`, … | utils/ | web + mobile |

---

## Cuentas demo

| Rol | Email | Password |
|-----|-------|----------|
| Vendedor | seller@texo.demo | demo1234 |
| Comprador | buyer@texo.demo | demo1234 |
| Admin | admin@texo.demo | demo1234 |

---

## Próximas tareas

### Orquestador / Producto
1. Revisar `docs/integration-report.md` issues INT-01..06
2. Aprobar api-surface v2 si se congela catálogo query

### Supabase (opcional)
1. Regenerar `database.ts` desde CLI

### Polish post-demo
1. DateTimePicker mobile para test drive
2. Auto-login post-registro mobile
