import { getQuoterDataset } from "@/data/quoter-data";
import { listCustomers } from "@/data/admin";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner } from "@/components/admin/ui";
import { QuoteBuilder } from "@/features/quotes/QuoteBuilder";

export const dynamic = "force-dynamic";

export default async function NuevoPresupuestoPage() {
  const [dataset, customers] = await Promise.all([
    getQuoterDataset(),
    listCustomers(),
  ]);

  return (
    <div>
      <AdminHeading
        title="Nuevo presupuesto"
        subtitle="Armá el presupuesto con productos y mano de obra. Los totales se calculan solos."
      />
      {!hasDatabase() && <DemoBanner />}
      <QuoteBuilder
        dataset={dataset}
        customers={customers.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
