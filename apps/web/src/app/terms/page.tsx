/** Términos y condiciones — stub legal demo. */
export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6 py-8">
      <h1 className="text-2xl font-bold text-texo-text-primary">
        Términos y Condiciones
      </h1>
      <p className="text-sm leading-relaxed text-texo-text-secondary">
        Texo es una plataforma demo para conectar compradores y vendedores de
        vehículos seminuevos en México. Al usar el servicio aceptas que las
        transacciones están mediadas por Texo, que la inspección certificada es
        requisito para publicar, y que no existe contacto directo entre partes.
      </p>
      <p className="text-sm leading-relaxed text-texo-text-secondary">
        El escrow y la gestoría legal son simulados en esta fase demo. Para
        producción se aplicarán términos definitivos conforme a la legislación
        mexicana aplicable.
      </p>
    </article>
  );
}
