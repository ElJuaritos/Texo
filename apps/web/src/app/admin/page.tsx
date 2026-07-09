import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLayout } from "@/components/admin/AdminLayout";

/** Panel admin — moderación, inspección y transacciones demo. */
export default function AdminPage() {
  return (
    <AdminLayout>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-texo-text-primary">
          Panel administración
        </h1>
        <p className="mt-1 text-sm text-texo-text-secondary">
          Moderación de ofertas, inspección, publicación y seguimiento de transacciones.
        </p>
      </header>
      <AdminDashboard />
    </AdminLayout>
  );
}
