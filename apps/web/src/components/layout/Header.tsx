"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { useEffect, useState } from "react";
import type { UserRole } from "@texo/shared";

/** Barra de navegación principal. */
export function Header() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const supabase = getTexoBrowserClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setEmail(null);
        setRole(null);
        return;
      }
      setEmail(user.email ?? null);
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setRole(profile?.role ?? null);
    });
  }, []);

  async function handleLogout() {
    const supabase = getTexoBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-xl font-bold text-teal-700">
          Texo
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <Link href="/" className="text-slate-600 hover:text-teal-700">
            Explorar
          </Link>
          {(role === "seller" || role === "admin") && (
            <Link href="/sell" className="text-slate-600 hover:text-teal-700">
              Vender
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin" className="text-slate-600 hover:text-teal-700">
              Admin
            </Link>
          )}
          {email ? (
            <>
              <span className="hidden text-slate-400 sm:inline">{email}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-slate-600 hover:text-teal-700"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-teal-700">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-teal-700 px-3 py-1.5 text-white hover:bg-teal-600"
              >
                Registro
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
