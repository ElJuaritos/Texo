/** Design tokens v2 — dark morado, paridad con docs/contracts/design-tokens.md. */
export const colors = {
  background: "#0B0F19",
  surface: "#151B28",
  surfaceElevated: "#1E2638",
  border: "#2A3347",
  primary: "#7C3AED",
  primaryHover: "#8B5CF6",
  primaryMuted: "#2D1B69",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  success: "#22C55E",
  successBg: "rgba(34,197,94,0.1)",
  warning: "#F59E0B",
  warningBg: "rgba(245,158,11,0.1)",
  error: "#EF4444",
  errorBg: "rgba(239,68,68,0.1)",
  scoreBadgeBg: "rgba(124,58,237,0.2)",
  /** Aliases legacy — compatibilidad con componentes existentes */
  secondary: "#F8FAFC",
  text: "#F8FAFC",
  slateBg: "#1E2638",
  slateText: "#64748B",
  info: "#7C3AED",
  infoBg: "rgba(124,58,237,0.1)",
  infoText: "#7C3AED",
  successText: "#22C55E",
  warningText: "#F59E0B",
  errorText: "#EF4444",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screen: 20,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
} as const;

export const fontWeight = {
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

/** Sombra de card — iOS + Android elevation. */
export const cardShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 12,
  elevation: 8,
} as const;
