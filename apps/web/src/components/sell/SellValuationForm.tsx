"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SellStepper } from "@/components/sell/SellStepper";

/** Formulario paso 1 — datos del vehículo. */
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
    if (!form.make.trim() || !form.model.trim() || !form.mileage) {
      setError("Completa marca, modelo y kilómetros");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = getTexoBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-texo-text-primary">Publicar mi auto</h1>
      </div>

      <SellStepper currentStep={1} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Marca"
          required
          value={form.make}
          onChange={(e) => setForm({ ...form, make: e.target.value })}
          placeholder="ej. BMW, Toyota, Honda..."
        />
        <Input
          label="Modelo"
          required
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
          placeholder="ej. Serie 3, Corolla..."
        />
        <Input
          label="Año"
          type="number"
          required
          value={form.year}
          onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
          placeholder="2020"
        />
        <Input
          label="Kilómetros"
          type="number"
          required
          value={form.mileage || ""}
          onChange={(e) => setForm({ ...form, mileage: Number(e.target.value) })}
          placeholder="42,000"
        />
        <Input
          label="Precio (MXN)"
          type="number"
          value={form.estimated_price}
          onChange={(e) =>
            setForm({ ...form, estimated_price: Number(e.target.value) })
          }
          placeholder="450,000"
        />
        <Input
          label="Versión (opcional)"
          value={form.trim}
          onChange={(e) => setForm({ ...form, trim: e.target.value })}
        />

        {error && <p className="text-sm text-texo-error">{error}</p>}

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? "Guardando…" : "Siguiente"}
        </Button>
      </form>
    </div>
  );
}
