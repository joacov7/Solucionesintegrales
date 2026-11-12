"use client";

import { siteConfig, whatsappUrl } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

export function ClientPortal() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-line bg-surface p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-fg">
          <Icon name="shield" className="h-7 w-7 text-accent" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-ink">Portal de clientes</h1>
        <p className="mt-2 text-sm text-muted">
          Estamos preparando el acceso privado para que puedas consultar tus presupuestos,
          instalaciones, garantías y mantenimientos de forma segura.
        </p>
        <p className="mt-4 text-sm text-muted">
          Mientras tanto, podés solicitar información directamente por WhatsApp.
        </p>
        <a
          href={whatsappUrl(`Hola ${siteConfig.name}, quisiera consultar por mi cuenta.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-fg"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
