"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { STORAGE_BUCKETS } from "@texo/shared";
import type { DocumentType } from "@texo/shared";

interface DocumentUploadFormProps {
  vehicleId: string;
}

/** Carga INE y factura al bucket privado de documentos. */
export function DocumentUploadForm({ vehicleId }: DocumentUploadFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function uploadFile(file: File, docType: DocumentType) {
    const supabase = getTexoBrowserClient();
    const path = `${vehicleId}/${docType}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.transactionDocuments)
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { error: dbError } = await supabase.from("vehicle_documents").insert({
      vehicle_id: vehicleId,
      document_type: docType,
      storage_path: path,
    });

    if (dbError) throw dbError;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const ine = (form.elements.namedItem("ine") as HTMLInputElement).files?.[0];
    const invoice = (form.elements.namedItem("invoice") as HTMLInputElement)
      .files?.[0];

    if (!ine || !invoice) {
      setError("Sube INE y factura");
      setLoading(false);
      return;
    }

    try {
      await uploadFile(ine, "ine");
      await uploadFile(invoice, "invoice");

      const supabase = getTexoBrowserClient();
      await supabase
        .from("vehicles")
        .update({ status: "pending_inspection" })
        .eq("id", vehicleId);

      setSuccess(true);
      setTimeout(() => router.push("/sell"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir documentos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold text-slate-900">Documentos del vendedor</h1>
      <p className="text-sm text-slate-500">
        Sube INE y factura. Archivos privados — solo tú y admin pueden verlos.
      </p>

      <label className="block text-sm">
        <span className="mb-1 block font-medium">INE</span>
        <input name="ine" type="file" accept="image/*,.pdf" required className="w-full text-sm" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Factura</span>
        <input name="invoice" type="file" accept="image/*,.pdf" required className="w-full text-sm" />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Documentos guardados. Redirigiendo…</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-teal-700 px-6 py-2.5 font-medium text-white hover:bg-teal-600 disabled:opacity-50"
      >
        {loading ? "Subiendo…" : "Enviar documentos"}
      </button>
    </form>
  );
}
