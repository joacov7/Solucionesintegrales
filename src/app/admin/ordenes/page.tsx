import Link from "next/link";
import { listWorkOrders } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import {
  AdminHeading,
  DemoBanner,
  TableWrap,
  Th,
  Td,
  StatusBadge,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminOrdenesPage() {
  const orders = await listWorkOrders();
  return (
    <div>
      <AdminHeading
        title="Órdenes de trabajo"
        subtitle="Se generan automáticamente al aceptar un presupuesto."
      />
      {!hasDatabase() && <DemoBanner />}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
          Todavía no hay órdenes. Aceptá un presupuesto para generar la primera.
        </div>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Código</Th>
              <Th>Cliente</Th>
              <Th>Instalador</Th>
              <Th>Fecha</Th>
              <Th>Estado</Th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <Td>
                  <Link
                    href={`/admin/ordenes/${o.id}`}
                    className="font-mono text-xs font-medium text-accent hover:underline"
                  >
                    {o.code.slice(0, 8)}
                  </Link>
                </Td>
                <Td>{o.customerName}</Td>
                <Td>{o.installerName ?? "— Sin asignar"}</Td>
                <Td>
                  {o.scheduledAt
                    ? new Date(o.scheduledAt).toLocaleDateString("es-AR")
                    : "—"}
                </Td>
                <Td>
                  <StatusBadge status={o.status} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}
