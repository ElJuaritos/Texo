import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Texo — Marketplace de autos seminuevos",
  description: "Marketplace intermediado de vehículos seminuevos en México",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
