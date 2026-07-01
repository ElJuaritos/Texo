import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { UserRole } from "@texo/shared";
import { USER_ROLES } from "@texo/shared";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { useAuth } from "../../hooks/useAuth";
import { colors, fontSize, fontWeight, radius, spacing } from "../../lib/theme/tokens";

type AuthMode = "login" | "signup";

const ROLES: UserRole[] = ["buyer", "seller"];

/** Login y registro email+password — auth-flow v1. */
export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert("Error", "Completa email y contraseña");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
      } else {
        if (!fullName.trim()) {
          Alert.alert("Error", "Ingresa tu nombre");
          return;
        }
        await signUp(email.trim(), password, fullName.trim(), role);
        Alert.alert("Cuenta creada", "Ya puedes iniciar sesión.");
        setMode("login");
      }
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Intenta de nuevo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.badge}>Texo</Text>
          <Text style={styles.title}>
            {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
          </Text>
          <Text style={styles.subtitle}>
            Marketplace de autos seminuevos certificados
          </Text>

          {mode === "signup" ? (
            <TextField
              label="Nombre completo"
              onChangeText={setFullName}
              placeholder="Tu nombre"
              value={fullName}
            />
          ) : null}

          <TextField
            autoCapitalize="none"
            keyboardType="email-address"
            label="Email"
            onChangeText={setEmail}
            placeholder="tu@email.com"
            value={email}
          />
          <TextField
            label="Contraseña"
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            value={password}
          />

          {mode === "signup" ? (
            <View style={styles.roleGroup}>
              <Text style={styles.roleLabel}>Quiero</Text>
              <View style={styles.roleRow}>
                {ROLES.map((r) => (
                  <Pressable
                    key={r}
                    accessibilityRole="button"
                    onPress={() => setRole(r)}
                    style={[styles.roleChip, role === r && styles.roleChipActive]}
                  >
                    <Text
                      style={[styles.roleText, role === r && styles.roleTextActive]}
                    >
                      {USER_ROLES[r]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          <Button
            label={mode === "login" ? "Entrar" : "Registrarme"}
            loading={loading}
            onPress={handleSubmit}
          />

          <Pressable
            accessibilityRole="button"
            onPress={() => setMode(mode === "login" ? "signup" : "login")}
          >
            <Text style={styles.switch}>
              {mode === "login"
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    gap: spacing.lg,
    justifyContent: "center",
    padding: spacing.xl,
  },
  badge: {
    color: colors.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  roleGroup: {
    gap: spacing.sm,
  },
  roleLabel: {
    color: colors.secondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  roleRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  roleChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  roleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
  roleTextActive: {
    color: colors.surface,
  },
  switch: {
    color: colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    textAlign: "center",
  },
});
