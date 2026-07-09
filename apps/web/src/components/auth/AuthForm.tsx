"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import type { UserRole } from "@texo/shared";
import {
  getHomeRouteForRole,
  mapAuthError,
  sanitizeRedirect,
} from "@/lib/auth-errors";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TexoLogo } from "@/components/ui/TexoLogo";
import { cn } from "@/lib/cn";

interface AuthFormProps {
  mode: "login" | "register";
}

const TRUST_BADGES = [
  "Inspección verificada",
  "Escrow seguro",
  "Sin chat directo",
];

/** Formulario de login o registro con diseño dark morado. */
export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = sanitizeRedirect(searchParams.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = getTexoBrowserClient();

    try {
      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { role, full_name: fullName } },
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        router.refresh();
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const userRole = profile?.role ?? "buyer";
      const destination =
        redirectParam ?? getHomeRouteForRole(userRole);
      router.push(destination);
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de autenticación";
      setError(mapAuthError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-72 glow-purple" />

      <div className="relative flex flex-col items-center space-y-6">
        <TexoLogo size="lg" />

        <p className="max-w-xs text-center text-sm leading-relaxed text-texo-text-secondary">
          Compra y vende tu auto con total confianza
        </p>

        <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4">
          {TRUST_BADGES.map((badge) => (
            <span key={badge} className="text-xs text-texo-text-secondary">
              <span className="text-texo-primary">✓</span> {badge}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          {mode === "register" && (
            <>
              <Input
                label="Nombre completo"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <div className="space-y-2">
                <span className="block text-sm font-medium text-texo-text-secondary">
                  Quiero
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {(["buyer", "seller"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={cn(
                        "rounded-xl border p-3 text-left text-sm transition",
                        role === r
                          ? "border-texo-primary bg-texo-primary/10 text-texo-text-primary"
                          : "border-texo-border bg-texo-surface text-texo-text-secondary",
                      )}
                    >
                      <span className="font-semibold">
                        {r === "buyer" ? "Comprar" : "Vender"}
                      </span>
                      <p className="mt-0.5 text-xs text-texo-text-muted">
                        {r === "buyer"
                          ? "Busco un auto certificado"
                          : "Quiero publicar mi auto"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Input
            label="Correo"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-texo-error">{error}</p>}

          <div className="space-y-3 pt-1">
            <Button type="submit" fullWidth disabled={loading} className="py-3">
              {loading
                ? "Procesando…"
                : mode === "login"
                  ? "Iniciar sesión"
                  : "Crear cuenta"}
            </Button>

            <Link href={mode === "login" ? "/register" : "/login"} className="block">
              <Button variant="secondary" fullWidth className="py-3">
                {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
              </Button>
            </Link>
          </div>
        </form>

        <p className="max-w-xs text-center text-xs leading-relaxed text-texo-text-muted">
          Al continuar aceptas los{" "}
          <Link href="/terms" className="text-texo-primary underline">
            Términos y Condiciones
          </Link>{" "}
          de Texo
        </p>
      </div>
    </div>
  );
}
