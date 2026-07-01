import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

/** Stack admin con guard de rol. */
export default function AdminLayout() {
  const { profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (profile && profile.role !== "admin") {
      router.replace("/(tabs)");
    }
  }, [profile, isLoading, router]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Panel Admin" }}
      />
    </Stack>
  );
}
