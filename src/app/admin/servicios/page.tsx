import { listServices } from "@/data/catalog";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner } from "@/components/admin/ui";
import { ServicesTable } from "@/components/admin/ServicesTable";

export const dynamic = "force-dynamic";

export default async function AdminServiciosPage() {
  const services = await listServices();
  return (
    <div>
      <AdminHeading
        title="Mano de obra"
        subtitle="Catálogo de servicios de instalación. Los precios se usan en los cotizadores y presupuestos."
      />
      {!hasDatabase() && <DemoBanner />}
      <ServicesTable services={services} />
    </div>
  );
}
