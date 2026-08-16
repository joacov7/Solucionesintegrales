import { notFound } from "next/navigation";
import Link from "next/link";
import { getWorkOrder } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/ui";
import { InstallerJob } from "@/features/workorders/InstallerJob";

export const dynamic = "force-dynamic";

export default async function InstallerJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!hasDatabase()) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Modo demo: configurá la base de datos para operar órdenes.
      </div>
    );
  }

  const order = await getWorkOrder(id);
  if (!order) notFound();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/installer" className="text-sm font-medium text-accent">
          ← Trabajos
        </Link>
        <StatusBadge status={order.status} />
      </div>

      <InstallerJob
        workOrderId={order.id}
        customer={{
          name: order.customer.name,
          phone: order.customer.phone,
          address: order.address ?? order.customer.address,
        }}
        items={order.items}
        checklist={order.checklist.map((c) => ({
          id: c.id,
          label: c.label,
          done: c.done,
        }))}
        installation={order.installation}
        finished={order.status === "FINALIZADA"}
      />
    </div>
  );
}
