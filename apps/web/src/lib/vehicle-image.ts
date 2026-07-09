/** Resuelve URL de imagen de vehículo con fallback local. */
export function getVehicleImageUrl(
  coverImageUrl: string | null | undefined,
): string | null {
  if (!coverImageUrl) return null;
  if (coverImageUrl.startsWith("http") || coverImageUrl.startsWith("/")) {
    return coverImageUrl;
  }
  return `/${coverImageUrl}`;
}
