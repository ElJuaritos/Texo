import type { Transaction } from "@texo/shared";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";

interface AdminTransactionsTableProps {
  transactions: Transaction[];
}

/** Tabla de transacciones para panel admin. */
export function AdminTransactionsTable({
  transactions,
}: AdminTransactionsTableProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="Sin transacciones"
        description="Las transacciones aparecerán cuando se acepten ofertas."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Vehículo</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Estado</th>
            <th className="px-4 py-3 font-semibold text-slate-700">Creada</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-mono text-xs text-slate-500">
                {tx.id.slice(0, 8)}…
              </td>
              <td className="px-4 py-3 text-slate-800">
                {tx.vehicle_id.slice(0, 8)}…
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={tx.status} />
              </td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(tx.created_at).toLocaleDateString("es-MX")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
