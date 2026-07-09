import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  AuthProvider,
  getHomeRouteForRole,
  useAuth,
} from "../hooks/useAuth";
import { LoadingState } from "../components/ui/LoadingState";
import { colors, fontSize, spacing } from "../lib/theme/tokens";

/** Rutas accesibles sin sesión — paridad con browse público web. */
function isPublicRoute(segments: string[]): boolean {
  if (segments.length === 0) return true;
  if (segments[0] === "index") return true;
  if (segments[0] === "vehicle") return true;
  if (segments[0] === "(tabs)") {
    return !segments[1] || segments[1] === "index";
  }
  return false;
}

/** Redirige según sesión y rol — auth-flow v1. */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, profile, isLoading, client } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !client) return;

    const inAuth = segments[0] === "(auth)";
    const isPublic = isPublicRoute(segments);

    if (!session && !inAuth && !isPublic) {
      router.replace("/(auth)/login");
      return;
    }

    if (session && inAuth && profile) {
      router.replace(getHomeRouteForRole(profile.role));
    }
  }, [session, profile, isLoading, segments, router, client]);

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

  return (
    <View style={styles.root}>
      {children}
      {isLoading ? (
        <View style={styles.loadingOverlay}>
          <LoadingState message="Iniciando sesión…" />
        </View>
      ) : null}
    </View>
  );
}

/** Layout raíz con auth y navegación stack. */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AuthGate>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="vehicle/[id]"
              options={{
                headerShown: true,
                title: "Detalle",
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.textPrimary,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="sell/documents"
              options={{
                headerShown: true,
                title: "Documentos",
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.textPrimary,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen name="admin" />
          </Stack>
          <StatusBar style="light" />
        </AuthGate>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
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
