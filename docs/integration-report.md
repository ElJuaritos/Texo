# Integration Report v1 — Texo Web + Mobile

> Fecha: 2025-06-30 · Agente Integración  
> Referencias: `docs/AGENT_SYNC.md`, `docs/contracts/api-surface.md`, `docs/demo-scope.md`

## Resumen ejecutivo

| Área | Estado |
|------|--------|
| Contratos `@texo/shared` | ✅ Cumple |
| Paridad funcional demo (In scope) | ✅ Con fixes aplicados |
| Paridad visual (design-tokens v1) | ⚠️ Aceptable — diferencias de plataforma |
| Auth + routing por rol | ✅ Alineado |
| `database.md` vs migrations | ✅ Alineado |
| Integración v1 | **Complete** (blockers menores documentados) |

---

## Checklist de contratos

| Item | Web | Mobile | Estado |
|------|-----|--------|--------|
| Types/enums solo desde `@texo/shared` | ✅ | ✅ | OK |
| Enums duplicados en `apps/` | No | No | OK |
| Queries compartidas para lectura/escritura DB | ✅ | ✅ | OK |
| `database.md` = schema en `supabase/migrations/` | 8 tablas, enums, RLS | — | OK |

### Lógica movida a `packages/shared` (fixes v1)

| Utilidad / query | Archivo | Motivo |
|------------------|---------|--------|
| `formatPriceMxn`, `formatMileage`, `estimatePriceRange`, `resolveVehiclePrice` | `utils/format.ts` | Duplicación web/mobile |
| `filterCatalogVehicles`, `getCatalogMakes` | `utils/catalog-filters.ts` | Filtros inventario duplicados |
| `listPublishedVehiclesForCatalog` | `queries/vehicles.ts` | Join inspección solo en web |
| `VehicleCatalogItem` | `types/domain.ts` | Tipo local `VehicleCardData` eliminado en web |

---

## Paridad funcional (demo-scope In)

| Feature | Web | Mobile | Paridad |
|---------|-----|--------|---------|
| Listado + filtros (marca, precio, año) | ✅ `/` | ✅ `(tabs)/index` | ✅ |
| Favoritos (local, sin DB) | ✅ localStorage | ✅ SecureStore | ✅ |
| Ficha + inspección | ✅ `/vehicles/[id]` | ✅ `vehicle/[id]` | ✅ |
| Valuación vendedor | ✅ `/sell` | ✅ `(tabs)/sell` | ✅ |
| Upload documentos (INE + factura) | ✅ `/sell/documents` | ✅ `sell/documents` | ✅ |
| Oferta formal | ✅ `BuyerActions` | ✅ `BuyerActions` | ✅ |
| Agendar test drive | ✅ post-oferta accepted | ✅ post-oferta accepted | ✅ |
| Panel admin transacciones | ✅ `/admin` | ✅ `admin/index` | ✅ |
| Auth email+password | ✅ login + register | ✅ `(auth)/login` (dual) | ✅ |

---

## Paridad visual (design-tokens v1)

| Componente | Web | Mobile | Paridad |
|------------|-----|--------|---------|
| **VehicleCard** — año/marca/modelo | ✅ | ✅ | ✅ |
| **VehicleCard** — km · trim | ✅ (trim opcional) | ✅ (trim opcional) | ✅ |
| **VehicleCard** — precio | `listing \|\| estimated` | `resolveVehiclePrice` shared | ✅ |
| **VehicleCard** — score | ✅ catálogo con join | ✅ catálogo con join | ✅ |
| **InspectionScore** — formato X/100 | ✅ | ✅ | ✅ |
| **InspectionScore** — umbrales 75/60 | ✅ `INSPECTION_MIN_PUBLISH_SCORE` | ✅ mismo constante | ✅ |
| **InspectionScore** — null → "Sin inspección" | ✅ | ✅ (fix v1) | ✅ |
| **StatusBadge** — labels desde shared | ✅ | ✅ | ✅ |
| **StatusBadge** — colores | Tailwind pills | RN tokens (equivalente) | ⚠️ Plataforma |

---

## Auth

| Aspecto | Web | Mobile | Paridad |
|---------|-----|--------|---------|
| Método | email + password | email + password | ✅ |
| Rol en signup metadata | buyer \| seller | buyer \| seller | ✅ |
| Redirect buyer | `/` | `/(tabs)` | ✅ |
| Redirect seller | `/sell` | `/(tabs)/sell` | ✅ |
| Redirect admin | `/admin` | `/admin` | ✅ |
| Rutas protegidas | middleware `/sell/*`, `/admin` | AuthGate + public browse | ✅ |
| Registro UI | `/register` separado | toggle en login | ⚠️ UX distinta, flujo equivalente |

---

## Discrepancias encontradas y resolución

| # | Discrepancia | Severidad | Resolución v1 |
|---|--------------|-----------|---------------|
| 1 | Mobile sin filtros en inventario | Alta | ✅ Filtros + `filterCatalogVehicles` shared |
| 2 | Mobile sin score en listado | Alta | ✅ `listPublishedVehiclesForCatalog` shared |
| 3 | Mobile sin test drive | Alta | ✅ `BuyerActions` mobile + `scheduleTestDrive` |
| 4 | Mobile sin favoritos | Media | ✅ `useFavorites` + SecureStore |
| 5 | Formatters duplicados | Media | ✅ `packages/shared/src/utils/format.ts` |
| 6 | Web `VehicleCardData` local | Media | ✅ Reemplazado por `VehicleCatalogItem` |
| 7 | Mobile `InspectionScore` no aceptaba null | Baja | ✅ Alineado a web |
| 8 | Mobile precio solo `listing_price` | Baja | ✅ `resolveVehiclePrice` |
| 9 | Mobile typecheck `router.replace` | Baja | ✅ Tipo de retorno literal en `getHomeRouteForRole` |
| 10 | AGENT_SYNC decía Mobile idle | Doc | ✅ Actualizado |

---

## Issues abiertos (no bloquean v1)

| ID | Issue | Plataforma | Propuesta |
|----|-------|------------|-----------|
| INT-01 | Test drive mobile usa `TextField` texto vs `datetime-local` web | Mobile | DateTimePicker nativo post-demo |
| INT-02 | Signup mobile no auto-login tras registro (alert + toggle) | Mobile | Alinear a web si producto lo pide |
| INT-03 | Favoritos no sincronizan cross-device (local only) | Ambos | Esperado en demo — documentado |
| INT-04 | `asTexoClient()` cast en web por genéricos `@supabase/ssr` | Web | Regenerar types o wrapper upstream |
| INT-05 | Valuación: web campo precio manual vs mobile rango algorítmico | Ambos | OK per demo-scope ("rango + ajuste admin") |
| INT-06 | Propuesta contrato: añadir `listPublishedVehiclesForCatalog` a api-surface v2 | Docs | Orquestador |

---

## Verificación técnica

```bash
npm run typecheck --workspace=@texo/shared   # ✅
npm run typecheck --workspace=@texo/web      # ✅
npm run typecheck --workspace=@texo/mobile    # ✅
npm run build --workspace=@texo/web           # ✅ (previo a integración)
```

## Cuentas demo (remoto Supabase Texo)

| Rol | Email | Password |
|-----|-------|----------|
| Vendedor | seller@texo.demo | demo1234 |
| Comprador | buyer@texo.demo | demo1234 |
| Admin | admin@texo.demo | demo1234 |

---

## Criterio Integración v1

**Complete** — Web y Mobile recorren el flujo demo-scope con datos reales, types/queries compartidos, y paridad funcional verificada. Issues abiertos son polish UX, no blockers de demo.
