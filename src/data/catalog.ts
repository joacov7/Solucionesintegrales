/**
 * CAPA DE ACCESO A DATOS — Catálogo (lecturas)
 * ---------------------------------------------------------------------------
 * Expone el catálogo (productos, servicios, paquetes, métodos de pago y
 * configuración) al resto de la app. Funciona en dos modos:
 *   - Con DATABASE_URL: lee de PostgreSQL vía Prisma.
 *   - Sin DATABASE_URL (modo demo): usa los datos del seed en memoria, para que
 *     el sitio y los cotizadores funcionen sin base configurada.
 *
 * Los tipos de dominio son independientes de Prisma para no filtrar detalles
 * de la base al resto de la aplicación.
 */

import { prisma, hasDatabase } from "@/lib/prisma";
import type { PricingContext } from "@/lib/pricing";
import {
  initialSettings,
  initialCategories,
  initialProducts,
  initialServices,
  initialPaymentMethods,
  initialPackages,
  DEFAULT_MARGIN_PCT,
} from "./initial-data";

export type CatalogProduct = {
  id: string;
  sku: string | null;
  name: string;
  brand: string | null;
  model: string | null;
  description: string | null;
  categorySlug: string;
  categoryName: string;
  priceUsd: number;
  hasVat: boolean;
  marginPct: number;
  installMinutes: number;
  stock: number;
  lowStockThreshold: number;
  active: boolean;
};

export type CatalogService = {
  id: string;
  slug: string;
  name: string;
  priceArs: number;
  estimatedMin: number;
  active: boolean;
};

export type CatalogPaymentMethod = {
  id: string;
  name: string;
  installments: number;
  financingCost: number;
  downPaymentPct: number;
  active: boolean;
  order: number;
};

export type CatalogPackage = {
  id: string;
  name: string;
  slug: string;
  target: string | null;
  description: string | null;
  items: { productSku: string; productName: string; quantity: number }[];
};

// ---------------------------------------------------------------------------
// Configuración (settings)
// ---------------------------------------------------------------------------

export async function getSettingsMap(): Promise<Record<string, string>> {
  if (hasDatabase()) {
    try {
      const rows = await prisma.setting.findMany();
      const map: Record<string, string> = {};
      for (const r of rows) map[r.key] = r.value;
      // Completar defaults faltantes.
      for (const s of initialSettings) if (!(s.key in map)) map[s.key] = s.value;
      return map;
    } catch {
      // Si falla la DB, degradamos a defaults.
    }
  }
  const map: Record<string, string> = {};
  for (const s of initialSettings) map[s.key] = s.value;
  return map;
}

export async function getPricingContext(): Promise<PricingContext> {
  const map = await getSettingsMap();
  return {
    dolar: Number(map.dolar ?? 1520),
    iva: Number(map.iva ?? 0.21),
  };
}

export async function getDefaultMargin(): Promise<number> {
  const map = await getSettingsMap();
  return Number(map.default_margin_pct ?? DEFAULT_MARGIN_PCT);
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------

export async function listProducts(
  opts: { activeOnly?: boolean; categorySlug?: string } = {}
): Promise<CatalogProduct[]> {
  if (hasDatabase()) {
    try {
      const rows = await prisma.product.findMany({
        where: {
          ...(opts.activeOnly ? { active: true } : {}),
          ...(opts.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
        },
        include: { category: true },
        orderBy: { name: "asc" },
      });
      return rows.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        model: p.model,
        description: p.description,
        categorySlug: p.category.slug,
        categoryName: p.category.name,
        priceUsd: Number(p.priceUsd),
        hasVat: p.hasVat,
        marginPct: Number(p.marginPct),
        installMinutes: p.installMinutes,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        active: p.active,
      }));
    } catch {
      /* degradar a demo */
    }
  }
  const catByslug = new Map(initialCategories.map((c) => [c.slug, c]));
  return initialProducts
    .filter((p) => (opts.categorySlug ? p.categorySlug === opts.categorySlug : true))
    .map((p) => ({
      id: p.sku,
      sku: p.sku,
      name: p.name,
      brand: p.brand,
      model: p.model ?? null,
      description: p.description ?? null,
      categorySlug: p.categorySlug,
      categoryName: catByslug.get(p.categorySlug)?.name ?? p.categorySlug,
      priceUsd: p.priceUsd,
      hasVat: p.hasVat,
      marginPct: DEFAULT_MARGIN_PCT,
      installMinutes: p.installMinutes,
      stock: 0,
      lowStockThreshold: 3,
      active: true,
    }));
}

export async function getProductBySku(sku: string): Promise<CatalogProduct | null> {
  const all = await listProducts();
  return all.find((p) => p.sku === sku) ?? null;
}

// ---------------------------------------------------------------------------
// Servicios (mano de obra)
// ---------------------------------------------------------------------------

export async function listServices(activeOnly = false): Promise<CatalogService[]> {
  if (hasDatabase()) {
    try {
      const rows = await prisma.service.findMany({
        where: activeOnly ? { active: true } : {},
        orderBy: { name: "asc" },
      });
      return rows.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        priceArs: Number(s.priceArs),
        estimatedMin: s.estimatedMin,
        active: s.active,
      }));
    } catch {
      /* degradar a demo */
    }
  }
  return initialServices.map((s) => ({
    id: s.slug,
    slug: s.slug,
    name: s.name,
    priceArs: s.priceArs,
    estimatedMin: s.estimatedMin,
    active: true,
  }));
}

export async function getServiceBySlug(slug: string): Promise<CatalogService | null> {
  const all = await listServices();
  return all.find((s) => s.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Métodos de pago / financiación
// ---------------------------------------------------------------------------

export async function listPaymentMethods(
  activeOnly = false
): Promise<CatalogPaymentMethod[]> {
  if (hasDatabase()) {
    try {
      const rows = await prisma.paymentMethod.findMany({
        where: activeOnly ? { active: true } : {},
        orderBy: { order: "asc" },
      });
      return rows.map((m) => ({
        id: m.id,
        name: m.name,
        installments: m.installments,
        financingCost: Number(m.financingCost),
        downPaymentPct: Number(m.downPaymentPct),
        active: m.active,
        order: m.order,
      }));
    } catch {
      /* degradar a demo */
    }
  }
  return initialPaymentMethods.map((m, i) => ({
    id: String(i + 1),
    name: m.name,
    installments: m.installments,
    financingCost: m.financingCost,
    downPaymentPct: m.downPaymentPct,
    active: true,
    order: m.order,
  }));
}

// ---------------------------------------------------------------------------
// Paquetes
// ---------------------------------------------------------------------------

export async function listPackages(): Promise<CatalogPackage[]> {
  if (hasDatabase()) {
    try {
      const rows = await prisma.package.findMany({
        where: { active: true },
        include: { items: { include: { product: true } } },
        orderBy: { name: "asc" },
      });
      return rows.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        slug: pkg.slug,
        target: pkg.target,
        description: pkg.description,
        items: pkg.items.map((it) => ({
          productSku: it.product.sku ?? "",
          productName: it.product.name,
          quantity: it.quantity,
        })),
      }));
    } catch {
      /* degradar a demo */
    }
  }
  const productBySku = new Map(initialProducts.map((p) => [p.sku, p]));
  return initialPackages.map((pkg, i) => ({
    id: String(i + 1),
    name: pkg.name,
    slug: pkg.slug,
    target: pkg.target,
    description: pkg.description,
    items: pkg.items.map((it) => ({
      productSku: it.sku,
      productName: productBySku.get(it.sku)?.name ?? it.sku,
      quantity: it.quantity,
    })),
  }));
}
