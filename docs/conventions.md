# Convenciones

## Idioma

- **UI y documentación:** español (México).
- **Código:** inglés — variables, funciones, tipos, commits, nombres de archivos técnicos.

## Archivos y tamaño

- Máximo **500 líneas** por archivo.
- Un componente principal por archivo `.tsx`.
- Subcarpeta con `index.tsx` cuando crece (ej. `components/vehicles/VehicleCard/`).

## Naming

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Componentes | PascalCase | `VehicleCard.tsx` |
| Hooks | `use` + PascalCase archivo | `useOffers.ts` |
| Utilidades | camelCase archivo | `formatPrice.ts`, `vehicle.utils.ts` |
| Constantes | UPPER_SNAKE | `MIN_INSPECTION_SCORE` |
| Rutas App Router | kebab-case carpetas | `app/sell/documents/` |
| Migraciones SQL | timestamp + snake | `20250630120000_create_vehicles.sql` |
| Tipos dominio | PascalCase | `VehicleStatus`, `OfferPayload` |

## Componentes React

- Funcionales + hooks; sin class components.
- **Separar fetch de render** — datos en hooks o `lib/`, JSX solo presentación.
- Props tipadas con `interface`; **evitar `any`**.
- JSDoc breve en español en exports públicos.
- Tailwind mobile-first (`base` → `sm:` → `md:` → `lg:`).

```tsx
/** Tarjeta de vehículo en el listado del marketplace. */
export function VehicleCard({ vehicle }: VehicleCardProps) { ... }
```

## Supabase

- Cliente en `apps/*/lib/supabase/`; tipos y queries en `@texo/shared`.
- `packages/shared/src/types/database.ts` generado — no editar a mano.
- RLS en toda tabla expuesta al cliente.

## Git

- Commits imperativos en **inglés**: `add sell valuation page`, `fix vehicle rls policy`.
- PRs pequeños, un dominio por PR cuando sea posible.
- No commitear `.env*`, keys, ni archivos generados locales sensibles.

## Accesibilidad

- `<label>` en inputs; `aria-label` si solo hay icono.
- Focus visible; contraste mínimo WCAG AA en texto interactivo.

## Scope

- Cambios mínimos al pedido; no refactor fuera de scope.
- Features post-demo: documentar, no implementar hasta fondeo.
