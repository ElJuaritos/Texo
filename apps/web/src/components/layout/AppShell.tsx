"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/cn";

/** Shell principal con header desktop y bottom nav mobile. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      <Header />
      <main
        className={cn(
          "mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-4 md:px-6 md:pb-8 md:pt-8",
          isAuthPage &&
            "flex min-h-screen max-w-none items-center justify-center px-4 py-8 pb-8 pt-8",
          isAdminPage && "max-w-none px-0 pb-0 pt-0 md:px-0",
        )}
      >
        <div
          className={cn(
            "page-enter w-full",
            isAuthPage && "mx-auto w-full max-w-sm",
            isAdminPage && "max-w-none",
          )}
        >
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
