"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/features/auth/LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/presupuestos", label: "Presupuestos" },
  { href: "/admin/ordenes", label: "Órdenes de trabajo" },
  { href: "/admin/instaladores", label: "Instaladores" },
  { href: "/admin/instalaciones", label: "Instalaciones" },
  { href: "/admin/leads", label: "Leads / CRM" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/stock", label: "Stock" },
  { href: "/admin/mantenimiento", label: "Mantenimiento" },
  { href: "/admin/servicios", label: "Mano de obra" },
  { href: "/admin/financiacion", label: "Financiación" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-dvh bg-brand-soft">
      {/* Topbar mobile */}
      <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden print:hidden">
        <span className="font-bold text-ink">{siteConfig.name} · Admin</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg"
          aria-label="Menú"
        >
          <Icon name={open ? "x" : "menu"} />
        </button>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-0 lg:px-6 lg:py-6">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-full shrink-0 border-b border-line bg-surface lg:w-60 lg:rounded-2xl lg:border lg:shadow-card print:hidden",
            open ? "block" : "hidden lg:block"
          )}
        >
          <div className="hidden border-b border-line p-5 lg:block">
            <div className="text-sm font-semibold text-ink">{siteConfig.name}</div>
            <div className="text-xs text-muted">Panel administrativo</div>
          </div>
          <nav className="grid gap-1 p-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item)
                    ? "bg-brand text-brand-fg"
                    : "text-muted hover:bg-brand-soft hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/installer"
              className="mt-2 rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-brand-soft"
            >
              📱 App del instalador
            </Link>
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-accent hover:bg-brand-soft"
            >
              ← Ver sitio público
            </Link>
            <LogoutButton />
          </nav>
        </aside>

        {/* Contenido */}
        <main className="min-w-0 flex-1 p-4 lg:p-0">{children}</main>
      </div>
    </div>
  );
}
