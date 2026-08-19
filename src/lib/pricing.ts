/**
 * MOTOR DE PRECIOS (lógica de negocio pura, sin acceso a datos ni UI)
 * ---------------------------------------------------------------------------
 * Regla de oro: los COSTOS (USD) están separados de los PRECIOS DE VENTA (ARS).
 * El tipo de cambio y el IVA vienen de `settings`, nunca hardcodeados.
 *
 * La FINANCIACIÓN nunca modifica el margen: el costo financiero se calcula y
 * se muestra por separado del margen/ganancia del producto.
 */

export type PricingContext = {
  /** Tipo de cambio USD → ARS (ej: 1520). */
  dolar: number;
  /** IVA como fracción (ej: 0.21). */
  iva: number;
};

export type ProductPriceInput = {
  priceUsd: number;
  hasVat: boolean;
  /** Markup sobre el costo final, en % (ej: 40 = +40%). */
  marginPct: number;
};

export type ProductPrice = {
  costUsd: number;
  costArsNoVat: number;
  vatAmount: number;
  costArsFinal: number;
  salePrice: number;
  profit: number;
  /** Margen real logrado = ganancia / precio de venta, en %. */
  realMarginPct: number;
};

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Redondeo comercial a múltiplo (para precios "lindos"). */
export function roundToStep(n: number, step = 100): number {
  return Math.round(n / step) * step;
}

/** Calcula el precio de venta de un producto a partir de su costo USD. */
export function computeProductPrice(
  input: ProductPriceInput,
  ctx: PricingContext
): ProductPrice {
  const costUsd = input.priceUsd;
  const costArsNoVat = costUsd * ctx.dolar;
  const vatAmount = input.hasVat ? costArsNoVat * ctx.iva : 0;
  const costArsFinal = costArsNoVat + vatAmount;
  const salePrice = roundToStep(costArsFinal * (1 + input.marginPct / 100), 100);
  const profit = salePrice - costArsFinal;
  const realMarginPct = salePrice > 0 ? (profit / salePrice) * 100 : 0;
  return {
    costUsd: round2(costUsd),
    costArsNoVat: round2(costArsNoVat),
    vatAmount: round2(vatAmount),
    costArsFinal: round2(costArsFinal),
    salePrice: round2(salePrice),
    profit: round2(profit),
    realMarginPct: round2(realMarginPct),
  };
}

// ---------------------------------------------------------------------------
// Financiación
// ---------------------------------------------------------------------------

export type FinancingInput = {
  /** Precio de venta contado (ARS). */
  cashPrice: number;
  /** Costo financiero total sobre el contado (ej: 0.2 = 20%). */
  financingCost: number;
  /** Cantidad de cuotas. */
  installments: number;
  /** Anticipo como fracción del total financiado (ej: 0.3). */
  downPaymentPct: number;
};

export type FinancingResult = {
  cashPrice: number;
  financingCostAmount: number;
  financedTotal: number;
  downPayment: number;
  balance: number;
  installments: number;
  installmentValue: number;
};

/**
 * Calcula la financiación SIN tocar el margen del producto.
 * `financingCostAmount` es lo que el cliente paga de más por financiar;
 * el margen/ganancia del producto (calculado en computeProductPrice) no cambia.
 */
export function computeFinancing(input: FinancingInput): FinancingResult {
  const cashPrice = input.cashPrice;
  const financedTotal = roundToStep(cashPrice * (1 + input.financingCost), 100);
  const financingCostAmount = financedTotal - cashPrice;
  const downPayment = roundToStep(financedTotal * input.downPaymentPct, 100);
  const balance = financedTotal - downPayment;
  const installments = Math.max(1, input.installments);
  const installmentValue =
    installments > 0 ? roundToStep(balance / installments, 100) : balance;
  return {
    cashPrice: round2(cashPrice),
    financingCostAmount: round2(financingCostAmount),
    financedTotal: round2(financedTotal),
    downPayment: round2(downPayment),
    balance: round2(balance),
    installments,
    installmentValue: round2(installmentValue),
  };
}

// ---------------------------------------------------------------------------
// Totales de presupuesto
// ---------------------------------------------------------------------------

export type QuoteLine = {
  quantity: number;
  unitCost: number; // costo interno unitario (ARS)
  unitSale: number; // precio de venta unitario (ARS)
};

export type QuoteTotals = {
  costTotal: number;
  saleSubtotal: number;
  discountAmount: number;
  saleTotal: number;
  profit: number;
  marginPct: number;
};

export function computeQuoteTotals(
  lines: QuoteLine[],
  discountPct = 0
): QuoteTotals {
  const costTotal = lines.reduce((a, l) => a + l.unitCost * l.quantity, 0);
  const saleSubtotal = lines.reduce((a, l) => a + l.unitSale * l.quantity, 0);
  const discountAmount = saleSubtotal * (discountPct / 100);
  const saleTotal = saleSubtotal - discountAmount;
  const profit = saleTotal - costTotal;
  const marginPct = saleTotal > 0 ? (profit / saleTotal) * 100 : 0;
  return {
    costTotal: round2(costTotal),
    saleSubtotal: round2(saleSubtotal),
    discountAmount: round2(discountAmount),
    saleTotal: round2(saleTotal),
    profit: round2(profit),
    marginPct: round2(marginPct),
  };
}

// ---------------------------------------------------------------------------
// Formato de moneda (ARS)
// ---------------------------------------------------------------------------

const arsFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatArs(n: number): string {
  return arsFormatter.format(n);
}
