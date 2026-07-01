import { Redirect } from "expo-router";

/** Redirige raíz al tab explorar — AuthGate maneja login. */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
