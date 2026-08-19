import { siteConfig, whatsappUrl } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

/** Botón flotante de WhatsApp, presente en toda la plataforma pública. */
export function WhatsAppFloat() {
  const href = whatsappUrl(`Hola ${siteConfig.name}, quiero más información.`);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-pop transition-transform hover:scale-105"
    >
      <Icon name="whatsapp" className="h-7 w-7" />
    </a>
  );
}
