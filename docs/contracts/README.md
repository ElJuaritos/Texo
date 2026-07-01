# Contratos Texo — Web ↔ Mobile

Contratos congelados entre `apps/web` (Next.js 15) y `apps/mobile` (Expo Router). **Ningún agente de UI define tipos de dominio propios.**

## Regla de oro

```
apps/web     ──┐
               ├──► import from @texo/shared
apps/mobile  ──┘
               │
               └──► packages/shared (types, enums, constants, queries)
```

| Qué | Dónde vive | Quién modifica |
|-----|------------|----------------|
| Enums, tipos dominio | `packages/shared/src/enums`, `types` | **Orquestador** o **Agente Supabase** (types DB) |
| Queries Supabase | `packages/shared/src/queries` | **Agente Supabase** |
| Cliente Supabase factory | `packages/shared/src/supabase` | Orquestador / Supabase |
| UI, rutas, estilos | `apps/web`, `apps/mobile` | Agentes Web / Mobile |
| Schema SQL, RLS | `supabase/migrations` | **Agente Supabase** |

## Documentos de contrato

| Archivo | Versión | Contenido |
|---------|---------|-----------|
| [api-surface.md](./api-surface.md) | **v1** | Tablas, enums, queries compartidas |
| [design-tokens.md](./design-tokens.md) | **v1** | Colores, tipografía, componentes UI mínimos |
| [auth-flow.md](./auth-flow.md) | **v1** | Login, roles, routing post-auth |

## Cambios de contrato

1. Proponer en `docs/AGENT_SYNC.md` → sección "Propuestas de cambio de contrato".
2. **Orquestador** aprueba/rechaza.
3. Si se aprueba: incrementar versión (v1 → v2), Supabase agent primero, luego Web + Mobile.

## Estado

- **v1 congelado** — Fase 1 paralela puede iniciar.
- `database.ts` en shared es placeholder hasta migración del Agente Supabase.
