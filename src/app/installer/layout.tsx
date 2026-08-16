import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "App del instalador",
  robots: { index: false },
};

/**
 * Layout de la app del instalador (mobile-first).
 * NOTA: en Fase 1/2 no hay autenticación. Con Supabase Auth, cada instalador
 * verá únicamente las órdenes asignadas a su usuario (rol INSTALLER).
 */
export default function InstallerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-brand-soft">
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link href="/installer" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-brand-fg">
              <Icon name="wrench" className="h-4 w-4 text-accent" />
            </span>
            <span className="text-sm font-bold text-ink">
              {siteConfig.shortName} · Instalador
            </span>
          </Link>
          <Link href="/admin" className="text-xs font-medium text-muted">
            Admin
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-5">{children}</main>
    </div>
  );
}
