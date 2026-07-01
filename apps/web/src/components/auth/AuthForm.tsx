"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import type { UserRole } from "@texo/shared";

interface AuthFormProps {
  mode: "login" | "register";
}

/** Formulario de login o registro con email + password. */
export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
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
          options: {
            data: { role, full_name: fullName },
          },
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }

      const { data: { user } } = await supabase.auth.getUser();
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
      if (userRole === "admin") router.push("/admin");
      else if (userRole === "seller") router.push("/sell");
      else router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-bold text-slate-900">
        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      </h1>

      {mode === "register" && (
        <>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Nombre completo</span>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Quiero</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="buyer">Comprar un auto</option>
              <option value="seller">Vender mi auto</option>
            </select>
          </label>
        </>
      )}

      <label className="block text-sm">
        <span className="mb-1 block font-medium">Correo</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Contraseña</span>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-teal-700 py-2.5 font-medium text-white hover:bg-teal-600 disabled:opacity-50"
      >
        {loading ? "Procesando…" : mode === "login" ? "Entrar" : "Registrarme"}
      </button>
    </form>
  );
}
