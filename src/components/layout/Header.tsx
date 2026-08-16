"use client";

import { useState } from "react";
import Link from "next/link";
import { serviceAreas } from "@/config/services";
import { siteConfig, whatsappUrl } from "@/config/site";
import { Logo } from "./Logo";
import { LinkButton } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";

const navServices = serviceAreas.map((s) => ({
  label: s.title,
  href: `/${s.slug}`,
}));

export function Header() {
  const [open, setOpen] = useState(false);
  const wa = whatsappUrl(
    `Hola ${siteConfig.name}, quiero hacer una consulta.`
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navServices.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-brand-soft hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LinkButton href={wa} external variant="whatsapp" size="sm">
            <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
          </LinkButton>
          <LinkButton href="/cotizar/alarmas" variant="accent" size="sm">
            Cotizar ahora
          </LinkButton>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-ink lg:hidden"
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "x" : "menu"} className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <div className="mx-auto grid w-full max-w-6xl gap-1 px-4 py-3 sm:px-6">
            {navServices.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-brand-soft"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <LinkButton href={wa} external variant="whatsapp" size="sm">
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
              </LinkButton>
              <LinkButton href="/cotizar/alarmas" variant="accent" size="sm">
                Cotizar
              </LinkButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
