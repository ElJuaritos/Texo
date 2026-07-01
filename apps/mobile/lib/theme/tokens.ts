/** Design tokens v1 — mapeo de docs/contracts/design-tokens.md para StyleSheet. */
export const colors = {
  primary: "#0F766E",
  primaryHover: "#0D9488",
  secondary: "#1E293B",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  textMuted: "#64748B",
  success: "#16A34A",
  successBg: "#DCFCE7",
  successText: "#166534",
  warning: "#D97706",
  warningBg: "#FEF3C7",
  warningText: "#92400E",
  error: "#DC2626",
  errorBg: "#FEE2E2",
  errorText: "#991B1B",
  info: "#2563EB",
  infoBg: "#DBEAFE",
  infoText: "#1E40AF",
  slateBg: "#F1F5F9",
  slateText: "#334155",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
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
