# @texo/mobile

Expo Router + TypeScript — app móvil Texo.

## Dev

```bash
cp .env.example .env   # configurar EXPO_PUBLIC_SUPABASE_*
npm run dev:mobile
```

Escanea el QR con Expo Go (iOS/Android).

## Stack

- Expo SDK 53 · Expo Router 5
- Supabase vía `@texo/shared` + SecureStore
- **StyleSheet** con tokens en `lib/theme/tokens.ts` (paridad design-tokens v1)

## Rutas demo

| Ruta | Pantalla |
|------|----------|
| `(tabs)/index` | Inventario comprador |
| `(tabs)/sell` | Valuación vendedor |
| `vehicle/[id]` | Ficha + inspección + oferta |
| `sell/documents` | Upload INE/factura |
| `admin/index` | Panel transacciones |
| `(auth)/login` | Login/registro |

Ver tabla paridad en `docs/AGENT_SYNC.md`.
