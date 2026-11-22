"use client";

import { motion } from "framer-motion";
import {
  Button,
  Badge,
  Card,
  Input,
  Textarea,
  Select,
  Field,
  Label,
  Separator,
  Skeleton,
  Spinner,
  Kbd,
} from "@/components/ui";
import { toast } from "@/components/ui/toast";
import { AdminHeading } from "@/components/admin/ui";

const SWATCHES = [
  ["brand", "bg-brand"],
  ["accent", "bg-accent"],
  ["ink", "bg-ink"],
  ["muted", "bg-muted"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["danger", "bg-danger"],
  ["brand-soft", "bg-brand-soft"],
] as const;

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="max-w-4xl">
      <AdminHeading
        title="Design System"
        subtitle="Guía viva de tokens y componentes. Base del rediseño visual."
      />

      <Block title="Colores / tokens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SWATCHES.map(([name, cls]) => (
            <div key={name} className="rounded-xl border border-line p-2">
              <div className={`h-12 w-full rounded-lg ${cls}`} />
              <div className="mt-2 text-xs font-medium text-ink">{name}</div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Tipografía">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-ink">Display · 4xl</h1>
          <h2 className="text-2xl font-bold tracking-tight text-ink">Título · 2xl</h2>
          <p className="text-base text-ink">Cuerpo · base — texto principal.</p>
          <p className="text-sm text-muted">Secundario · sm — texto de apoyo.</p>
        </div>
      </Block>

      <Block title="Botones">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primario</Button>
          <Button variant="accent">Acento</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Peligro</Button>
          <Button variant="whatsapp">WhatsApp</Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button loading>Cargando</Button>
          <Button disabled>Deshabilitado</Button>
        </div>
      </Block>

      <Block title="Badges / estados">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="accent">Acento</Badge>
          <Badge tone="success">Aceptado</Badge>
          <Badge tone="warning">Pendiente</Badge>
          <Badge tone="danger">Rechazado</Badge>
          <Badge tone="outline">Outline</Badge>
        </div>
      </Block>

      <Block title="Formularios">
        <div className="grid max-w-lg gap-4">
          <Field label="Nombre" hint="Como figura en el presupuesto.">
            <Input placeholder="Juan Pérez" />
          </Field>
          <Field label="Tipo de cliente">
            <Select defaultValue="">
              <option value="" disabled>
                Elegí una opción
              </option>
              <option>Particular</option>
              <option>Comercio</option>
              <option>Empresa</option>
            </Select>
          </Field>
          <Field label="Email" error="Email inválido.">
            <Input defaultValue="no-es-un-email" />
          </Field>
          <Field label="Notas">
            <Textarea rows={3} placeholder="Observaciones…" />
          </Field>
        </div>
      </Block>

      <Block title="Tarjetas">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <div className="font-semibold text-ink">Tarjeta estándar</div>
            <p className="mt-1 text-sm text-muted">Superficie con borde y sombra.</p>
          </Card>
          <Card interactive>
            <div className="font-semibold text-ink">Tarjeta interactiva</div>
            <p className="mt-1 text-sm text-muted">Se eleva al pasar el mouse.</p>
          </Card>
        </div>
      </Block>

      <Block title="Feedback">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => toast.success("¡Guardado!")}>
            Toast éxito
          </Button>
          <Button variant="outline" onClick={() => toast.error("Algo falló.")}>
            Toast error
          </Button>
          <Button
            variant="outline"
            onClick={() => toast("Presupuesto enviado", { description: "Por WhatsApp a Juan Pérez" })}
          >
            Toast con detalle
          </Button>
          <Spinner className="text-accent" />
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </div>
      </Block>

      <Block title="Carga (skeletons)">
        <div className="grid max-w-md gap-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </Block>

      <Block title="Movimiento">
        <Separator className="mb-4" />
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="flex h-20 flex-1 items-center justify-center rounded-xl bg-brand-soft text-sm font-medium text-ink"
            >
              Fade {i + 1}
            </motion.div>
          ))}
        </div>
      </Block>
    </div>
  );
}
