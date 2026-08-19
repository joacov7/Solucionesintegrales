import { listPaymentMethods } from "@/data/catalog";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner } from "@/components/admin/ui";
import { PaymentMethodsTable } from "@/components/admin/PaymentMethodsTable";

export const dynamic = "force-dynamic";

export default async function AdminFinanciacionPage() {
  const methods = await listPaymentMethods();
  return (
    <div>
      <AdminHeading
        title="Financiación"
        subtitle="Configurá el costo financiero y el anticipo de cada plan de cuotas."
      />
      {!hasDatabase() && <DemoBanner />}
      <PaymentMethodsTable methods={methods} />
    </div>
  );
}
