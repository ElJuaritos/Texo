"use client";

import { useEffect, useState } from "react";
import { listSellerVehicles, type Vehicle } from "@texo/shared";
import { getTexoBrowserClient } from "@/lib/supabase/texo-client";
import { SellValuationForm } from "@/components/sell/SellValuationForm";
import { SellerVehicleList } from "@/components/sell/SellerVehicleList";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

/** Contenido client-side del flujo vendedor — compatible con export estático. */
export function SellPageContent() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = getTexoBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const data = await listSellerVehicles(supabase, user.id);
        setVehicles(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Cargando…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SellValuationForm />
      <SellerVehicleList vehicles={vehicles} />
    </div>
  );
}
