import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../lib/theme/tokens";

/** Tab bar principal — explorar y vender. */
export default function TabsLayout() {
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.secondary,
        headerRight: () => (
          <Pressable
            accessibilityLabel="Cerrar sesión"
            accessibilityRole="button"
            onPress={() => signOut()}
            style={{ marginRight: 16 }}
          >
            <Ionicons name="log-out-outline" color={colors.textMuted} size={22} />
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: "Vender",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
