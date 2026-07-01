import { getTexoServerClient } from "@/lib/supabase/server-client";
import { listAdminTransactions, type Transaction } from "@texo/shared";
import { AdminTransactionsTable } from "@/components/admin/AdminTransactionsTable";
import { ErrorState } from "@/components/ui/ErrorState";

/** Panel admin — transacciones y estados. */
export default async function AdminPage() {
  const supabase = await getTexoServerClient();
  let transactions: Transaction[] = [];
  let error: string | null = null;

  try {
    transactions = await listAdminTransactions(supabase);
  } catch (e) {
    error = e instanceof Error ? e.message : "Error al cargar transacciones";
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Panel administración</h1>
        <p className="mt-1 text-sm text-slate-500">
          Seguimiento de transacciones del marketplace.
        </p>
      </header>

      {error ? (
        <ErrorState message={error} />
      ) : (
        <AdminTransactionsTable transactions={transactions} />
      )}
    </div>
  );
}
