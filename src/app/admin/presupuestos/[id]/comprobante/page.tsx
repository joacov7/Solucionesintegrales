import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuote } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import { formatArs } from "@/lib/pricing";
import { siteConfig } from "@/config/site";
import { PrintButton } from "@/features/quotes/PrintButton";

export const dynamic = "force-dynamic";

/**
 * Comprobante imprimible del presupuesto (facturación básica, sin AFIP).
 * Base para integrar facturación electrónica en el futuro.
 */
export default async function ComprobantePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!hasDatabase()) {
    return (
      <div className="p-10 text-center text-sm text-muted">
        Modo demo: configurá la base de datos para generar comprobantes.
      </div>
    );
  }

  const quote = await getQuote(id);
  if (!quote) notFound();

  const iva = 0.21;
  const neto = quote.saleTotal / (1 + iva);
  const ivaAmount = quote.saleTotal - neto;

  return (
    <div className="min-h-dvh bg-brand-soft p-6 print:bg-white print:p-0">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <Link href={`/admin/presupuestos/${id}`} className="text-sm font-medium text-accent">
            ← Volver al presupuesto
          </Link>
          <PrintButton />
        </div>

        <div className="rounded-2xl border border-line bg-white p-8 shadow-card print:border-0 print:shadow-none">
          {/* Encabezado */}
          <div className="flex items-start justify-between border-b border-line pb-6">
            <div>
              <div className="text-lg font-bold text-ink">{siteConfig.name}</div>
              <div className="mt-1 text-xs text-muted">
                {siteConfig.contact.address}
                <br />
                {siteConfig.contact.phone} · {siteConfig.contact.email}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-ink">Comprobante</div>
              <div className="text-xs text-muted">N° {quote.code.slice(0, 8)}</div>
              <div className="text-xs text-muted">
                {new Date(quote.createdAt).toLocaleDateString("es-AR")}
              </div>
            </div>
          </div>

          {/* Cliente */}
          <div className="border-b border-line py-4 text-sm">
            <div className="text-xs uppercase tracking-wide text-muted">Cliente</div>
            <div className="font-medium text-ink">
              {quote.customerName ?? "Consumidor final"}
            </div>
          </div>

          {/* Ítems */}
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th className="py-2">Detalle</th>
                <th className="py-2 text-right">Cant.</th>
                <th className="py-2 text-right">Importe</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((i) => (
                <tr key={i.id} className="border-b border-line/60">
                  <td className="py-2 text-ink">{i.label}</td>
                  <td className="py-2 text-right text-muted">{i.quantity}</td>
                  <td className="py-2 text-right text-ink">
                    {formatArs(i.unitSale * i.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totales */}
          <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
            <Row label="Neto" value={formatArs(neto)} />
            <Row label="IVA 21%" value={formatArs(ivaAmount)} />
            {quote.discountPct > 0 && (
              <Row label={`Descuento ${quote.discountPct}%`} value="incluido" />
            )}
            <div className="border-t border-line pt-1">
              <Row label="Total" value={formatArs(quote.saleTotal)} strong />
            </div>
            {quote.paymentMethodName && (
              <Row label="Forma de pago" value={quote.paymentMethodName} />
            )}
          </div>

          <p className="mt-8 text-center text-xs text-muted">
            Documento no válido como factura. Comprobante interno de {siteConfig.name}.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{label}</span>
      <span className={strong ? "text-base font-bold text-ink" : "text-ink"}>
        {value}
      </span>
    </div>
  );
}
