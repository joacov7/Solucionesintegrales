/**
 * DATOS INICIALES (fuente única de verdad para el seed)
 * ---------------------------------------------------------------------------
 * - `prisma/seed.ts` usa estos datos para poblar la base PostgreSQL.
 * - El modo demo (sin DATABASE_URL) los usa como catálogo de solo lectura,
 *   así el sitio y los cotizadores funcionan sin base configurada.
 *
 * REGLAS:
 * - Los precios de productos Vetti están en USD y SIN IVA (tal cual la lista).
 * - NO se inventan productos ni precios: solo los de la lista proporcionada.
 * - Cámaras Uniview/Uniarch: la lista proporcionada no incluía precios, así que
 *   la categoría queda creada pero sin productos. Se cargan desde Admin cuando
 *   estén los precios reales (el cotizador de cámaras lo contempla).
 */

export const DEFAULT_MARGIN_PCT = 40; // markup por defecto sobre el costo final

// --- Configuración inicial (settings) --------------------------------------
export const initialSettings = [
  { key: "dolar", value: "1520", label: "Tipo de cambio USD → ARS" },
  { key: "iva", value: "0.21", label: "IVA (fracción, 0.21 = 21%)" },
  {
    key: "default_margin_pct",
    value: String(DEFAULT_MARGIN_PCT),
    label: "Margen (markup) por defecto %",
  },
  { key: "quote_validity_days", value: "15", label: "Validez del presupuesto (días)" },
];

// --- Categorías ------------------------------------------------------------
export const initialCategories = [
  { name: "Alarmas Vetti", slug: "alarmas", order: 1 },
  { name: "Cámaras Uniview / Uniarch", slug: "camaras", order: 2 },
  { name: "Energía y accesorios", slug: "energia-accesorios", order: 3 },
];

// --- Productos (solo los de la lista, precios USD sin IVA) ------------------
export type SeedProduct = {
  sku: string;
  name: string;
  brand: string;
  model?: string;
  categorySlug: string;
  priceUsd: number;
  hasVat: boolean;
  installMinutes: number;
  description?: string;
};

export const initialProducts: SeedProduct[] = [
  {
    sku: "VET-KIT-STD",
    name: "Kit Smart Alarm Standard Ethernet/WiFi",
    brand: "Vetti",
    model: "Smart Alarm Standard",
    categorySlug: "alarmas",
    priceUsd: 125,
    hasVat: true,
    installMinutes: 120,
    description:
      "Incluye: Panel Smart Alarm, Smart Control 4 botones, Smart apertura, Smart presencia y Sirena.",
  },
  { sku: "VET-APE-PLUS", name: "Sensor Smart Apertura PLUS", brand: "Vetti", categorySlug: "alarmas", priceUsd: 10, hasVat: true, installMinutes: 20 },
  { sku: "VET-APE-LRSHOX", name: "Sensor Smart Apertura LR-Shox PRO", brand: "Vetti", categorySlug: "alarmas", priceUsd: 19, hasVat: true, installMinutes: 20 },
  { sku: "VET-PRES-LR", name: "Smart Sensor de presencia LR", brand: "Vetti", categorySlug: "alarmas", priceUsd: 29, hasVat: true, installMinutes: 25 },
  { sku: "VET-TEC-RF", name: "Smart teclado RF", brand: "Vetti", categorySlug: "alarmas", priceUsd: 42, hasVat: true, installMinutes: 20 },
  { sku: "VET-CTRL-4", name: "Control remoto 4 botones", brand: "Vetti", categorySlug: "alarmas", priceUsd: 7, hasVat: true, installMinutes: 5 },
  { sku: "VET-CTRL-8", name: "Control remoto 8 botones", brand: "Vetti", categorySlug: "alarmas", priceUsd: 11, hasVat: true, installMinutes: 5 },
  { sku: "VET-SIR-12V", name: "Sirena 12V", brand: "Vetti", categorySlug: "alarmas", priceUsd: 10, hasVat: true, installMinutes: 20 },
  { sku: "VET-KIT-SIR-INAL", name: "Kit Smart sirena inalámbrica", brand: "Vetti", categorySlug: "alarmas", priceUsd: 31, hasVat: true, installMinutes: 25 },
  { sku: "VET-MOD-SIR-INAL", name: "Smart módulo sirena inalámbrica", brand: "Vetti", categorySlug: "alarmas", priceUsd: 22, hasVat: true, installMinutes: 20 },
  { sku: "VET-MOD-ONOFF", name: "Smart módulo ON/OFF/PULSO", brand: "Vetti", categorySlug: "alarmas", priceUsd: 31, hasVat: true, installMinutes: 30 },
  { sku: "VET-BAT-GEL", name: "Batería de gel 12V 1.3A", brand: "Vetti", categorySlug: "energia-accesorios", priceUsd: 14, hasVat: true, installMinutes: 5 },
  { sku: "VET-FUE-12V", name: "Fuente 12V 1.5A", brand: "Vetti", categorySlug: "energia-accesorios", priceUsd: 12, hasVat: true, installMinutes: 5 },
  { sku: "VET-PILA-CR2032", name: "Pila CR2032", brand: "Vetti", categorySlug: "energia-accesorios", priceUsd: 2.5, hasVat: true, installMinutes: 0 },
  { sku: "VET-PILA-AA", name: "Pila AA", brand: "Vetti", categorySlug: "energia-accesorios", priceUsd: 2, hasVat: true, installMinutes: 0 },
];

// --- Mano de obra / servicios ----------------------------------------------
// NOTA: la lista proporcionada no incluía precios de mano de obra. Estos son
// valores por defecto EDITABLES desde Admin, no precios definitivos.
export type SeedService = {
  slug: string;
  name: string;
  priceArs: number;
  estimatedMin: number;
};

export const initialServices: SeedService[] = [
  { slug: "inst-sensor-apertura", name: "Instalación sensor de apertura", priceArs: 12000, estimatedMin: 20 },
  { slug: "inst-sensor-presencia", name: "Instalación sensor de presencia", priceArs: 15000, estimatedMin: 25 },
  { slug: "inst-camara", name: "Instalación cámara", priceArs: 25000, estimatedMin: 45 },
  { slug: "inst-sirena", name: "Instalación sirena", priceArs: 12000, estimatedMin: 20 },
  { slug: "inst-central", name: "Instalación central", priceArs: 30000, estimatedMin: 60 },
  { slug: "configuracion", name: "Configuración", priceArs: 15000, estimatedMin: 30 },
  { slug: "visita-tecnica", name: "Visita técnica", priceArs: 10000, estimatedMin: 30 },
  { slug: "cableado", name: "Cableado", priceArs: 18000, estimatedMin: 60 },
  { slug: "inst-electrica", name: "Instalación eléctrica", priceArs: 35000, estimatedMin: 120 },
];

// --- Métodos de pago / financiación ----------------------------------------
// Los costos financieros son EJEMPLOS editables desde Admin. No son tasas fijas.
export type SeedPaymentMethod = {
  name: string;
  installments: number;
  financingCost: number; // fracción sobre el precio contado
  downPaymentPct: number; // fracción de anticipo
  order: number;
};

export const initialPaymentMethods: SeedPaymentMethod[] = [
  { name: "Contado", installments: 1, financingCost: 0, downPaymentPct: 0, order: 1 },
  { name: "3 cuotas", installments: 3, financingCost: 0.1, downPaymentPct: 0, order: 2 },
  { name: "6 cuotas", installments: 6, financingCost: 0.2, downPaymentPct: 0, order: 3 },
  { name: "9 cuotas", installments: 9, financingCost: 0.3, downPaymentPct: 0, order: 4 },
  { name: "12 cuotas", installments: 12, financingCost: 0.4, downPaymentPct: 0, order: 5 },
];

// --- Paquetes / kits (configurables, referencian productos por SKU) --------
export type SeedPackage = {
  name: string;
  slug: string;
  target: string;
  description: string;
  items: { sku: string; quantity: number }[];
};

export const initialPackages: SeedPackage[] = [
  {
    name: "Kit Departamento",
    slug: "kit-departamento",
    target: "Departamento",
    description: "Protección esencial para un departamento.",
    items: [
      { sku: "VET-KIT-STD", quantity: 1 },
      { sku: "VET-APE-PLUS", quantity: 2 },
    ],
  },
  {
    name: "Kit Casa",
    slug: "kit-casa",
    target: "Casa",
    description: "Cobertura completa para una casa familiar.",
    items: [
      { sku: "VET-KIT-STD", quantity: 1 },
      { sku: "VET-APE-PLUS", quantity: 3 },
      { sku: "VET-PRES-LR", quantity: 1 },
    ],
  },
  {
    name: "Kit Casa Plus",
    slug: "kit-casa-plus",
    target: "Casa",
    description: "Máxima cobertura con presencia y sirena adicional.",
    items: [
      { sku: "VET-KIT-STD", quantity: 1 },
      { sku: "VET-APE-PLUS", quantity: 4 },
      { sku: "VET-PRES-LR", quantity: 2 },
      { sku: "VET-KIT-SIR-INAL", quantity: 1 },
    ],
  },
  {
    name: "Kit Comercio",
    slug: "kit-comercio",
    target: "Comercio",
    description: "Seguridad para locales comerciales.",
    items: [
      { sku: "VET-KIT-STD", quantity: 1 },
      { sku: "VET-APE-LRSHOX", quantity: 3 },
      { sku: "VET-PRES-LR", quantity: 2 },
      { sku: "VET-TEC-RF", quantity: 1 },
    ],
  },
  {
    name: "Kit Comercio Plus",
    slug: "kit-comercio-plus",
    target: "Comercio",
    description: "Cobertura reforzada para comercios grandes.",
    items: [
      { sku: "VET-KIT-STD", quantity: 1 },
      { sku: "VET-APE-LRSHOX", quantity: 5 },
      { sku: "VET-PRES-LR", quantity: 3 },
      { sku: "VET-TEC-RF", quantity: 1 },
      { sku: "VET-KIT-SIR-INAL", quantity: 1 },
    ],
  },
];

// --- Checklist estándar de instalación de alarma ---------------------------
export const alarmChecklistTemplate = [
  "Central instalada",
  "Alimentación conectada",
  "Batería instalada",
  "Sensor 1 instalado",
  "Sensor 2 instalado",
  "Sensor 3 instalado",
  "Sensor de presencia instalado",
  "Sirena instalada",
  "App configurada",
  "Usuarios configurados",
  "Prueba de armado",
  "Prueba de disparo",
  "Prueba de notificación",
  "Cliente capacitado",
];
