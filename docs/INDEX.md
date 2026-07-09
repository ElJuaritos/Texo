# Documentación Texo

Mapa de documentación. Lectura bajo demanda.

## Mapa

| Documento | Cuándo leerlo |
|-----------|---------------|
| [AGENT_SYNC.md](./AGENT_SYNC.md) | Coordinación multi-agente — **leer siempre al iniciar tarea** |
| [contracts/README.md](./contracts/README.md) | Reglas de contratos web ↔ mobile |
| [contracts/api-surface.md](./contracts/api-surface.md) | Tablas, enums, queries v1 |
| [contracts/design-tokens.md](./contracts/design-tokens.md) | Paridad visual |
| [contracts/auth-flow.md](./contracts/auth-flow.md) | Auth y routing por rol |
| [product-overview.md](./product-overview.md) | Negocio, flujos, roadmap |
| [demo-scope.md](./demo-scope.md) | In/Out demo 4 semanas |
| [architecture.md](./architecture.md) | Monorepo, capas, rutas |
| [stack.md](./stack.md) | Versiones y herramientas |
| [conventions.md](./conventions.md) | Estilo de código |
| [database.md](./database.md) | Schema propuesto / real |
| [auth-deploy.md](./auth-deploy.md) | Auth, seed y checklist deploy demo público |
| [integration-report.md](./integration-report.md) | Paridad web/mobile y smoke test |

## Instrucción para agentes IA

1. [AGENTS.md](../AGENTS.md) — contexto compacto.
2. [AGENT_SYNC.md](./AGENT_SYNC.md) — estado y blockers.
3. **Un solo doc** de la tabla según tarea.
4. **No** definir types de dominio en apps — usar `@texo/shared`.

## Mantenimiento

| Evento | Actualizar |
|--------|------------|
| Migración Supabase | database.md, packages/shared types |
| Cambio contrato | docs/contracts/* + AGENT_SYNC |
| Decisión multi-agente | AGENT_SYNC.md |
