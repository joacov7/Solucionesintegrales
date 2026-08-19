import Link from "next/link";
import { listWorkOrders } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import { StatusBadge } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function InstallerHomePage() {
  const orders = hasDatabase() ? await listWorkOrders() : [];
  const active = orders.filter((o) => o.status !== "CANCELADA");

  return (
    <div>
      <h1 className="text-xl font-bold text-ink">Trabajos asignados</h1>
      <p className="mt-1 text-sm text-muted">
        Tocá una orden para ver el detalle y registrar la instalación.
      </p>

      {!hasDatabase() && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Modo demo: configurá la base de datos para ver órdenes reales.
        </div>
      )}

      <div className="mt-5 space-y-3">
        {active.length === 0 && hasDatabase() && (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
            No hay trabajos por ahora.
          </div>
        )}
        {active.map((o) => (
          <Link
            key={o.id}
            href={`/installer/${o.id}`}
            className="block rounded-2xl border border-line bg-surface p-4 shadow-card active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">{o.customerName}</span>
              <StatusBadge status={o.status} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted">
              <span className="font-mono">{o.code.slice(0, 8)}</span>
              <span className="inline-flex items-center gap-1">
                {o.scheduledAt
                  ? new Date(o.scheduledAt).toLocaleDateString("es-AR")
                  : "Sin fecha"}
                <Icon name="arrow-right" className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
