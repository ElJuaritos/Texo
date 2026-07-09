# Auth y despliegue — checklist demo público

Checklist para configurar Supabase remoto antes de exponer el demo en URL pública.

## Supabase Dashboard → Authentication

### Site URL y redirects

| Entorno | Site URL | Redirect URLs adicionales |
|---------|----------|---------------------------|
| Producción demo | `https://<tu-proyecto>.vercel.app` | `https://<tu-proyecto>.vercel.app/**` |
| Local | `http://localhost:3000` | `http://localhost:3000/**`, `texo://**` |

### Email

- [ ] **Confirm email**: habilitar en producción (reduce spam y cuentas desechables)
- [ ] Plantilla de confirmación en español (opcional)

### Signup

- [ ] Evaluar desactivar registro público si el demo es solo para pitch (`Enable signup` off)
- [ ] Si signup activo: nunca confiar en `user_metadata.role` para admin (corregido en migración `20250705120000`)

## Creación de admin

**Nunca** crear admin vía registro público. Opciones:

1. `node scripts/seed-demo.mjs` con `SUPABASE_SERVICE_ROLE_KEY` — asigna rol admin en `profiles`
2. SQL manual en Dashboard con service role:

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = '<uuid-del-usuario>';
```

## Variables de entorno

### Vercel (solo cliente)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Local / CI seed (nunca en Vercel client)

```
SUPABASE_SERVICE_ROLE_KEY=
DEMO_SEED_PASSWORD=  # opcional, min 12 caracteres
```

## Seed demo

```bash
# Tras aplicar migraciones en remoto
export SUPABASE_SERVICE_ROLE_KEY=...
export NEXT_PUBLIC_SUPABASE_URL=...
node scripts/seed-demo.mjs
```

Guardar la contraseña generada en gestor de secretos — **no commitear**.

## Cuentas demo

Usar dominio `@texo.mx` del script seed. **No usar** contraseñas débiles ni publicar credenciales en el repositorio.

Rotar contraseñas si alguna credencial demo fue expuesta previamente.

## Migraciones requeridas

1. `20250630120000_initial_schema.sql`
2. `20250705120000_security_and_business_rules.sql` — RLS, storage, triggers

```bash
npx supabase db push
# o aplicar vía Supabase Dashboard SQL / MCP
```

## Post-deploy smoke test (15 min)

Ver [`docs/integration-report.md`](./integration-report.md) sección Smoke test.
