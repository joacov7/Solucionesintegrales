/**
 * CONFIGURACIÓN CENTRAL DE LA EMPRESA
 * ---------------------------------------------------------------------------
 * Cambiá acá el nombre, logo, colores y datos de contacto. Todo el sitio
 * (público y admin) lee desde este archivo. No hay datos de marca hardcodeados
 * en los componentes.
 *
 * Los colores se inyectan como variables CSS en el layout raíz, así que con
 * cambiar los valores `brand`/`accent` de abajo se actualiza toda la paleta.
 */

export type RGB = readonly [number, number, number];

export const siteConfig = {
  // --- Identidad ---------------------------------------------------------
  name: "Servicios Integrales",
  shortName: "SI",
  tagline: "Seguridad, energía y tecnología para tu hogar o negocio.",
  description:
    "Instalamos soluciones de seguridad, cámaras, electricidad, automatización y energía solar. Presupuesto previo, equipamiento de primeras marcas y garantía.",
  // El logo puede ser una ruta a imagen (/logo.svg) o null para usar el
  // logotipo tipográfico por defecto.
  logo: null as string | null,

  // --- Contacto ----------------------------------------------------------
  contact: {
    phone: "+54 9 11 0000-0000",
    whatsapp: "5491100000000", // solo dígitos, con código de país
    email: "contacto@serviciosintegrales.com.ar",
    address: "Buenos Aires, Argentina",
    locality: "Buenos Aires",
  },

  // --- Redes (opcional) --------------------------------------------------
  social: {
    instagram: "",
    facebook: "",
  },

  // --- Paleta de marca (RGB, sin comas -> se convierten a variables CSS) --
  // Estética tecnológica, moderna y profesional (NO "electricista tradicional").
  colors: {
    brand: [15, 23, 42] as RGB, // slate-900 profundo
    brandFg: [255, 255, 255] as RGB,
    brandSoft: [241, 245, 249] as RGB, // slate-100
    accent: [37, 99, 235] as RGB, // azul tecnológico
    accentFg: [255, 255, 255] as RGB,
    ink: [15, 23, 42] as RGB,
    muted: [100, 116, 139] as RGB,
    surface: [255, 255, 255] as RGB,
    line: [226, 232, 240] as RGB,
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Construye la URL de WhatsApp con un mensaje pre-cargado (no envía solo). */
export function whatsappUrl(message: string, phone: string = siteConfig.contact.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Convierte la paleta en variables CSS para inyectar en <html style="...">. */
export function brandCssVars(): Record<string, string> {
  const c = siteConfig.colors;
  const v = (rgb: RGB) => `${rgb[0]} ${rgb[1]} ${rgb[2]}`;
  return {
    "--brand": v(c.brand),
    "--brand-fg": v(c.brandFg),
    "--brand-soft": v(c.brandSoft),
    "--accent": v(c.accent),
    "--accent-fg": v(c.accentFg),
    "--ink": v(c.ink),
    "--muted": v(c.muted),
    "--surface": v(c.surface),
    "--line": v(c.line),
  };
}
