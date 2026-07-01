/** Config Expo con env vars Supabase para Expo Go. */
export default {
  expo: {
    name: "Texo",
    slug: "texo",
    version: "1.0.0",
    orientation: "portrait",
    scheme: "texo",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "mx.texo.app",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#0F766E",
      },
      package: "mx.texo.app",
    },
    plugins: ["expo-router", "expo-secure-store"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
