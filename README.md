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
| `EXPO_PUBLIC_WEB_BASE_URL` | mobile | URL base web para fotos (`http://localhost:3000` o `https://usuario.github.io/Texo`) |

## Deploy en GitHub Pages

La web demo se publica en `https://<usuario>.github.io/Texo/`:

1. **Settings → Secrets → Actions** — añadir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Settings → Pages → Build and deployment** — Source: **GitHub Actions**
3. Push a `main` — el workflow `.github/workflows/deploy-gh-pages.yml` construye y despliega `apps/web/out/`

Build local (export estático):

```bash
# Windows PowerShell
$env:STATIC_EXPORT="true"; node scripts/prepare-static-export.mjs; npm run build --workspace=@texo/web; node scripts/restore-static-export.mjs
```

Para mobile en producción, configura `EXPO_PUBLIC_WEB_BASE_URL=https://<usuario>.github.io/Texo`.


```
apps/web/       → Next.js 15
apps/mobile/    → Expo Router
packages/shared → types, enums, queries
supabase/       → migraciones + seed
docs/           → documentación + contratos
scripts/        → seed-demo.mjs
```

## Deploy demo (Vercel)

1. Conectar repo en Vercel — **Root Directory:** `apps/web`
2. Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Aplicar migraciones Supabase — ver [docs/auth-deploy.md](./docs/auth-deploy.md)
4. Seed: `SUPABASE_SERVICE_ROLE_KEY=... npm run seed:demo`

## Documentación

| Audiencia | Enlace |
|-----------|--------|
| Agentes IA | [AGENTS.md](./AGENTS.md) |
| Deploy + auth | [docs/auth-deploy.md](./docs/auth-deploy.md) |
| Smoke test | [docs/integration-report.md](./docs/integration-report.md) |
| Índice | [docs/INDEX.md](./docs/INDEX.md) |

## Licencia

Pendiente.
