import Link from "next/link";

/** 404 personalizado para rutas no encontradas. */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-2xl font-bold text-slate-900">No encontrado</h1>
      <p className="mt-2 text-slate-500">El recurso que buscas no existe.</p>
      <Link href="/" className="mt-4 text-sm font-medium text-teal-700 hover:underline">
        Ir al inventario
      </Link>
    </div>
  );
}
