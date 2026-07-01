import { redirect } from "next/navigation";
import { DocumentUploadForm } from "@/components/sell/DocumentUploadForm";

interface DocumentsPageProps {
  searchParams: Promise<{ vehicleId?: string }>;
}

/** Subida de INE y factura al bucket privado. */
export default async function SellDocumentsPage({ searchParams }: DocumentsPageProps) {
  const { vehicleId } = await searchParams;

  if (!vehicleId) {
    redirect("/sell");
  }

  return <DocumentUploadForm vehicleId={vehicleId} />;
}
