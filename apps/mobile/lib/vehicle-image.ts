/** Resuelve URL absoluta de imagen de vehículo para React Native. */
export function getVehicleImageUrl(
  coverImageUrl: string | null | undefined,
): string | null {
  if (!coverImageUrl) return null;

  if (coverImageUrl.startsWith("http://") || coverImageUrl.startsWith("https://")) {
    return coverImageUrl;
  }

  const base =
    process.env.EXPO_PUBLIC_WEB_BASE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const path = coverImageUrl.startsWith("/") ? coverImageUrl : `/${coverImageUrl}`;

  return `${base}${path}`;
}
