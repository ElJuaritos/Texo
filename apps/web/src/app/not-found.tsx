import Link from "next/link";
import { Button } from "@/components/ui/Button";

/** 404 personalizado para rutas no encontradas. */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-2xl font-bold text-texo-text-primary">No encontrado</h1>
      <p className="mt-2 text-texo-text-secondary">
        El recurso que buscas no existe.
      </p>
      <Link href="/" className="mt-6">
        <Button className="px-6 py-2">Ir al inventario</Button>
      </Link>
    </div>
  );
}
