# Arquitectura

## Visión general — monorepo

```
                    Comprador / Vendedor / Admin
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
        apps/web (Next.js 15)          apps/mobile (Expo)
              │                               │
              └───────────────┬───────────────┘
                              ▼
                    packages/shared (@texo/shared)
                    types · enums · queries · supabase
                              │
                              ▼
                    Supabase (Auth · Postgres · Storage)
```

## Estructura del repo

```
apps/
  web/                 # @texo/web — Vercel
  mobile/              # @texo/mobile — Expo Go / stores
packages/
  shared/              # @texo/shared — contrato de código compartido
supabase/
  migrations/
  functions/
docs/
  contracts/           # contrato de diseño/API v1
  AGENT_SYNC.md
```

## Capas por app

| Capa | Web | Mobile |
|------|-----|--------|
| Rutas | `apps/web/src/app/` | `apps/mobile/app/` |
| UI | `apps/web/src/components/{domain}/` | `apps/mobile/components/{domain}/` |
| Hooks | `apps/web/src/hooks/` | `apps/mobile/hooks/` |
| Supabase local | `apps/web/src/lib/supabase/` | `apps/mobile/lib/supabase/` |
| Shared | `@texo/shared` | `@texo/shared` |

## Rutas demo

| Web | Mobile | Rol |
|-----|--------|-----|
| `/` | `(tabs)/index` | Comprador |
| `/vehicles/[id]` | `vehicle/[id]` | Comprador |
| `/sell` | `(tabs)/sell` | Vendedor |
| `/sell/documents` | `sell/documents` | Vendedor |
| `/admin` | `admin/index` | Admin |
| `/login` | `(auth)/login` | Todos |

## Autenticación

Email + password (demo). Rol en `profiles.role`. Detalle: [contracts/auth-flow.md](./contracts/auth-flow.md).

## Storage

| Bucket | Visibilidad |
|--------|-------------|
| `vehicle-photos` | Público lectura |
| `transaction-documents` | Privado (INE, facturas) |
| `inspection-reports` | Privado autenticado |

## Demo: real vs simulado

| Sistema | Demo |
|---------|------|
| Inspección, ofertas, citas | Real |
| Escrow, firma, push | Simulado / omitido |

## ADRs

| Decisión | Razón |
|----------|-------|
| Monorepo npm + Turborepo | Web + mobile + shared en un repo |
| `@texo/shared` única fuente de tipos | Evitar divergencia web/mobile |
| Next.js 15 App Router | SSR, layouts, Vercel |
| Expo Router | Paridad de flujos con web |
| Supabase BaaS | Velocidad demo, RLS |
| Componentes ≤500 líneas | Mantenibilidad |

## Coordinación multi-agente

Ver [AGENT_SYNC.md](./AGENT_SYNC.md). Solo Agente Supabase toca `supabase/migrations`.
