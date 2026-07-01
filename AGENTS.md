# Texo — Contexto para agentes IA

## Qué es

Vender un auto seminuevo en México es lento, opaco y riesgoso: precios inciertos, compradores poco serios y fricción legal en la transferencia. Texo (texo.mx) conecta compradores y vendedores con inspección certificada, negociación mediada, pagos protegidos y gestoría — sin comprar inventario. Comisión ~5% al vendedor. ICP: Polanco, ~$450K MXN.

## Fase actual: demo (4 semanas)

**In demo:** valuación, ficha + inspección real, browse, ofertas, prueba de manejo, admin básico.

**Out demo:** escrow real, firma legal, push, IA negociación, verificación ID auto.

## Stack

Next.js 15 · Expo (mobile) · TypeScript · Tailwind / NativeWind · Supabase · Vercel (web)

## Monorepo

```
apps/web/              # Next.js 15 App Router (@texo/web)
apps/mobile/           # Expo Router (@texo/mobile)
packages/shared/       # @texo/shared — types, enums, queries, supabase
supabase/              # migrations, functions
docs/contracts/        # contratos web ↔ mobile (v1 congelado)
docs/AGENT_SYNC.md     # tablero multi-agente
```

**Regla:** web y mobile importan dominio solo desde `@texo/shared`. Contratos en `docs/contracts/`.

## Dominios MVP demo

| Dominio | Web | Mobile |
|---------|-----|--------|
| Seller | `/sell`, `/sell/documents` | `(tabs)/sell` |
| Buyer | `/`, `/vehicles/[id]` | `(tabs)/index`, `vehicle/[id]` |
| Admin | `/admin` | `admin/index` |

## Reglas no negociables

1. ≤500 líneas/archivo · 2. Mobile-first · 3. UI español, código inglés · 4. Scope mínimo · 5. No secretos · 6. Un componente/archivo.

## Docs detalladas

| Tarea | Leer |
|-------|------|
| Mapa | docs/INDEX.md |
| Multi-agente | docs/AGENT_SYNC.md |
| Negocio | docs/product-overview.md |
| Alcance demo | docs/demo-scope.md |
| Contratos API | docs/contracts/api-surface.md |
| Arquitectura | docs/architecture.md |
| DB | docs/database.md |

**Flujo IA:** AGENTS.md → INDEX → doc específico. Negocio extenso → `product-overview.md`.

## Comandos

```bash
npm install
npm run dev:web
npm run dev:mobile
npm run typecheck
npx supabase start   # tras supabase init
```

## Fase multi-agente

Prompt 0 ✅ done → Fase 1 paralela: Supabase + Web + Mobile. Ver AGENT_SYNC.md.
