import { listCustomers } from "@/data/admin";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner, TableWrap, Th, Td } from "@/components/admin/ui";
import { NewCustomerSheet } from "@/components/admin/NewCustomerSheet";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const customers = await listCustomers();
  return (
    <div>
      <AdminHeading
        title="Clientes"
        subtitle="Base de clientes (CRM). Particulares, comercios y empresas."
        action={<NewCustomerSheet />}
      />
      {!hasDatabase() && <DemoBanner />}

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <div className="text-sm font-medium text-ink">Todavía no hay clientes</div>
          <p className="mt-1 text-sm text-muted">
            Cargá el primero con «Nuevo cliente» o se crean solos desde los leads.
          </p>
        </div>
      ) : (
        <TableWrap>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Tipo</Th>
              <Th>Teléfono</Th>
              <Th>Localidad</Th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <Td>
                  <div className="font-medium text-ink">{c.name}</div>
                  {c.email && <div className="text-xs text-muted">{c.email}</div>}
                </Td>
                <Td>{c.type}</Td>
                <Td>{c.phone ?? "—"}</Td>
                <Td>{c.locality ?? "—"}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}
