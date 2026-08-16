import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Portal de clientes",
  robots: { index: false },
};

/**
 * Portal de clientes — placeholder de la Fase 3.
 * La arquitectura queda preparada para Supabase Auth + rol CUSTOMER, donde
 * cada cliente accederá únicamente a su propia información (presupuestos,
 * instalaciones, garantías y mantenimientos).
 */
export default function ClientPortalPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-brand-soft p-6">
      <div className="max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-fg">
          <Icon name="shield" className="h-7 w-7 text-accent" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-ink">Portal de clientes</h1>
        <p className="mt-2 text-sm text-muted">
          Próximamente vas a poder ver tus presupuestos, instalaciones y garantías
          de {siteConfig.name}. Esta sección se habilitará con acceso seguro
          (Supabase Auth) en una próxima etapa.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
