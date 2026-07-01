# Producto Texo — Resumen ejecutivo

Contexto de negocio compacto para desarrollo. Evita repetir este material en cada chat de IA.

## Problema

En México, vender un vehículo seminuevo entre particulares implica semanas de incertidumbre: valuaciones poco confiables, compradores que no concretan, riesgo de fraude y un cierre legal (factura, transferencia, pagos) que nadie quiere gestionar solo. Comprar tampoco es seguro — no hay inspección independiente ni garantía de que el precio sea justo.

## Propuesta de valor

Texo intermediado el proceso completo: inspección certificada antes de publicar, negociación mediada por Texo, pagos protegidos (escrow en MVP productivo) y gestoría de transferencia. El vendedor obtiene un precio de mercado con menos fricción; el comprador compra con información verificada y proceso guiado.

## Modelo de ingresos

- **Comisión ~5%** cobrada al vendedor al cerrar la operación.
- Texo **no compra inventario** — modelo marketplace puro, capital-light.
- ICP inicial: **Polanco / CDMX**, ticket promedio **~$450K MXN**, autos seminuevos 3–7 años.

## North star

**Tiempo promedio de venta < 21 días** desde publicación hasta cierre (medido en MVP productivo).

---

## Buyer persona: Andrés

Andrés, 34 años, profesionista en Polanco. Busca un SUV seminuevo (~$400–500K MXN) para reemplazar su sedán. Valora su tiempo: no quiere perder fines de semana en citas fallidas ni arriesgarse a un auto con problemas ocultos. Prefiere un proceso digital con inspección verificable, precio transparente y cierre seguro. Está dispuesto a pagar un poco más por confianza y velocidad.

---

## Flujo vendedor (14 pasos)

1. Registro / login en Texo
2. Captura datos básicos del vehículo (marca, modelo, año, km, versión)
3. Recibe **valuación estimada** (rango de mercado)
4. Acepta términos de publicación y comisión 5%
5. Sube **INE** (identidad)
6. Sube **factura / documentos** de propiedad
7. Agenda **inspección física** con mecánico certificado
8. Inspección en sitio (exterior, mecánica, documentos)
9. Recibe **reporte de inspección** con score
10. Si score ≥ 75 → certificación dual Texo + mecánico; si no, opciones de reparación o retiro
11. Aprueba publicación → vehículo visible en inventario
12. Recibe **ofertas formales** de compradores
13. Negociación mediada por Texo → acepta oferta → se agenda prueba de manejo
14. Post-prueba: confirmación de ambas partes → cierre (demo: estado documental; MVP: escrow + transferencia)

## Flujo comprador (11 pasos)

1. Registro / login en Texo
2. Explora **inventario** publicado (solo vehículos certificados)
3. Filtra por precio, marca, año, score de inspección
4. Abre **ficha del vehículo** con fotos y datos
5. Revisa **reporte de inspección** completo (score, categorías, daños)
6. Envía **oferta formal** (monto + vigencia)
7. Espera respuesta (aceptada / contraoferta / rechazada) — mediación Texo
8. Oferta aceptada → agenda **prueba de manejo**
9. Asiste a la prueba de manejo
10. **Confirma interés** post-prueba (sin depósito en MVP demo)
11. Cierre de operación (demo: cambio de estado en admin; MVP: escrow + firma + transferencia)

---

## Inspección certificada

| Aspecto | Detalle |
|---------|---------|
| Scoring | **100 puntos** en categorías (exterior, interior, mecánica, documentación, prueba en ruta) |
| Mínimo publicación | **75 puntos** — debajo no se publica hasta remediar o retirar |
| Certificación | Dual: sello **Texo** + firma **mecánico certificado** |
| Reporte | Visible en ficha para compradores; daños detallados por componente |
| Demo | Inspección **real** con captura en sistema; no simulada |

---

## Reglas: ofertas y prueba de manejo

- **Oferta previa obligatoria** antes de agendar prueba de manejo — evita curiosos sin intención real.
- **Sin depósito en MVP demo** — el compromiso es la oferta formal registrada, no un pago anticipado.
- **Confirmación post-prueba** — comprador y vendedor confirman interés tras la prueba antes de avanzar a cierre.
- Negociación mediada por Texo en demo (manual vía admin); IA en horizonte 2.
- Una prueba de manejo activa por comprador/vehículo a la vez (evitar saturación al vendedor).

---

## Roadmap — 3 horizontes

### Horizonte 1 — Demo funcional (4 semanas)

Valuación, inspección en ficha, browse comprador, ofertas, prueba de manejo, panel admin básico. Sin escrow, push, firma ni IA.

### Horizonte 2 — MVP productivo (~6 meses post-fondeo)

Escrow real (CNBV-compliant), firma digital legal, push notifications, verificación ID automatizada, negociación asistida, gestoría de transferencia end-to-end.

### Horizonte 3 — Escala (~12 meses)

Expansión geográfica CDMX → principales ciudades, IA de negociación, analytics de pricing, programa de mecánicos certificados a escala, unit economics optimizados.

---

## Pendientes críticos pre-operación

| Tema | Estado | Notas |
|------|--------|-------|
| **Marco legal factura / comisión** | Pendiente | Estructura fiscal para comisión 5% y facturación al vendedor |
| **CNBV / escrow** | Pendiente | Proveedor y cumplimiento regulatorio para pagos protegidos (Conekta/STP u otro) |
| **Comparativo Kavak / competencia** | Pendiente | Posicionamiento: Texo no compra auto; diferencial intermediación + ticket Polanco |
| **Términos y condiciones / privacidad** | Pendiente | LFPDPPP, aviso de privacidad, contrato de intermediación |
| **Red de mecánicos certificados** | En progreso (demo) | Al menos 1–2 para inspecciones reales en demo |

---

## Métricas clave (MVP productivo)

- Tiempo promedio venta (north star < 21 días)
- Tasa conversión oferta → prueba de manejo → cierre
- Ticket promedio y comisión efectiva
- NPS vendedor y comprador post-cierre
