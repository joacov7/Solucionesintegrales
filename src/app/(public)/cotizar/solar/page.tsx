import type { Metadata } from "next";
import { Container, Badge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { SolarEstimator } from "@/features/quoter/SolarEstimator";

export const metadata: Metadata = {
  title: "Cotizador solar — Estimación preliminar",
  description:
    "Estimá tu sistema de energía solar: potencia, paneles e inversor según tu consumo. La propuesta final requiere evaluación técnica.",
};

export default function CotizarSolarPage() {
  return (
    <>
      <section className="hero-gradient">
        <Container className="py-12 sm:py-14">
          <Badge>
            <Icon name="sun" className="h-4 w-4 text-accent" /> Energía solar
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Estimá tu sistema solar
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Una estimación preliminar en base a tu consumo. Después coordinamos la
            evaluación técnica para la propuesta final.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <SolarEstimator />
        </Container>
      </section>
    </>
  );
}
