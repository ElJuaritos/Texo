/** Mensajes de auth en español — mapeo de errores Supabase. */
export function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "Credenciales incorrectas. Verifica tu correo y contraseña.";
  }
  if (lower.includes("user already registered")) {
    return "Este correo ya está registrado. Inicia sesión.";
  }
  if (lower.includes("password")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  if (lower.includes("email")) {
    return "Ingresa un correo válido.";
  }
  return "No pudimos completar la operación. Intenta de nuevo.";
}

/** Rutas internas permitidas para redirect post-login. */
export function sanitizeRedirect(path: string | null): string | null {
  if (!path || !path.startsWith("/")) return null;
  if (path.startsWith("//")) return null;
  if (path.startsWith("/login") || path.startsWith("/register")) return null;
  return path;
}

/** Redirige según rol tras autenticación. */
export function getHomeRouteForRole(role: string): string {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/sell";
  return "/";
}
