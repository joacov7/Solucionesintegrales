/** Tipos compartidos por los cotizadores (cliente y servidor). */

export type PricedProduct = {
  id: string;
  sku: string | null;
  name: string;
  brand: string | null;
  installMinutes: number;
  unitCost: number; // costo interno (ARS)
  salePrice: number; // precio de venta (ARS)
};

export type PricedService = {
  id: string;
  slug: string;
  name: string;
  priceArs: number;
};

export type PricedPaymentMethod = {
  id: string;
  name: string;
  installments: number;
  financingCost: number;
  downPaymentPct: number;
};

/** Dataset que el servidor pasa al wizard (precios ya calculados desde la DB). */
export type QuoterDataset = {
  products: PricedProduct[];
  services: PricedService[];
  paymentMethods: PricedPaymentMethod[];
};

/** Un renglón de la solución recomendada (vende soluciones, no componentes). */
export type SolutionLine = {
  label: string; // descripción comercial
  quantity: number;
  unitSale: number;
  unitCost: number;
  kind: "product" | "service";
};

export type Solution = {
  title: string;
  lines: SolutionLine[];
  notes: string[]; // avisos (ej: cámaras se cotizan aparte)
  costTotal: number;
  saleTotal: number;
  profit: number;
};

// --- Respuestas del wizard de alarmas --------------------------------------
export type AlarmAnswers = {
  target: "casa" | "comercio" | "oficina" | "galpon" | null;
  openings: number | null; // 1..6 (6 = "6+")
  wantsMovement: boolean | null;
  cameras: number | null; // 0,1,2,4,6 (6 = "6+")
  automation: ("porton" | "luces" | "cerradura")[];
};

export const emptyAlarmAnswers: AlarmAnswers = {
  target: null,
  openings: null,
  wantsMovement: null,
  cameras: null,
  automation: [],
};
