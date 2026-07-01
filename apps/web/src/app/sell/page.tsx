import { SellValuationForm } from "@/components/sell/SellValuationForm";
import { SellerVehicleList } from "@/components/sell/SellerVehicleList";
import { getTexoServerClient } from "@/lib/supabase/server-client";
import { listSellerVehicles, type Vehicle } from "@texo/shared";

/** Flujo vendedor: valuación y borradores. */
export default async function SellPage() {
  const supabase = await getTexoServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let sellerVehicles: Vehicle[] = [];
  if (user) {
    sellerVehicles = await listSellerVehicles(supabase, user.id);
  }

  return (
    <div className="space-y-6">
      <SellValuationForm />
      <SellerVehicleList vehicles={sellerVehicles} />
    </div>
  );
}
