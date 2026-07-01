"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";

/** Formulario de valuación y captura de vehículo (draft). */
export function SellValuationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    trim: "",
    mileage: 0,
    estimated_price: 450000,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = getTexoBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Debes iniciar sesión como vendedor");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("vehicles")
      .insert({
        seller_id: user.id,
        make: form.make,
        model: form.model,
        year: form.year,
        trim: form.trim || null,
        mileage: form.mileage,
        estimated_price: form.estimated_price,
        status: "draft",
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/sell/documents?vehicleId=${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Vender mi auto</h1>
        <p className="mt-1 text-sm text-slate-500">
          Valuación estimada de referencia:{" "}
          <strong>${form.estimated_price.toLocaleString("es-MX")} MXN</strong> (ajuste admin después).
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Marca</span>
          <input
            required
            value={form.make}
            onChange={(e) => setForm({ ...form, make: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="BMW"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Modelo</span>
          <input
            required
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
            placeholder="X3"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Año</span>
          <input
            type="number"
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium">Kilometraje</span>
          <input
            type="number"
            required
            value={form.mileage}
            onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Versión (opcional)</span>
          <input
            value={form.trim}
            onChange={(e) => setForm({ ...form, trim: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Precio estimado (MXN)</span>
          <input
            type="number"
            value={form.estimated_price}
            onChange={(e) =>
              setForm({ ...form, estimated_price: Number(e.target.value) })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-teal-700 px-6 py-2.5 font-medium text-white hover:bg-teal-600 disabled:opacity-50"
        >
          {loading ? "Guardando…" : "Guardar borrador y continuar"}
        </button>
        <Link href="/" className="py-2.5 text-sm text-slate-500 hover:text-teal-700">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
