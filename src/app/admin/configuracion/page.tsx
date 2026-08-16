import { getSettingsMap } from "@/data/catalog";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage() {
  const values = await getSettingsMap();
  return (
    <div>
      <AdminHeading
        title="Configuración"
        subtitle="Tipo de cambio, IVA y margen. Afectan el cálculo de todos los precios."
      />
      {!hasDatabase() && <DemoBanner />}
      <SettingsForm values={values} />
    </div>
  );
}
