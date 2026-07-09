"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { UserRole } from "@texo/shared";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/** Barra de navegación desktop — oculta en mobile. */
export function Header() {
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const hideHeader =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/admin");

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
  }, [pathname]);

  async function handleLogout() {
    const supabase = getTexoBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (hideHeader) return null;

  return (
    <header className="hidden border-b border-texo-border bg-texo-background md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-texo-text-primary">TEXO</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link
            href="/"
            className={cn(
              "transition hover:text-texo-primary",
              pathname === "/" ? "text-texo-primary" : "text-texo-text-secondary",
            )}
          >
            Explorar
          </Link>
          {(role === "seller" || role === "admin") && (
            <Link
              href="/sell"
              className={cn(
                "transition hover:text-texo-primary",
                pathname.startsWith("/sell")
                  ? "text-texo-primary"
                  : "text-texo-text-secondary",
              )}
            >
              Vender
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin"
              className={cn(
                "transition hover:text-texo-primary",
                pathname.startsWith("/admin")
                  ? "text-texo-primary"
                  : "text-texo-text-secondary",
              )}
            >
              Admin
            </Link>
          )}
          {email ? (
            <>
              <Link
                href="/profile"
                className={cn(
                  "transition hover:text-texo-primary",
                  pathname === "/profile"
                    ? "text-texo-primary"
                    : "text-texo-text-secondary",
                )}
              >
                Perfil
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-texo-text-secondary transition hover:text-texo-primary"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" className="px-5 py-2 text-sm">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button className="px-5 py-2 text-sm">Crear cuenta</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
