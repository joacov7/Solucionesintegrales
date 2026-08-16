import { listLeads } from "@/data/admin";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner } from "@/components/admin/ui";
import { LeadsTable } from "@/components/admin/LeadsTable";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const leads = await listLeads();
  return (
    <div>
      <AdminHeading
        title="Leads / CRM"
        subtitle="Consultas capturadas desde los cotizadores y formularios."
      />
      {!hasDatabase() && <DemoBanner />}
      <LeadsTable
        leads={leads.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
