/**
 * Prepara el dataset de los cotizadores: toma el catálogo (DB o demo), calcula
 * los precios de venta con el motor de precios y los deja listos para el wizard.
 * Los precios SIEMPRE se calculan acá (servidor), nunca en el componente.
 */

import {
  listProducts,
  listServices,
  listPaymentMethods,
  getPricingContext,
  getDefaultMargin,
} from "./catalog";
import { computeProductPrice } from "@/lib/pricing";
import type { QuoterDataset } from "@/features/quoter/types";

export async function getQuoterDataset(
  categorySlug?: string
): Promise<QuoterDataset> {
  const [products, services, paymentMethods, ctx, defaultMargin] =
    await Promise.all([
      listProducts({ activeOnly: true, categorySlug }),
      listServices(true),
      listPaymentMethods(true),
      getPricingContext(),
      getDefaultMargin(),
    ]);

  return {
    products: products.map((p) => {
      const price = computeProductPrice(
        {
          priceUsd: p.priceUsd,
          hasVat: p.hasVat,
          marginPct: p.marginPct || defaultMargin,
        },
        ctx
      );
      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        installMinutes: p.installMinutes,
        unitCost: price.costArsFinal,
        salePrice: price.salePrice,
      };
    }),
    services: services.map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      priceArs: s.priceArs,
    })),
    paymentMethods: paymentMethods.map((m) => ({
      id: m.id,
      name: m.name,
      installments: m.installments,
      financingCost: m.financingCost,
      downPaymentPct: m.downPaymentPct,
    })),
  };
}
