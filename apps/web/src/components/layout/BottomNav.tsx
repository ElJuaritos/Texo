"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { UserRole } from "@texo/shared";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  match?: (path: string) => boolean;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Inicio",
    match: (p) => p === "/",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Buscar",
    match: (p) => p === "/search",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    href: "/sell",
    label: "Vender",
    match: (p) => p.startsWith("/sell"),
    roles: ["seller", "admin"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Perfil",
    match: (p) => p === "/profile" || p === "/login",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

/** Navegación inferior mobile. */
export function BottomNav() {
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole | null>(null);

  const hideNav =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/admin");

  useEffect(() => {
    const supabase = getTexoBrowserClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setRole(null);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      setRole(profile?.role ?? null);
    });
  }, [pathname]);

  if (hideNav) return null;

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || (role && item.roles.includes(role)),
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-texo-border bg-texo-background pb-safe md:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {visibleItems.map((item) => {
          const active = item.match ? item.match(pathname) : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition",
                active ? "text-texo-primary" : "text-texo-text-muted",
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
