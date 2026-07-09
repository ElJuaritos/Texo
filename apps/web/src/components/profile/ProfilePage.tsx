"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Offer, UserRole } from "@texo/shared";
import { OFFER_STATUSES } from "@texo/shared";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { formatPriceMxn } from "@/lib/format";
import { cn } from "@/lib/cn";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ProfileData {
  email: string;
  fullName: string;
  role: UserRole;
  pendingOffers: number;
}

const MENU_ITEMS = [
  {
    href: "#offers",
    label: "Mis ofertas",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    showBadge: true,
  },
  {
    href: "/terms",
    label: "Términos legales",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

/** Pantalla de perfil del usuario con ofertas y logout. */
export function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getTexoBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=/profile");
        return;
      }

      const { data: p } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      const { data: userOffers } = await supabase
        .from("offers")
        .select("*")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      setOffers((userOffers ?? []) as Offer[]);
      setProfile({
        email: user.email ?? "",
        fullName: p?.full_name ?? user.email?.split("@")[0] ?? "Usuario",
        role: p?.role ?? "buyer",
        pendingOffers: userOffers?.length ?? 0,
      });
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleLogout() {
    const supabase = getTexoBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-texo-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) return null;

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-texo-primary text-xl font-bold text-white">
          {initials}
        </div>
        <div>
          <h1 className="text-lg font-semibold text-texo-text-primary">
            {profile.fullName}
          </h1>
          <p className="flex items-center gap-1 text-sm text-texo-success">
            ✓ Verificado
          </p>
          <p className="text-sm text-texo-text-secondary">{profile.email}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-texo-border bg-texo-surface">
        {MENU_ITEMS.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-4 py-4 transition hover:bg-texo-surface-elevated",
              i > 0 && "border-t border-texo-border",
            )}
          >
            <span className="flex items-center gap-3 text-sm text-texo-text-primary">
              <span className="text-texo-text-secondary">{item.icon}</span>
              {item.label}
              {item.showBadge && profile.pendingOffers > 0 && (
                <span className="rounded-full bg-texo-primary px-2 py-0.5 text-xs font-medium text-white">
                  {profile.pendingOffers}
                </span>
              )}
            </span>
            <svg
              className="h-4 w-4 text-texo-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {offers.length > 0 && (
        <section className="space-y-3" id="offers">
          <h2 className="text-lg font-semibold text-texo-text-primary">Mis ofertas</h2>
          <ul className="divide-y divide-texo-border overflow-hidden rounded-2xl border border-texo-border bg-texo-surface">
            {offers.map((offer) => (
              <li key={offer.id} className="flex items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="font-medium text-texo-text-primary">
                    {formatPriceMxn(offer.amount)}
                  </p>
                  <p className="text-xs text-texo-text-muted">
                    {OFFER_STATUSES[offer.status]}
                  </p>
                </div>
                <StatusBadge status={offer.status} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {profile.role === "admin" && (
        <Link
          href="/admin"
          className="flex items-center justify-between rounded-2xl border border-texo-primary/30 bg-texo-primary-muted px-4 py-4 transition hover:border-texo-primary/50"
        >
          <span className="text-sm text-texo-text-primary">Panel de administración</span>
          <span className="rounded-full bg-texo-primary px-2 py-0.5 text-xs font-medium text-white">
            Staff
          </span>
        </Link>
      )}

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-2xl border border-texo-border bg-texo-surface px-4 py-4 text-sm text-texo-error transition hover:bg-texo-surface-elevated"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Cerrar sesión
      </button>
    </div>
  );
}
