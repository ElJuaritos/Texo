import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  AuthProvider,
  getHomeRouteForRole,
  useAuth,
} from "../hooks/useAuth";
import { LoadingState } from "../components/ui/LoadingState";
import { colors, fontSize, spacing } from "../lib/theme/tokens";

/** Rutas accesibles sin sesión — paridad con browse público web. */
function isPublicRoute(segments: string[]): boolean {
  if (segments[0] === "vehicle") return true;
  if (segments[0] === "(tabs)" && (!segments[1] || segments[1] === "index")) {
    return true;
  }
  return false;
}

/** Redirige según sesión y rol — auth-flow v1. */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, profile, isLoading, client } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === "(auth)";
    const isPublic = isPublicRoute(segments);

    if (!session && !inAuth && !isPublic) {
      router.replace("/(auth)/login");
      return;
    }

    if (session && inAuth && profile) {
      router.replace(getHomeRouteForRole(profile.role));
    }
  }, [session, profile, isLoading, segments, router]);

  if (!client) {
    return (
      <View style={styles.configError}>
        <Text style={styles.configTitle}>Supabase no configurado</Text>
        <Text style={styles.configText}>
          Crea apps/mobile/.env con EXPO_PUBLIC_SUPABASE_URL y
          EXPO_PUBLIC_SUPABASE_ANON_KEY
        </Text>
      </View>
    );
  }

  if (isLoading) return <LoadingState message="Iniciando sesión…" />;

  return <>{children}</>;
}

/** Layout raíz con auth y navegación stack. */
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="vehicle/[id]" options={{ headerShown: true, title: "Detalle" }} />
          <Stack.Screen name="sell/documents" options={{ headerShown: true, title: "Documentos" }} />
          <Stack.Screen name="admin" />
        </Stack>
        <StatusBar style="dark" />
      </AuthGate>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  configError: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: spacing.xl,
  },
  configTitle: {
    color: colors.error,
    fontSize: fontSize.lg,
    fontWeight: "600",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  configText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 20,
    textAlign: "center",
  },
});
