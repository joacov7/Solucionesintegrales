/**
 * Catálogo de servicios/áreas de la empresa. Alimenta el Home, el menú y las
 * páginas SEO individuales (/alarmas, /camaras, etc.).
 */

export type ServiceArea = {
  slug: string;
  title: string;
  short: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  icon: IconName;
  cta?: { label: string; href: string };
  bullets: string[];
};

export type IconName =
  | "shield"
  | "camera"
  | "bolt"
  | "home"
  | "sun"
  | "wifi"
  | "wrench";

export const serviceAreas: ServiceArea[] = [
  {
    slug: "alarmas",
    title: "Alarmas",
    short: "Sistemas Vetti inalámbricos y control desde el celular.",
    description:
      "Sistemas de alarma Vetti inalámbricos, monitoreables desde tu celular. Sensores de apertura y presencia, sirenas y avisos en tiempo real.",
    seoTitle: "Alarmas Vetti inalámbricas | Instalación profesional",
    seoDescription:
      "Instalación de alarmas Vetti inalámbricas con control desde el celular. Sensores, sirena y notificaciones. Presupuesto online al instante.",
    icon: "shield",
    cta: { label: "Cotizar alarma", href: "/cotizar/alarmas" },
    bullets: [
      "Central Smart Alarm con WiFi/Ethernet",
      "Sensores de apertura y presencia",
      "Control y avisos desde el celular",
      "Sirena y batería de respaldo",
    ],
  },
  {
    slug: "camaras",
    title: "Cámaras",
    short: "Videovigilancia Uniview / Uniarch.",
    description:
      "Cámaras de videovigilancia Uniview y Uniarch para interior y exterior. Grabación con NVR/DVR y acceso remoto desde tu celular.",
    seoTitle: "Cámaras de seguridad Uniview / Uniarch | Videovigilancia",
    seoDescription:
      "Instalación de cámaras Uniview y Uniarch, interior y exterior, WiFi o PoE, con grabación y acceso remoto. Cotizá tu kit online.",
    icon: "camera",
    cta: { label: "Cotizar cámaras", href: "/cotizar/camaras" },
    bullets: [
      "Cámaras interior y exterior",
      "WiFi, PoE, IP o analógicas",
      "Grabación con NVR / DVR",
      "Acceso remoto desde el celular",
    ],
  },
  {
    slug: "electricidad",
    title: "Electricidad",
    short: "Instalaciones, tableros, iluminación y mantenimiento.",
    description:
      "Instalaciones eléctricas, tableros, iluminación, tomacorrientes, cableado, reparaciones y mantenimiento con visita técnica previa.",
    seoTitle: "Instalaciones eléctricas y tableros | Servicio técnico",
    seoDescription:
      "Instalaciones eléctricas, tableros, iluminación, cableado y mantenimiento. Solicitá una visita técnica y recibí un presupuesto.",
    icon: "bolt",
    cta: { label: "Solicitar visita", href: "/cotizar/electricidad" },
    bullets: [
      "Instalaciones y tableros",
      "Iluminación y tomacorrientes",
      "Cableado y reparaciones",
      "Mantenimiento preventivo",
    ],
  },
  {
    slug: "domotica",
    title: "Domótica",
    short: "Automatización de luces, portones, cerraduras y más.",
    description:
      "Automatización del hogar y el comercio: luces, portones, cerraduras inteligentes y dispositivos controlados desde el celular.",
    seoTitle: "Domótica y automatización | Casa inteligente",
    seoDescription:
      "Automatizá luces, portones y cerraduras con domótica. Control desde el celular e integración con tu sistema de seguridad.",
    icon: "home",
    cta: { label: "Consultar por WhatsApp", href: "/contacto" },
    bullets: [
      "Automatización de luces",
      "Portones y cerraduras",
      "Control desde el celular",
      "Integración con alarmas y cámaras",
    ],
  },
  {
    slug: "energia-solar",
    title: "Energía solar",
    short: "Paneles, inversores, baterías y sistemas de respaldo.",
    description:
      "Sistemas de energía solar: paneles, inversores, baterías y respaldo de energía. Estimación preliminar online y evaluación técnica.",
    seoTitle: "Energía solar | Paneles, inversores y respaldo",
    seoDescription:
      "Sistemas de energía solar con paneles, inversores y baterías de respaldo. Estimación preliminar online y evaluación técnica a medida.",
    icon: "sun",
    cta: { label: "Estimar sistema", href: "/cotizar/solar" },
    bullets: [
      "Paneles e inversores",
      "Baterías de respaldo",
      "Ahorro en la factura",
      "Evaluación técnica a medida",
    ],
  },
  {
    slug: "redes",
    title: "Redes",
    short: "WiFi, cableado y conectividad.",
    description:
      "Redes y conectividad: WiFi de alto alcance, cableado estructurado y soluciones para hogares y comercios.",
    seoTitle: "Redes y conectividad | WiFi y cableado estructurado",
    seoDescription:
      "Instalación de redes WiFi, cableado estructurado y conectividad para hogares y comercios. Consultá tu proyecto.",
    icon: "wifi",
    cta: { label: "Consultar por WhatsApp", href: "/contacto" },
    bullets: [
      "WiFi de alto alcance",
      "Cableado estructurado",
      "Redes para comercios",
      "Conectividad estable",
    ],
  },
];

export function getServiceArea(slug: string) {
  return serviceAreas.find((s) => s.slug === slug);
}

/** Segmentos "¿Qué necesitás resolver?" del Home. */
export const segments = [
  { key: "casa", label: "Casa", icon: "home" as IconName },
  { key: "comercio", label: "Comercio", icon: "shield" as IconName },
  { key: "oficina", label: "Oficina", icon: "wifi" as IconName },
  { key: "galpon", label: "Galpón", icon: "camera" as IconName },
  { key: "empresa", label: "Empresa", icon: "bolt" as IconName },
];

/** Beneficios diferenciales del Home. */
export const benefits = [
  { title: "Instalación profesional", desc: "Técnicos capacitados y prolijos." },
  { title: "Presupuesto previo", desc: "Sabés cuánto pagás antes de empezar." },
  { title: "Primeras marcas", desc: "Equipamiento de calidad y confiable." },
  { title: "Configuración completa", desc: "Te lo dejamos funcionando y probado." },
  { title: "Garantía", desc: "Respaldo por escrito en cada instalación." },
  { title: "Servicio técnico", desc: "Mantenimiento y soporte post-venta." },
];
