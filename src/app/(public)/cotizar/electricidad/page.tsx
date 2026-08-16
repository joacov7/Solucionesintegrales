import type { Metadata } from "next";
import { Container, Badge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { ElectricityForm } from "@/features/quoter/ElectricityForm";

export const metadata: Metadata = {
  title: "Electricidad — Solicitar visita técnica",
  description:
    "Contanos qué necesitás (instalación, tablero, iluminación, cableado, reparación o mantenimiento) y coordinamos una visita técnica.",
};

export default function CotizarElectricidadPage() {
  return (
    <>
      <section className="hero-gradient">
        <Container className="py-12 sm:py-14">
          <Badge>
            <Icon name="bolt" className="h-4 w-4 text-accent" /> Electricidad
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Contanos tu proyecto eléctrico
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            La electricidad se presupuesta con una visita técnica previa, sin cargo.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <ElectricityForm />
        </Container>
      </section>
    </>
  );
}
