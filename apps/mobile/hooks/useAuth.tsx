import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import type { Profile, TexoSupabaseClient, UserRole } from "@texo/shared";
import { getSupabaseMobileClient } from "../lib/supabase/client";

interface AuthContextValue {
  client: TexoSupabaseClient | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Carga perfil del usuario autenticado desde profiles. */
async function fetchProfile(
  client: TexoSupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    id: data.id,
    role: data.role,
    full_name: data.full_name,
    phone: data.phone,
    created_at: data.created_at,
  };
}

/** Proveedor de sesión Supabase y perfil para toda la app. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => getSupabaseMobileClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!client || !session?.user.id) {
      setProfile(null);
      return;
    }
    const next = await fetchProfile(client, session.user.id);
    setProfile(next);
  }, [client, session?.user.id]);

  useEffect(() => {
    if (!client) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    client.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: subscription } = client.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setIsLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [client]);

  useEffect(() => {
    if (!client || !session?.user.id) {
      setProfile(null);
      return;
    }
    fetchProfile(client, session.user.id).then(setProfile);
  }, [client, session?.user.id]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!client) throw new Error("Supabase no configurado");
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    [client],
  );

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      role: UserRole,
    ) => {
      if (!client) throw new Error("Supabase no configurado");
      const { error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { role, full_name: fullName },
        },
      });
      if (error) throw error;
    },
    [client],
  );

  const signOut = useCallback(async () => {
    if (!client) return;
    await client.auth.signOut();
    setProfile(null);
  }, [client]);

  const value = useMemo(
    () => ({
      client,
      session,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [client, session, profile, isLoading, signIn, signUp, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Hook de acceso a sesión, perfil y cliente Supabase. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

/** Ruta inicial según rol tras login — auth-flow v1. */
export function getHomeRouteForRole(
  role: UserRole,
): "/admin" | "/(tabs)/sell" | "/(tabs)" {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/(tabs)/sell";
  return "/(tabs)";
}
