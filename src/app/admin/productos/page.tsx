import { listProducts, getPricingContext, getDefaultMargin } from "@/data/catalog";
import { hasDatabase } from "@/lib/prisma";
import { AdminHeading, DemoBanner } from "@/components/admin/ui";
import { ProductsTable } from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage() {
  const [products, ctx, defaultMargin] = await Promise.all([
    listProducts(),
    getPricingContext(),
    getDefaultMargin(),
  ]);

  const editable = products.map((p) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    brand: p.brand,
    categoryName: p.categoryName,
    priceUsd: p.priceUsd,
    hasVat: p.hasVat,
    marginPct: p.marginPct || defaultMargin,
    active: p.active,
  }));

  return (
    <div>
      <AdminHeading
        title="Productos"
        subtitle={`Precios calculados con dólar ${ctx.dolar} e IVA ${Math.round(
          ctx.iva * 100
        )}%. El precio de venta = costo final × (1 + margen).`}
      />
      {!hasDatabase() && <DemoBanner />}
      <ProductsTable products={editable} ctx={ctx} />
    </div>
  );
}
