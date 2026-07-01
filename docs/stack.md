# Stack tecnológico

Versiones objetivo para el demo. Actualizar al hacer scaffold con versiones exactas del lockfile.

## Runtime y lenguaje

| Herramienta | Versión objetivo |
|-------------|------------------|
| Node.js | 20+ LTS |
| TypeScript | 5.x (strict) |
| npm | 10+ |

## Frontend

| Paquete | Versión objetivo | App |
|---------|------------------|-----|
| next | 15.x | web |
| react / react-dom | 19.x | web |
| expo | ~53.x | mobile |
| expo-router | ~5.x | mobile |
| tailwindcss | 3.x | web |
| nativewind | 4.x (recomendado) | mobile |
| @supabase/supabase-js | 2.x | shared |
| @supabase/ssr | 0.x | web |
| @texo/shared | workspace | web + mobile |

## Monorepo

| Herramienta | Uso |
|-------------|-----|
| npm workspaces | apps/* + packages/* |
| Turborepo | dev/build paralelo |
| TypeScript 5.x | strict, shared tsconfig.base |

## Backend (Supabase)

| Servicio | Uso en Texo |
|----------|-------------|
| Auth | Email + password (demo); magic link opcional |
| Postgres | Schema demo — ver database.md |
| Storage | Fotos públicas + docs privados por transacción |
| Edge Functions | Post-demo (webhooks escrow, notificaciones) |
| Realtime | Futuro (chat negociación) |

## Herramientas y deploy

| Herramienta | Uso |
|-------------|-----|
| Supabase CLI | Migraciones, types, emulación local |
| Vercel | Deploy demo y previews por PR |
| Cursor | `.cursor/rules/` + AGENTS.md |

## Variables de entorno

Ver `.env.example` en la raíz. Solo claves **públicas** en prefijo `NEXT_PUBLIC_`.

La **service role key** solo en Edge Functions / CI — nunca en cliente ni env públicas de Vercel.

## Integraciones pendientes post-fondeo

| Proveedor | Dominio | Propósito |
|-----------|---------|-----------|
| Conekta / STP | Pagos | Escrow CNBV-compliant |
| Mifiel / Firel | Legal | Firma digital con validez |
| Metamap / Truora | KYC | Verificación identidad automatizada |
| FCM / OneSignal | Notificaciones | Push ofertas, citas, cierre |

No implementar ni añadir SDKs de estos proveedores hasta fondeo y decisión legal.

## Comandos de referencia

```bash
# Next.js (tras scaffold)
npm install
npm run dev
npm run build
npm run lint

# Supabase (tras supabase init)
npx supabase start
npx supabase migration new <descripcion>
npx supabase db push
npx supabase gen types typescript --local > src/types/database.ts
```

## Deploy demo (Vercel)

1. Conectar repo GitHub `ElJuaritos/Texo`.
2. Framework preset: Next.js.
3. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Preview deployments en cada PR.
