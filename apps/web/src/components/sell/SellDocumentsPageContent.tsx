"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DocumentUploadForm } from "@/components/sell/DocumentUploadForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/** Paso 2 documentos — lee vehicleId en cliente (compatible con GitHub Pages). */
export function SellDocumentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId");

  useEffect(() => {
    if (!vehicleId) {
      router.replace("/sell");
    }
  }, [vehicleId, router]);

  if (!vehicleId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Redirigiendo…" />
      </div>
    );
  }

  return <DocumentUploadForm vehicleId={vehicleId} />;
}
