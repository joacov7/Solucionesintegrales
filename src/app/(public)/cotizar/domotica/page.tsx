import type { Metadata } from "next";
import { Container, Badge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { DomoticaForm } from "@/features/quoter/DomoticaForm";

export const metadata: Metadata = {
  title: "Domótica — Consultá tu proyecto",
  description:
    "Automatizá luces, portones, cerraduras y más. Contanos qué querés controlar y te asesoramos sin cargo.",
};

export default function CotizarDomoticaPage() {
  return (
    <>
      <section className="hero-gradient">
        <Container className="py-12 sm:py-14">
          <Badge>
            <Icon name="home" className="h-4 w-4 text-accent" /> Domótica
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Automatizá tu hogar o comercio
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Controlá luces, portones y cerraduras desde el celular, integrado con
            tu sistema de seguridad.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <DomoticaForm />
        </Container>
      </section>
    </>
  );
}
