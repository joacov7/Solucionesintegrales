import { listQuotes } from "@/data/admin";
import { hasDatabase } from "@/lib/prisma";
import { formatArs } from "@/lib/pricing";
import {
  AdminHeading,
  DemoBanner,
  TableWrap,
  Th,
  Td,
  StatusBadge,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminPresupuestosPage() {
  const quotes = await listQuotes();
  return (
    <div>
      <AdminHeading
        title="Presupuestos"
        subtitle="Presupuestos generados. Al aceptarse, se crea la orden de trabajo (Fase 2)."
      />
      {!hasDatabase() && <DemoBanner />}

      {quotes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
          Todavía no hay presupuestos. Los leads de los cotizadores se pueden
          convertir en presupuestos formales desde acá.
        </div>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Código</Th>
              <Th>Cliente</Th>
              <Th>Total</Th>
              <Th>Margen</Th>
              <Th>Estado</Th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id}>
                <Td>
                  <span className="font-mono text-xs">{q.code.slice(0, 8)}</span>
                </Td>
                <Td>{q.customerName ?? "—"}</Td>
                <Td>{formatArs(q.saleTotal)}</Td>
                <Td>{q.marginPct.toFixed(1)}%</Td>
                <Td>
                  <StatusBadge status={q.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}
