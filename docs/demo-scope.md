# Alcance demo — 4 semanas

Checklist In/Out del demo funcional y cronograma semanal.

## Objetivo del demo

Demostrar el flujo completo vendedor → inspección → publicación → comprador → oferta → prueba de manejo → seguimiento admin, con datos reales de inspección y UI responsiva. Suficiente para validación con usuarios e inversores; **no** es MVP productivo.

---

## In scope ✅

| Área | Entregable |
|------|------------|
| **Valuación vendedor** | Formulario + estimación de rango de mercado (`/sell`) |
| **Documentos vendedor** | Carga INE y factura (Storage privado) (`/sell/documents`) |
| **Inspección** | Reporte real en ficha: score 100 pts, ítems, certificación dual |
| **Publicación** | Vehículo visible solo si score ≥ 75 |
| **Browse comprador** | Listado con filtros básicos (`/`) |
| **Ficha vehículo** | Detalle + reporte inspección (`/vehicles/[id]`) |
| **Ofertas** | Oferta formal comprador; respuesta vendedor/admin |
| **Prueba de manejo** | Agendamiento post-oferta aceptada |
| **Admin** | Panel estados transacción, moderación básica (`/admin`) |
| **Auth** | Registro/login email + password (Supabase Auth) |
| **Responsive** | Mobile-first en todas las pantallas demo |

## Out of scope ❌

| Área | Motivo |
|------|--------|
| Escrow / pagos reales | Post-fondeo; CNBV pendiente |
| Firma digital legal | Integración Mifiel/Firel pendiente |
| Push notifications | Post-fondeo |
| IA de negociación | Horizonte 2 |
| Verificación ID automatizada | Metamap/Truora post-fondeo |
| Depósito para prueba de manejo | Explícitamente fuera en MVP demo |
| App móvil nativa (features) | Web responsive + scaffold mobile en paralelo; paridad Slice 1–3 |
| Multi-ciudad | ICP Polanco/CDMX únicamente |

---

## Qué es real vs simulado en demo

| Funcionalidad | Demo | Notas |
|---------------|------|-------|
| Inspección | **Real** | Mecánico certificado, score en sistema |
| Valuación | **Real** (rango) | Puede ser algoritmo simple + ajuste manual admin |
| Ofertas | **Real** | Flujo completo en DB |
| Prueba de manejo | **Real** | Agendamiento y confirmación |
| Escrow | **Simulado** | Cambio de estado en `transactions`; sin movimiento de dinero |
| Firma digital | **Simulado** | Checkbox / estado documental |
| Push | **Simulado** | Email manual o ninguno |
| Transferencia vehicular | **Documentada** | Estado final en admin; sin gestoría real |

---

## Cronograma semanal

### Semana 1 — Fundación + valuación vendedor

- [ ] Scaffold Next.js 15 + Tailwind + Supabase init
- [ ] Auth (registro/login seller/buyer)
- [ ] Schema DB inicial (profiles, vehicles) — ver database.md
- [ ] Ruta `/sell` — captura vehículo + valuación
- [ ] Layout base responsive + navegación

### Semana 2 — Documentos + inspección

- [ ] Storage buckets privados (documentos por transacción)
- [ ] Ruta `/sell/documents` — upload INE, factura
- [ ] Tablas inspections + inspection_items
- [ ] Flujo inspección: captura score e ítems (admin o formulario mecánico)
- [ ] Certificación dual en ficha (score ≥ 75 → publicable)

### Semana 3 — Experiencia comprador

- [ ] Ruta `/` — inventario publicado, filtros básicos
- [ ] Ruta `/vehicles/[id]` — ficha + reporte inspección
- [ ] Tabla offers — oferta formal comprador
- [ ] Flujo aceptación/rechazo oferta
- [ ] Tabla test_drive_appointments — agendamiento post-oferta

### Semana 4 — Admin + polish

- [ ] Ruta `/admin` — panel estados, listados, moderación
- [ ] Tabla transactions — 4 estados documentales
- [ ] Confirmación post-prueba (comprador + vendedor)
- [ ] Polish UI, estados vacíos, errores, loading
- [ ] Deploy Vercel + smoke test flujo completo

---

## Criterio de éxito demo

Un usuario puede recorrer de punta a punta: vendedor publica auto inspeccionado → comprador oferta → prueba de manejo → admin ve transacción en estado avanzado — sin pagos reales ni firma legal.
