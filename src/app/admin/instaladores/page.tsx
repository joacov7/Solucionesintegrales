import { listInstallers } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner, TableWrap, Th, Td } from "@/components/admin/ui";
import { InstallerForm } from "@/features/workorders/InstallerForm";

export const dynamic = "force-dynamic";

export default async function AdminInstaladoresPage() {
  const installers = await listInstallers();
  return (
    <div>
      <AdminHeading
        title="Instaladores"
        subtitle="Equipo técnico que ejecuta las órdenes de trabajo."
      />
      {!hasDatabase() && <DemoBanner />}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <InstallerForm />
        </div>
        <div className="lg:col-span-3">
          {installers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
              Todavía no hay instaladores cargados.
            </div>
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Nombre</Th>
                  <Th>Teléfono</Th>
                  <Th>Email</Th>
                  <Th>Estado</Th>
                </tr>
              </thead>
              <tbody>
                {installers.map((i) => (
                  <tr key={i.id}>
                    <Td>{i.name}</Td>
                    <Td>{i.phone ?? "—"}</Td>
                    <Td>{i.email ?? "—"}</Td>
                    <Td>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          i.active
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {i.active ? "Activo" : "Inactivo"}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>
      </div>
    </div>
  );
}
