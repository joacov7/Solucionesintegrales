/**
 * Seed de la base de datos con los datos iniciales (categorías, productos Vetti
 * de la lista, servicios, métodos de pago, paquetes y configuración).
 * Ejecutar con: npm run db:seed
 */

import { PrismaClient } from "@prisma/client";
import {
  initialSettings,
  initialCategories,
  initialProducts,
  initialServices,
  initialPaymentMethods,
  initialPackages,
  DEFAULT_MARGIN_PCT,
} from "../src/data/initial-data";

const prisma = new PrismaClient();

async function main() {
  console.log("→ Seed: settings");
  for (const s of initialSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, label: s.label },
      create: s,
    });
  }

  console.log("→ Seed: categorías");
  for (const c of initialCategories) {
    await prisma.productCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order },
      create: c,
    });
  }
  const categories = await prisma.productCategory.findMany();
  const catBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  console.log("→ Seed: productos");
  for (const p of initialProducts) {
    const categoryId = catBySlug.get(p.categorySlug);
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        brand: p.brand,
        model: p.model,
        priceUsd: p.priceUsd,
        hasVat: p.hasVat,
        marginPct: DEFAULT_MARGIN_PCT,
        installMinutes: p.installMinutes,
        description: p.description,
        categoryId,
      },
      create: {
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        model: p.model,
        priceUsd: p.priceUsd,
        hasVat: p.hasVat,
        marginPct: DEFAULT_MARGIN_PCT,
        installMinutes: p.installMinutes,
        description: p.description,
        categoryId,
      },
    });
  }

  console.log("→ Seed: servicios (mano de obra)");
  for (const s of initialServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { name: s.name, priceArs: s.priceArs, estimatedMin: s.estimatedMin },
      create: s,
    });
  }

  console.log("→ Seed: métodos de pago");
  const existingMethods = await prisma.paymentMethod.count();
  if (existingMethods === 0) {
    for (const m of initialPaymentMethods) {
      await prisma.paymentMethod.create({ data: m });
    }
  }

  console.log("→ Seed: paquetes");
  const products = await prisma.product.findMany();
  const prodBySku = new Map(products.map((p) => [p.sku, p.id]));
  for (const pkg of initialPackages) {
    const created = await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        name: pkg.name,
        target: pkg.target,
        description: pkg.description,
      },
      create: {
        name: pkg.name,
        slug: pkg.slug,
        target: pkg.target,
        description: pkg.description,
      },
    });
    // Reemplazar items del paquete.
    await prisma.packageItem.deleteMany({ where: { packageId: created.id } });
    for (const item of pkg.items) {
      const productId = prodBySku.get(item.sku);
      if (!productId) continue;
      await prisma.packageItem.create({
        data: { packageId: created.id, productId, quantity: item.quantity },
      });
    }
  }

  console.log("✓ Seed completo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
