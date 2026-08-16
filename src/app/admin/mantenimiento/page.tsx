import { listMaintenance, listInstallationOptions } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner } from "@/components/admin/ui";
import { MaintenanceManager } from "@/features/maintenance/MaintenanceManager";

export const dynamic = "force-dynamic";

export default async function AdminMantenimientoPage() {
  const [rows, installations] = await Promise.all([
    listMaintenance(),
    listInstallationOptions(),
  ]);

  return (
    <div>
      <AdminHeading
        title="Mantenimiento"
        subtitle="Preventivos, reparaciones, visitas técnicas, ampliaciones y cambios de batería."
      />
      {!hasDatabase() && <DemoBanner />}
      <MaintenanceManager
        installations={installations}
        initialRows={rows.map((r) => ({
          id: r.id,
          customerName: r.customerName,
          type: r.type,
          scheduledAt: r.scheduledAt ? new Date(r.scheduledAt).toISOString() : null,
          done: r.done,
          notes: r.notes,
        }))}
      />
    </div>
  );
}
