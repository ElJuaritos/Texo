import { Stack } from "expo-router";

/** Stack de pantallas de autenticación. */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
