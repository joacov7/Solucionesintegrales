import type { Metadata } from "next";
import { Container, Badge } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { CameraWizard } from "@/features/quoter/CameraWizard";

export const metadata: Metadata = {
  title: "Cotizador de cámaras",
  description:
    "Configurá tu sistema de videovigilancia Uniview / Uniarch: cantidad, interior/exterior, WiFi o PoE, grabador y disco. Te cotizamos a medida.",
};

export default function CotizarCamarasPage() {
  return (
    <>
      <section className="hero-gradient">
        <Container className="py-12 sm:py-14">
          <Badge>
            <Icon name="camera" className="h-4 w-4 text-accent" /> Cotizador de cámaras
          </Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Videovigilancia Uniview / Uniarch
          </h1>
          <p className="mt-3 max-w-2xl text-muted">
            Elegí la configuración que necesitás y te preparamos el presupuesto.
          </p>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <CameraWizard />
        </Container>
      </section>
    </>
  );
}
