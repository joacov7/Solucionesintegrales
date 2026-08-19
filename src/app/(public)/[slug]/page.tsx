import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, LinkButton, Card, Badge, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { serviceAreas, getServiceArea } from "@/config/services";
import { siteConfig, whatsappUrl } from "@/config/site";

export function generateStaticParams() {
  return serviceAreas.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) return {};
  return {
    title: area.seoTitle,
    description: area.seoDescription,
    alternates: { canonical: `/${area.slug}` },
    openGraph: { title: area.seoTitle, description: area.seoDescription },
  };
}

export default async function ServiceAreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) notFound();

  const wa = whatsappUrl(
    `Hola ${siteConfig.name}, quiero información sobre ${area.title}.`
  );
  const others = serviceAreas.filter((s) => s.slug !== area.slug);

  return (
    <>
      <section className="hero-gradient">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <Badge>
              <span className="text-accent">
                <Icon name={area.icon} className="h-4 w-4" />
              </span>
              {area.title}
            </Badge>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              {area.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{area.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {area.cta && (
                <LinkButton href={area.cta.href} variant="accent" size="lg">
                  {area.cta.label} <Icon name="arrow-right" className="h-5 w-5" />
                </LinkButton>
              )}
              <LinkButton href={wa} external variant="whatsapp" size="lg">
                <Icon name="whatsapp" className="h-5 w-5" /> Consultar
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {area.bullets.map((b) => (
              <div
                key={b}
                className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 shadow-card"
              >
                <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Icon name="check" className="h-5 w-5" />
                </span>
                <span className="font-medium text-ink">{b}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-section py-16">
        <Container>
          <SectionHeading eyebrow="Seguimos" title="Otras soluciones" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => (
              <a key={s.slug} href={`/${s.slug}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-pop">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-accent">
                    <Icon name={s.icon} />
                  </div>
                  <h3 className="mt-4 font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.short}</p>
                </Card>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
