"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { STORAGE_BUCKETS } from "@texo/shared";
import type { DocumentType } from "@texo/shared";
import { Button } from "@/components/ui/Button";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { SellStepper } from "@/components/sell/SellStepper";
import { cn } from "@/lib/cn";

interface DocumentUploadFormProps {
  vehicleId: string;
}

interface UploadZoneProps {
  label: string;
  name: string;
  uploaded?: string;
  onFile: (file: File) => void;
}

/** Icono check o reloj para checklist de confirmación. */
function StepIcon({ done }: { done: boolean }) {
  if (done) {
    return (
      <svg className="h-5 w-5 shrink-0 text-texo-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 shrink-0 text-texo-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

/** Zona de upload con borde dashed morado. */
function UploadZone({ label, name, uploaded, onFile }: UploadZoneProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 transition",
        uploaded
          ? "border-texo-success bg-texo-success/5"
          : "border-texo-primary/50 bg-texo-surface hover:border-texo-primary",
      )}
    >
      {uploaded ? (
        <>
          <svg className="h-8 w-8 text-texo-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium text-texo-success">{uploaded}</span>
        </>
      ) : (
        <>
          <svg
            className="h-8 w-8 text-texo-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-sm font-medium text-texo-text-primary">{label}</span>
          <span className="text-xs text-texo-text-muted">PDF o JPG · máx. 10 MB</span>
        </>
      )}
      <input
        name={name}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />
    </label>
  );
}

/** Paso 2 — upload INE y factura. Paso 3 — confirmación tras envío. */
export function DocumentUploadForm({ vehicleId }: DocumentUploadFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [ineFile, setIneFile] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!ineFile || !invoiceFile) {
      setError("Sube INE y factura");
      setLoading(false);
      return;
    }

    try {
      await uploadFile(ineFile, "ine");
      await uploadFile(invoiceFile, "invoice");

      const supabase = getTexoBrowserClient();
      await supabase
        .from("vehicles")
        .update({ status: "pending_inspection" })
        .eq("id", vehicleId);

      setConfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir documentos");
    } finally {
      setLoading(false);
    }
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-xl font-bold text-texo-text-primary">Publicar mi auto</h1>
        </div>
        <SellStepper currentStep={3} />

        <div className="rounded-xl border border-texo-warning/30 bg-texo-warning/10 p-4">
          <p className="font-semibold text-texo-warning">Esperando inspección</p>
          <p className="mt-1 text-sm text-texo-text-secondary">
            Texo coordinará la inspección de tu vehículo en los próximos 3–5 días hábiles.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-texo-border bg-texo-surface p-4">
          {[
            { done: true, label: "Datos del vehículo recibidos" },
            { done: true, label: "Documentos enviados" },
            { done: false, label: "Inspección programada" },
            { done: false, label: "Publicación activa" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-sm">
              <StepIcon done={item.done} />
              <span
                className={
                  item.done ? "text-texo-text-primary" : "text-texo-text-muted"
                }
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <Link href="/">
          <Button fullWidth>Ir al inicio</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-texo-text-primary">Publicar mi auto</h1>
      </div>

      <SellStepper currentStep={2} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <UploadZone
          label="Subir INE del propietario"
          name="ine"
          uploaded={ineFile?.name}
          onFile={setIneFile}
        />
        <UploadZone
          label="Subir factura del vehículo"
          name="invoice"
          uploaded={invoiceFile?.name}
          onFile={setInvoiceFile}
        />

        <InfoBanner>
          Texo te notificará cuando haya ofertas. No necesitas contactar a los
          compradores directamente.
        </InfoBanner>

        {error && <p className="text-sm text-texo-error">{error}</p>}

        <div className="flex gap-3">
          <Link href="/sell" className="flex-1">
            <Button variant="secondary" fullWidth type="button">
              Atrás
            </Button>
          </Link>
          <Button
            type="submit"
            fullWidth
            disabled={loading || !ineFile || !invoiceFile}
            className="flex-1"
          >
            {loading ? "Enviando…" : "Enviar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
