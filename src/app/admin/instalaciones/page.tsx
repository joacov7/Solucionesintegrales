import { listInstallations } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner, TableWrap, Th, Td } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminInstalacionesPage() {
  const installations = await listInstallations();
  return (
    <div>
      <AdminHeading
        title="Instalaciones y garantías"
        subtitle="Registro de instalaciones finalizadas, con conformidad del cliente y garantías."
      />
      {!hasDatabase() && <DemoBanner />}

      {installations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
          Todavía no hay instalaciones registradas. Se crean cuando el instalador
          finaliza una orden de trabajo.
        </div>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Cliente</Th>
              <Th>Instalador</Th>
              <Th>Fecha</Th>
              <Th>Conformidad</Th>
              <Th>Garantías</Th>
            </tr>
          </thead>
          <tbody>
            {installations.map((i) => (
              <tr key={i.id}>
                <Td>{i.customerName}</Td>
                <Td>{i.installerName ?? "—"}</Td>
                <Td>{new Date(i.installedAt).toLocaleDateString("es-AR")}</Td>
                <Td>
                  {i.clientSignedOff ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Firmada
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                      Pendiente
                    </span>
                  )}
                </Td>
                <Td>
                  {i.warranties.length === 0
                    ? "—"
                    : i.warranties
                        .map((w) => `${w.productName} (${w.warrantyMonths}m)`)
                        .join(", ")}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}
