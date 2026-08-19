import type { Metadata } from "next";
import { Container, Badge, LinkButton } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { ContactForm } from "@/features/quoter/ContactForm";
import { siteConfig, whatsappUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribinos por WhatsApp, teléfono o email. Te asesoramos sin compromiso.",
};

export default function ContactoPage() {
  const wa = whatsappUrl(`Hola ${siteConfig.name}, quiero una consulta.`);
  return (
    <>
      <section className="hero-gradient">
        <Container className="py-12 sm:py-14">
          <Badge>
            <Icon name="phone" className="h-4 w-4 text-accent" /> Contacto
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Hablemos de tu proyecto
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Contanos qué necesitás y te preparamos una propuesta.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <aside className="space-y-4">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card hover:shadow-pop"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                  <Icon name="whatsapp" />
                </span>
                <div>
                  <div className="font-semibold text-ink">WhatsApp</div>
                  <div className="text-sm text-muted">{siteConfig.contact.phone}</div>
                </div>
              </a>
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-accent">
                  <Icon name="mail" />
                </span>
                <div>
                  <div className="font-semibold text-ink">Email</div>
                  <div className="text-sm text-muted">{siteConfig.contact.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-accent">
                  <Icon name="home" />
                </span>
                <div>
                  <div className="font-semibold text-ink">Zona</div>
                  <div className="text-sm text-muted">{siteConfig.contact.address}</div>
                </div>
              </div>
              <LinkButton href="/cotizar/alarmas" variant="accent" className="w-full">
                Cotizar ahora
              </LinkButton>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
