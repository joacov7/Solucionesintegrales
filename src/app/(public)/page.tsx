import Link from "next/link";
import { Container, LinkButton, Card, Badge, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { serviceAreas, segments, benefits } from "@/config/services";
import { siteConfig, whatsappUrl } from "@/config/site";

export default function HomePage() {
  const wa = whatsappUrl(
    `Hola ${siteConfig.name}, quiero una cotización.`
  );

  return (
    <>
      {/* HERO */}
      <section className="hero-gradient">
        <Container className="py-16 sm:py-24">
          <div className="max-w-3xl animate-fade-in-up">
            <Badge>
              <Icon name="spark" className="h-3.5 w-3.5 text-accent" /> Soluciones
              integrales para hogares y comercios
            </Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Seguridad, energía y tecnología para tu hogar o negocio.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted">
              Instalamos soluciones de seguridad, cámaras, electricidad,
              automatización y energía solar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/cotizar/alarmas" variant="accent" size="lg">
                Cotizar ahora <Icon name="arrow-right" className="h-5 w-5" />
              </LinkButton>
              <LinkButton href={wa} external variant="whatsapp" size="lg">
                <Icon name="whatsapp" className="h-5 w-5" /> Hablar por WhatsApp
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>

      {/* CATEGORÍAS */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Qué hacemos"
            title="Todo lo que tu hogar o comercio necesita, en un solo lugar"
            subtitle="Un equipo, una propuesta, una instalación profesional."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAreas.map((s) => (
              <Link key={s.slug} href={`/${s.slug}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-pop">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-accent">
                    <Icon name={s.icon} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Ver más <Icon name="arrow-right" className="h-4 w-4" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ¿QUÉ NECESITÁS RESOLVER? */}
      <section className="bg-section py-16 sm:py-20">
        <Container>
          <SectionHeading
            center
            eyebrow="Contanos tu caso"
            title="¿Qué necesitás resolver?"
            subtitle="Adaptamos la solución al tipo de espacio."
          />
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {segments.map((seg) => (
              <Link
                key={seg.key}
                href={`/cotizar/alarmas?tipo=${seg.key}`}
                className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-center shadow-card transition-shadow hover:shadow-pop"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-accent">
                  <Icon name={seg.icon} />
                </span>
                <span className="text-sm font-semibold text-ink">{seg.label}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* BENEFICIOS */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Por qué elegirnos"
            title="Hacemos las cosas bien, de principio a fin"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4">
                <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon name="check" className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{b.title}</h3>
                  <p className="mt-1 text-sm text-muted">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA FINAL */}
      <section className="pb-8">
        <Container>
          <div className="overflow-hidden rounded-3xl bg-brand px-6 py-14 text-center text-brand-fg sm:px-12">
            <h2 className="mx-auto max-w-2xl text-2xl font-bold sm:text-3xl">
              Contanos qué necesitás y te preparamos una propuesta.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Presupuesto previo, sin compromiso. Respondemos rápido.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/cotizar/alarmas" variant="accent" size="lg">
                Cotizar ahora <Icon name="arrow-right" className="h-5 w-5" />
              </LinkButton>
              <LinkButton href={wa} external variant="whatsapp" size="lg">
                <Icon name="whatsapp" className="h-5 w-5" /> Escribinos
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
