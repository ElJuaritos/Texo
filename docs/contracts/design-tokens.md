# Design Tokens — Contrato v2 (Dark Morado)

Paridad visual entre **apps/web** (Tailwind CSS) y **apps/mobile** (NativeWind recomendado).

## Paleta

| Token | Hex | Tailwind | Uso |
|-------|-----|----------|-----|
| `background` | `#0B0F19` | `texo-background` | Fondo global |
| `surface` | `#151B28` | `texo-surface` | Cards, inputs, modals |
| `surface-elevated` | `#1E2638` | `texo-surface-elevated` | Hover, sheets, dropdowns |
| `border` | `#2A3347` | `texo-border` | Bordes, dividers |
| `primary` | `#7C3AED` | `texo-primary` | CTAs, iconos activos |
| `primary-hover` | `#8B5CF6` | `texo-primary-hover` | Hover botones |
| `primary-muted` | `#2D1B69` | `texo-primary-muted` | Banners info |
| `text-primary` | `#F8FAFC` | `texo-text-primary` | Títulos, precios |
| `text-secondary` | `#94A3B8` | `texo-text-secondary` | Metadata |
| `text-muted` | `#64748B` | `texo-text-muted` | Placeholders |
| `success` | `#22C55E` | `texo-success` | Score ≥ 75, checks |
| `warning` | `#F59E0B` | `texo-warning` | Pendiente, score 60–74 |
| `error` | `#EF4444` | `texo-error` | Errores, rechazado |
| `score-badge-bg` | `rgba(124,58,237,0.2)` | — | Badge score con borde `#7C3AED` |

## Tipografía

| Token | Web (Tailwind) | Uso |
|-------|----------------|-----|
| `font-sans` | Inter (Google Fonts) | Todo el UI |
| `text-xs` | `text-xs` (12px) | Labels, badges |
| `text-sm` | `text-sm` (14px) | Metadata |
| `text-base` | `text-base` (16px) | Cuerpo |
| `text-lg` | `text-lg` (18px) | Subtítulos card |
| `text-xl` | `text-xl` (20px) | Títulos sección |
| `text-2xl` | `text-2xl` (24px) | Precio, score |
| `font-semibold` | 600 | Títulos |
| `font-bold` | 700 | Precio principal |

## Radius y sombras

| Token | Valor | Tailwind |
|-------|-------|----------|
| `radius-xl` | 12px | `rounded-xl` |
| `radius-2xl` | 16px | `rounded-2xl` |
| `radius-full` | 9999px | `rounded-full` |
| `shadow-card` | `0 4px 24px rgba(0,0,0,0.4)` | `shadow-texo-card` |

## Componentes UI mínimos

### VehicleCard

1. Foto principal (aspect 4/3)
2. Badge "CERTIFICADO TEXO" sobre imagen
3. Score `{score}/100` sobre imagen (verde ≥75)
4. `{year} {make} {model}` — truncado
5. `{mileage}` km — metadata
6. Precio `{listing_price}` MXN — bold primary color

### InspectionScore

- Formato: **`{score}/100`**
- ≥ 75: `success` + "Certificado"
- 60–74: `warning` + "Revisar"
- < 60: `error` + "No certificado"

### StatusBadge (dark)

Pill `rounded-full`, `text-xs`:

| Estado | Fondo | Texto |
|--------|-------|-------|
| `published` / `accepted` | success/10 | success |
| `pending` | warning/10 | warning |
| `offer_accepted` | primary/10 | primary |
| `sold` / `closed` | border/50 | secondary |
| `inspection_failed` / `rejected` | error/10 | error |

## Breakpoints (web)

Mobile-first: default → `sm` 640px → `md` 768px → `lg` 1024px.

Grid inventario: 2 cols mobile → 3 (`md`) → 4 (`lg`).
