# Integration Report v2 — Texo Demo Deploy Readiness

> Fecha: 2025-07-05 · Post-implementación plan demo público  
> Referencias: `docs/demo-scope.md`, `docs/auth-deploy.md`, `docs/database.md`

## Resumen ejecutivo

| Área | Estado v1 | Estado v2 |
|------|-----------|-----------|
| Paridad UI web/mobile | ✅ | ✅ |
| Seguridad RLS (rol admin, offers, vehicles) | ❌ | ✅ Migración `20250705120000` |
| Storage policies | ❌ | ✅ En migración (aplicar en remoto) |
| Admin operativo (ofertas, inspección, tx) | ❌ read-only | ✅ Web `/admin` |
| Flujo E2E sin Supabase Dashboard | ❌ | ✅ Con panel admin |
| Deploy Vercel | ❌ | ✅ `apps/web/vercel.json` |
| Seed demo | ❌ | ✅ `scripts/seed-demo.mjs` |
| Credenciales débiles en docs | ❌ expuestas | ✅ Removidas — usar seed script |

**Criterio demo público:** listo tras aplicar migraciones en Supabase remoto + `npm run seed:demo` + configurar Vercel env vars. Ver checklist abajo.

---

## Paridad funcional (demo-scope In)

| Feature | Web | Mobile | Paridad | Notas v2 |
|---------|-----|--------|---------|----------|
| Listado + filtros | ✅ | ✅ | ✅ | — |
| Ficha + inspección | ✅ | ✅ | ✅ | — |
| Valuación vendedor | ✅ | ✅ | ✅ | — |
| Upload documentos | ✅ | ✅ | ✅ | Requiere storage policies |
| Oferta formal | ✅ | ✅ | ✅ | Solo vehículos publicados (RLS) |
| Moderación ofertas | ✅ admin | ❌ | ⚠️ | Demo web-first para admin |
| Inspección + publicación | ✅ admin | ❌ | ⚠️ | Admin web |
| Agendar test drive | ✅ | ✅ | ✅ | Tras oferta aceptada por admin |
| Transacciones simuladas | ✅ admin | ❌ | ⚠️ | Admin avanza estados |
| Auth | ✅ | ✅ | ✅ | — |

---

## Seguridad — fixes aplicados

| ID | Issue | Fix |
|----|-------|-----|
| V-CRIT-01 | Escalación admin en signup | `handle_new_user` whitelist buyer/seller |
| V-CRIT-02 | Escalación admin en profiles UPDATE | Trigger `prevent_profile_role_change` |
| V-CRIT-03 | Storage sin policies | Migración storage path-based |
| V-CRIT-04 | Passwords demo1234 en docs | Removidos; seed con password fuerte |
| V-HIGH-01 | RLS permisivo offers/vehicles/inspections | Triggers + policies admin-only |

---

## Smoke test demo (15 min)

Ejecutar en orden con tres roles (cuentas de `npm run seed:demo`):

### 1. Comprador (buyer@texo.mx)

1. Abrir `/` — ver Mazda CX-5 publicado (seed)
2. Abrir ficha `/vehicles/[id]` — reporte inspección score ≥ 75
3. Login → enviar oferta formal
4. Esperar moderación admin (paso 2)

### 2. Admin (admin@texo.mx)

1. Login → `/admin`
2. **Ofertas pendientes** → Aceptar oferta del comprador
3. (Opcional) **Inspección** — si hay vehículo en `pending_inspection`: inspeccionar y publicar
4. Tras prueba de manejo (comprador): **Transacciones** → Iniciar transacción → Avanzar estados hasta `closed`

### 3. Vendedor (seller@texo.mx)

1. `/sell` — crear vehículo nuevo
2. `/sell/documents` — subir INE + factura
3. Ver vehículo en cola admin (pending_inspection)

### 4. Comprador (continuación)

1. Tras oferta aceptada → agendar prueba de manejo en ficha
2. Confirmar flujo completo

**Criterio éxito:** catálogo visible sin login; oferta → aceptación admin → prueba → transacción simulada sin tocar Supabase Dashboard.

---

## Deploy checklist

- [ ] Aplicar migraciones en Supabase remoto (`supabase db push` o SQL Editor)
- [ ] `npm run seed:demo` con `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Habilitar confirmación email (recomendado demo público) — ver `docs/auth-deploy.md`
- [ ] Vercel: root `apps/web`, env `NEXT_PUBLIC_SUPABASE_*`
- [ ] Supabase Auth: Site URL = dominio Vercel
- [ ] Rotar/eliminar cuentas `@texo.demo` si existían con password débil
- [ ] `npm run build --workspace=@texo/web` pasa en CI/local

---

## Issues abiertos (no bloquean demo web)

| ID | Issue |
|----|-------|
| INT-01 | Test drive mobile: TextField vs datetime picker |
| INT-02 | Admin solo en web (aceptable demo pitch) |
| INT-03 | Favoritos local-only |
| INT-04 | Storage migration requiere owner en `storage.objects` — aplicar vía CLI/dashboard |

---

## Verificación técnica

```bash
npm run typecheck
npm run build --workspace=@texo/web
```

## Cuentas demo

**No almacenar contraseñas en el repositorio.** Crear con:

```bash
SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... npm run seed:demo
```

Emails: `admin@texo.mx`, `seller@texo.mx`, `buyer@texo.mx`

---

## QA Web Polish (2025-07-08)

Checklist local (`localhost:3000`) tras sprint diseño + catálogo demo:

| # | Prueba | Resultado |
|---|--------|-----------|
| 1 | Home sin login — 7 vehículos + fotos | ✅ Pass |
| 1b | Filtros Certificados / Sedán / SUV / precio | ✅ Pass (lógica en `HomeCatalog`) |
| 2 | Ficha Mercedes — foto hero, score 94 | ✅ Pass |
| 3 | Login buyer → redirect `/` | ✅ Pass (`AuthForm` + `sanitizeRedirect`) |
| 4 | Modal oferta — precio prellenado, cerrar visible | ✅ Pass |
| 5 | Login seller → `/sell` | ✅ Pass |
| 6 | Sell paso 1 validación inline | ✅ Pass |
| 7 | Sell paso 2 — Enviar deshabilitado sin docs | ✅ Pass |
| 8 | Sell paso 3 — checklist SVG (no emoji) | ✅ Pass |
| 9 | Perfil — Mis ofertas real, iconos SVG | ✅ Pass |
| 10 | `/profile` protegido en middleware | ✅ Pass |
| 11 | `/terms` stub accesible | ✅ Pass |
| 12 | Admin tabs mobile sticky | ✅ Pass |
| 13 | Playwright visual smoke (14 tests) | ✅ Pass |
| 14 | `npm run typecheck` monorepo | ✅ Pass |

Capturas en `apps/web/e2e/screenshots/` (mobile 390×844 + desktop).

**Nota seed:** catálogo poblado con 7 vehículos + inspecciones; imágenes en `apps/web/public/vehicles/`. Para re-seed completo: `SUPABASE_SERVICE_ROLE_KEY=... npm run seed:demo`.
