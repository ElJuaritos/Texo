"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { label: "Ofertas", section: "offers" },
  { label: "Inspección", section: "inspection" },
  { label: "Transacciones", section: "transactions" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

/** Layout admin con sidebar desktop y tabs mobile. */
export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <nav className="sticky top-0 z-20 flex gap-1 overflow-x-auto border-b border-texo-border bg-texo-background px-2 py-2 md:hidden">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.section}
            href={`#${item.section}`}
            className="shrink-0 rounded-full border border-texo-border px-4 py-2 text-xs font-medium text-texo-text-secondary"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <aside className="hidden w-64 shrink-0 border-r border-texo-border bg-texo-surface md:block">
        <div className="border-b border-texo-border px-6 py-5">
          <Link href="/" className="text-lg font-bold text-texo-text-primary">
            TEXO
          </Link>
          <p className="mt-1 text-xs text-texo-text-muted">Panel Admin</p>
        </div>
        <nav className="space-y-1 p-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.section}
              href={`#${item.section}`}
              className={cn(
                "block rounded-lg px-4 py-2.5 text-sm font-medium text-texo-text-secondary transition hover:bg-texo-surface-elevated hover:text-texo-text-primary",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1 bg-texo-background p-4 md:p-6">{children}</div>
    </div>
  );
}
