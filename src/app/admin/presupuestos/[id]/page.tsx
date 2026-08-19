import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuote } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import { formatArs } from "@/lib/pricing";
import {
  AdminHeading,
  DemoBanner,
  AdminCard,
  TableWrap,
  Th,
  Td,
} from "@/components/admin/ui";
import { QuoteActions } from "@/features/quotes/QuoteActions";

export const dynamic = "force-dynamic";

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!hasDatabase()) {
    return (
      <div>
        <AdminHeading title="Presupuesto" />
        <DemoBanner />
      </div>
    );
  }

  const quote = await getQuote(id);
  if (!quote) notFound();

  return (
    <div>
      <AdminHeading
        title={`Presupuesto ${quote.code.slice(0, 8)}`}
        subtitle={quote.customerName ?? "Sin cliente asignado"}
        action={
          <Link
            href="/admin/presupuestos"
            className="text-sm font-medium text-accent"
          >
            ← Volver
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TableWrap>
            <thead>
              <tr>
                <Th>Ítem</Th>
                <Th>Cant.</Th>
                <Th>Costo</Th>
                <Th>Venta</Th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((i) => (
                <tr key={i.id}>
                  <Td>{i.label}</Td>
                  <Td>{i.quantity}</Td>
                  <Td>{formatArs(i.unitCost * i.quantity)}</Td>
                  <Td>{formatArs(i.unitSale * i.quantity)}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
          {quote.notes && (
            <AdminCard className="mt-4">
              <div className="text-sm font-semibold text-ink">Notas</div>
              <p className="mt-1 text-sm text-muted">{quote.notes}</p>
            </AdminCard>
          )}
        </div>

        <div className="space-y-4">
          <AdminCard>
            <dl className="space-y-2 text-sm">
              <Line label="Costo total" value={formatArs(quote.costTotal)} />
              <Line label="Descuento" value={`${quote.discountPct}%`} />
              <Line label="Precio de venta" value={formatArs(quote.saleTotal)} strong />
              <Line label="Ganancia" value={formatArs(quote.profit)} />
              <Line label="Margen" value={`${quote.marginPct.toFixed(1)}%`} />
              {quote.paymentMethodName && (
                <Line label="Pago" value={quote.paymentMethodName} />
              )}
            </dl>
          </AdminCard>

          <AdminCard>
            <QuoteActions
              quoteId={quote.id}
              current={quote.status}
              saleTotal={quote.saleTotal}
              items={quote.items.map((i) => ({ label: i.label, quantity: i.quantity }))}
              customerName={quote.customerName}
              hasWorkOrder={quote.hasWorkOrder}
              workOrderId={quote.workOrderId}
            />
            <Link
              href={`/admin/presupuestos/${quote.id}/comprobante`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent"
            >
              Ver comprobante imprimible →
            </Link>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

function Line({
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
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "text-base font-bold text-ink" : "text-ink"}>{value}</dd>
    </div>
  );
}
