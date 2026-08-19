import Link from "next/link";
import { siteConfig } from "@/config/site";
import { serviceAreas } from "@/config/services";
import { Container } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="mt-24 bg-brand text-brand-fg">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="text-xl font-bold">{siteConfig.name}</div>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Servicios
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {serviceAreas.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="text-white/80 hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Contacto
            </div>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 text-accent" />
                {siteConfig.contact.phone}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="mail" className="h-4 w-4 text-accent" />
                {siteConfig.contact.email}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="home" className="h-4 w-4 text-accent" />
                {siteConfig.contact.address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}. Todos los derechos
            reservados.
          </span>
          <Link href="/admin" className="hover:text-white/80">
            Panel administrativo
          </Link>
        </div>
      </Container>
    </footer>
  );
}
