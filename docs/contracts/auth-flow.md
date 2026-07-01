# Auth Flow — Contrato v1

Autenticación Supabase compartida entre web y mobile.

## Método MVP demo

**Email + password** (principal).

| Método | Demo | Producción futura |
|--------|------|-------------------|
| Email + password | ✅ | ✅ |
| Magic link | ❌ | Opcional (mejor UX) |
| OAuth (Google/Apple) | ❌ | Horizonte 2 |

## Roles

Almacenados en `profiles.role`:

| Rol | Valor DB | Descripción |
|-----|----------|-------------|
| Vendedor | `seller` | Publica y vende vehículos |
| Comprador | `buyer` | Explora, oferta, prueba de manejo |
| Admin | `admin` | Panel moderación y transacciones |

Un usuario tiene **un rol** en demo. Multi-rol post-MVP.

## Registro

1. Formulario: email, password, full_name, phone (opcional), **role** (seller \| buyer).
2. Supabase Auth `signUp`.
3. Trigger DB crea fila en `profiles` con rol elegido.
4. Admin se crea manualmente (seed) — no registro público.

## Login

1. Email + password → `signInWithPassword`.
2. Leer `profiles.role` del usuario autenticado.
3. Redirect según rol (ver tabla abajo).

## Routing post-login

### Web (Next.js)

| Rol | Redirect | Pantallas principales |
|-----|----------|----------------------|
| `buyer` | `/` | Inventario, ficha, ofertas |
| `seller` | `/sell` | Valuación, documentos, mis autos |
| `admin` | `/admin` | Panel transacciones |

Rutas protegidas: middleware verifica sesión + rol para `/sell/*`, `/admin`.

### Mobile (Expo Router)

| Rol | Redirect | Pantallas |
|-----|----------|-----------|
| `buyer` | `(tabs)/index` | Explorar |
| `seller` | `(tabs)/sell` | Vender |
| `admin` | `admin/index` | Panel (stack) |

## Sesión compartida

- **Web:** `@supabase/ssr` + cookies HTTP.
- **Mobile:** `@supabase/supabase-js` + `expo-secure-store` para refresh token.
- Factory común: `createTexoSupabaseClient` en `@texo/shared`.

## Env vars

| Plataforma | URL | Anon key |
|------------|-----|----------|
| Web | `NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Mobile | `EXPO_PUBLIC_SUPABASE_URL` | `EXPO_PUBLIC_SUPABASE_ANON_KEY` |

## Logout

`signOut` + clear storage + redirect a `/login` (web) o `/(auth)/login` (mobile).

## Fuera de demo

- Verificación ID automatizada (Metamap/Truora).
- 2FA.
- Session refresh UI unificada cross-device.
