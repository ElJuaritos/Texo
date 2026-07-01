# Design Tokens — Contrato v1

Paridad visual entre **apps/web** (Tailwind CSS) y **apps/mobile** (NativeWind recomendado).

## Paleta

| Token | Hex | Tailwind | Uso |
|-------|-----|----------|-----|
| `primary` | `#0F766E` | `teal-700` | CTAs, links, acentos confianza |
| `primary-hover` | `#0D9488` | `teal-600` | Hover botones |
| `secondary` | `#1E293B` | `slate-800` | Headers, texto fuerte |
| `background` | `#F8FAFC` | `slate-50` | Fondo app |
| `surface` | `#FFFFFF` | `white` | Cards, modals |
| `border` | `#E2E8F0` | `slate-200` | Bordes, dividers |
| `text-muted` | `#64748B` | `slate-500` | Subtítulos, metadata |
| `success` | `#16A34A` | `green-600` | Score ≥ 75, estados positivos |
| `warning` | `#D97706` | `amber-600` | Score 60–74, pendientes |
| `error` | `#DC2626` | `red-600` | Score < 60, errores |
| `info` | `#2563EB` | `blue-600` | Info, badges neutros |

## Tipografía

| Token | Web (Tailwind) | Mobile (RN) | Uso |
|-------|----------------|-------------|-----|
| `font-sans` | `font-sans` (Inter/system) | `System` / Inter | Todo el UI |
| `text-xs` | `text-xs` (12px) | 12 | Labels, badges |
| `text-sm` | `text-sm` (14px) | 14 | Metadata, captions |
| `text-base` | `text-base` (16px) | 16 | Cuerpo |
| `text-lg` | `text-lg` (18px) | 18 | Subtítulos card |
| `text-xl` | `text-xl` (20px) | 20 | Títulos sección |
| `text-2xl` | `text-2xl` (24px) | 24 | Precio, score |
| `font-medium` | `font-medium` (500) | 500 | Énfasis |
| `font-semibold` | `font-semibold` (600) | 600 | Títulos |
| `font-bold` | `font-bold` (700) | 700 | Precio principal |

## Spacing y radius

| Token | Valor | Tailwind |
|-------|-------|----------|
| `space-1` | 4px | `p-1`, `gap-1` |
| `space-2` | 8px | `p-2`, `gap-2` |
| `space-3` | 12px | `p-3`, `gap-3` |
| `space-4` | 16px | `p-4`, `gap-4` |
| `space-6` | 24px | `p-6`, `gap-6` |
| `radius-sm` | 6px | `rounded-md` |
| `radius-md` | 8px | `rounded-lg` |
| `radius-lg` | 12px | `rounded-xl` |
| `radius-full` | 9999px | `rounded-full` |

## Componentes UI mínimos (paridad obligatoria)

### VehicleCard

Datos mostrados en **web y mobile** (mismo orden):
1. Foto principal (aspect 16:9)
2. `{year} {make} {model}` — `text-lg font-semibold`
3. `{mileage}` km · `{trim}` — `text-sm text-muted`
4. Precio `{listing_price}` MXN — `text-2xl font-bold`
5. Badge score inspección — `InspectionScore`
6. Badge estado — `StatusBadge` si aplica

### InspectionScore

- Formato: **`{score}/100`**
- Color:
  - ≥ 75: `success` (verde) + label "Certificado"
  - 60–74: `warning` (ámbar) + label "Revisar"
  - < 60: `error` (rojo) + label "No certificado"

### StatusBadge

Pill `rounded-full`, `text-xs`, padding horizontal `space-3`:

| Estado | Color fondo | Color texto |
|--------|-------------|-------------|
| `published` | green-100 | green-800 |
| `pending` | amber-100 | amber-800 |
| `offer_accepted` | blue-100 | blue-800 |
| `sold` / `closed` | slate-100 | slate-800 |
| `inspection_failed` | red-100 | red-800 |

## Mobile: NativeWind

**Decisión Orquestador v1:** usar **NativeWind v4** en mobile para mapear clases Tailwind equivalentes. Documentar en AGENT_SYNC si el agente Mobile elige StyleSheet puro (debe replicar tokens de esta tabla).

## Breakpoints (web)

Mobile-first:
- default: < 640px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

Grid inventario: 1 col → 2 (`sm`) → 3 (`lg`).
