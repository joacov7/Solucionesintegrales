import { listProducts } from "@/data/catalog";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner, StatCard } from "@/components/admin/ui";
import { StockTable } from "@/components/admin/StockTable";

export const dynamic = "force-dynamic";

export default async function AdminStockPage() {
  const products = await listProducts();
  const lowStock = products.filter((p) => p.stock <= p.lowStockThreshold);
  const totalUnits = products.reduce((a, p) => a + p.stock, 0);

  return (
    <div>
      <AdminHeading
        title="Stock"
        subtitle="El stock se descuenta automáticamente al finalizar cada instalación."
      />
      {!hasDatabase() && <DemoBanner />}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Productos" value={String(products.length)} />
        <StatCard label="Unidades en stock" value={String(totalUnits)} />
        <StatCard
          label="Con stock bajo"
          value={String(lowStock.length)}
          hint={lowStock.length ? "Reponer pronto" : "Todo OK"}
        />
      </div>

      <StockTable
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          stock: p.stock,
          lowStockThreshold: p.lowStockThreshold,
        }))}
      />
    </div>
  );
}
