import { Suspense } from "react";
import { SellDocumentsPageContent } from "@/components/sell/SellDocumentsPageContent";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/** Subida de INE y factura al bucket privado. */
export default function SellDocumentsPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="Cargando…" />}>
      <SellDocumentsPageContent />
    </Suspense>
  );
}
