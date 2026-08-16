import type { Metadata } from "next";
import { Container, Badge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { getQuoterDataset } from "@/data/quoter-data";
import { AlarmWizard } from "@/features/quoter/AlarmWizard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cotizador de alarmas",
  description:
    "Armá tu sistema de alarma Vetti en minutos. Elegí qué proteger y obtené tu solución recomendada con precio y financiación.",
};

export default async function CotizarAlarmasPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const [{ tipo }, dataset] = await Promise.all([
    searchParams,
    getQuoterDataset("alarmas"),
  ]);

  return (
    <>
      <section className="hero-gradient">
        <Container className="py-12 sm:py-14">
          <Badge>
            <Icon name="shield" className="h-4 w-4 text-accent" /> Cotizador de alarmas
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Armá tu sistema de seguridad
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Respondé unas preguntas y te mostramos la solución recomendada con
            precio y opciones de financiación.
          </p>
        </Container>
      </section>

      <section className="pb-28 pt-10 lg:pb-14">
        <Container>
          <AlarmWizard dataset={dataset} initialTarget={tipo} />
        </Container>
      </section>
    </>
  );
}
