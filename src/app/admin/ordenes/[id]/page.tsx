import { notFound } from "next/navigation";
import Link from "next/link";
import { getWorkOrder, listInstallers } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import {
  AdminHeading,
  DemoBanner,
  AdminCard,
  StatusBadge,
} from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icon";
import { WorkOrderAdminControl } from "@/features/workorders/WorkOrderAdminControl";

export const dynamic = "force-dynamic";

export default async function OrdenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!hasDatabase()) {
    return (
      <div>
        <AdminHeading title="Orden de trabajo" />
        <DemoBanner />
      </div>
    );
  }

  const [order, installers] = await Promise.all([
    getWorkOrder(id),
    listInstallers(true),
  ]);
  if (!order) notFound();

  const doneCount = order.checklist.filter((c) => c.done).length;

  return (
    <div>
      <AdminHeading
        title={`Orden ${order.code.slice(0, 8)}`}
        subtitle={order.customer.name}
        action={
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <Link href="/admin/ordenes" className="text-sm font-medium text-accent">
              ← Volver
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AdminCard>
            <h2 className="text-sm font-semibold text-ink">Cliente</h2>
            <div className="mt-2 text-sm text-muted">
              <div>{order.customer.name}</div>
              {order.customer.phone && <div>{order.customer.phone}</div>}
              <div>
                {order.address ?? order.customer.address ?? "Sin dirección"} ·{" "}
                {order.customer.locality ?? ""}
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="text-sm font-semibold text-ink">Materiales</h2>
            {order.items.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Sin materiales cargados.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-sm">
                {order.items.map((i) => (
                  <li key={i.id} className="flex items-center gap-2">
                    <Icon
                      name="check"
                      className={`h-4 w-4 ${
                        i.installed ? "text-emerald-500" : "text-line"
                      }`}
                    />
                    <span className={i.installed ? "text-muted line-through" : "text-ink"}>
                      {i.quantity > 1 && `${i.quantity}× `}
                      {i.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Checklist de instalación</h2>
              <span className="text-xs text-muted">
                {doneCount}/{order.checklist.length}
              </span>
            </div>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              {order.checklist.map((c) => (
                <li key={c.id} className="flex items-center gap-2 text-sm">
                  <Icon
                    name="check"
                    className={`h-4 w-4 ${c.done ? "text-emerald-500" : "text-line"}`}
                  />
                  <span className={c.done ? "text-muted" : "text-ink"}>{c.label}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/installer/${order.id}`}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent"
            >
              Abrir en la app del instalador →
            </Link>
          </AdminCard>
        </div>

        <div>
          <AdminCard>
            <h2 className="mb-3 text-sm font-semibold text-ink">Gestión</h2>
            <WorkOrderAdminControl
              workOrderId={order.id}
              installers={installers.map((i) => ({ id: i.id, name: i.name }))}
              current={{
                installerId: order.installerId,
                status: order.status,
                address: order.address,
                scheduledAt: order.scheduledAt
                  ? new Date(order.scheduledAt).toISOString()
                  : null,
                notes: order.notes,
              }}
            />
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
