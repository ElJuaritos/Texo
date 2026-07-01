# Texo

Marketplace de vehículos seminuevos en México ([texo.mx](https://texo.mx)). Conecta compradores y vendedores con inspección certificada, negociación mediada y gestoría. Comisión ~5% al vendedor.

Monorepo: **Next.js 15** (web) + **Expo** (mobile) + **Supabase** + paquete compartido `@texo/shared`.

## Requisitos

- Node.js 20+
- npm 10+
- Expo Go (para mobile, opcional en dev)

## Inicio rápido

```bash
git clone https://github.com/ElJuaritos/Texo.git
cd Texo
npm install
cp .env.example apps/web/.env.local   # completar Supabase
npm run dev:web                         # http://localhost:3000
npm run dev:mobile                      # Expo dev server
```

## Variables de entorno

| Variable | App | Descripción |
|----------|-----|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | web | URL Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | web | Clave anon |
| `EXPO_PUBLIC_SUPABASE_URL` | mobile | URL Supabase |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | mobile | Clave anon |

## Estructura

```
apps/web/       → Next.js 15
apps/mobile/    → Expo Router
packages/shared → types, enums, queries
supabase/       → DB (pendiente init)
docs/           → documentación + contratos
```

## Documentación

| Audiencia | Enlace |
|-----------|--------|
| Agentes IA | [AGENTS.md](./AGENTS.md) |
| Multi-agente | [docs/AGENT_SYNC.md](./docs/AGENT_SYNC.md) |
| Índice | [docs/INDEX.md](./docs/INDEX.md) |

## Licencia

Pendiente.
