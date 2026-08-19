import { listCustomers } from "@/data/admin";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner, TableWrap, Th, Td } from "@/components/admin/ui";
import { CustomerForm } from "@/components/admin/CustomerForm";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const customers = await listCustomers();
  return (
    <div>
      <AdminHeading
        title="Clientes"
        subtitle="Base de clientes (CRM). Particulares, comercios y empresas."
      />
      {!hasDatabase() && <DemoBanner />}

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <CustomerForm />
        </div>
        <div className="lg:col-span-3">
          {customers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
              Todavía no hay clientes cargados.
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
      </div>
    </div>
  );
}
