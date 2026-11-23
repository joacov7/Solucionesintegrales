import { listInstallers } from "@/data/operations";
import { hasDatabase } from "@/lib/prisma";
import {
  AdminHeading,
  DemoBanner,
  TableWrap,
  Th,
  Td,
} from "@/components/admin/ui";
import { Badge } from "@/components/ui";
import { NewInstallerSheet } from "@/features/workorders/NewInstallerSheet";

export const dynamic = "force-dynamic";

export default async function AdminInstaladoresPage() {
  const installers = await listInstallers();
  return (
    <div>
      <AdminHeading
        title="Instaladores"
        subtitle="Equipo técnico que ejecuta las órdenes de trabajo."
        action={<NewInstallerSheet />}
      />
      {!hasDatabase() && <DemoBanner />}

      {installers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <div className="text-sm font-medium text-ink">Todavía no hay instaladores</div>
          <p className="mt-1 text-sm text-muted">
            Agregá el primero con «Nuevo instalador».
          </p>
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
                  <Badge tone={i.active ? "success" : "outline"}>
                    {i.active ? "Activo" : "Inactivo"}
                  </Badge>
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}
