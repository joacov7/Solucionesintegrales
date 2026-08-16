"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui";
import { siteConfig, whatsappUrl } from "@/config/site";
import { submitLead } from "@/app/actions/leads";

const SERVICES = [
  "Instalación eléctrica",
  "Tablero",
  "Iluminación",
  "Tomacorrientes",
  "Cableado",
  "Reparación",
  "Mantenimiento",
  "Otro",
];

export function ElectricityForm() {
  const [selected, setSelected] = useState<string[]>([]);
  const [f, setF] = useState({
    description: "",
    meters: "",
    points: "",
    address: "",
    name: "",
    phone: "",
    locality: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const toggle = (s: string) =>
    setSelected((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]
    );

  const waMessage = useMemo(
    () =>
      [
        `*${siteConfig.name}* — Solicitud de visita técnica (Electricidad)`,
        "",
        selected.length ? `*Servicios:* ${selected.join(", ")}` : "",
        f.description ? `*Detalle:* ${f.description}` : "",
        f.meters ? `*Metros aprox.:* ${f.meters}` : "",
        f.points ? `*Puntos:* ${f.points}` : "",
        f.address ? `*Dirección:* ${f.address}` : "",
        f.name ? `*Nombre:* ${f.name}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [selected, f]
  );

  async function handleSubmit() {
    setStatus("sending");
    await submitLead({
      name: f.name || "Sin nombre",
      phone: f.phone,
      locality: f.locality,
      service: `Electricidad: ${selected.join(", ") || "Consulta"}`,
      source: "cotizador-electricidad",
      payload: { selected, ...f },
    });
    setStatus("done");
    window.open(whatsappUrl(waMessage), "_blank");
  }

  const input =
    "h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-accent focus:outline-none";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h2 className="text-lg font-semibold text-ink">¿Qué necesitás?</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selected.includes(s)
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line bg-surface text-ink hover:border-accent/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">
            Contanos el trabajo
          </label>
          <textarea
            rows={4}
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
            placeholder="Ej: necesito renovar el tablero y agregar tomas en la cocina…"
            className="w-full rounded-xl border border-line p-3 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Metros aproximados
            </label>
            <input
              value={f.meters}
              onChange={(e) => setF({ ...f, meters: e.target.value })}
              className={input}
              inputMode="numeric"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Cantidad de puntos
            </label>
            <input
              value={f.points}
              onChange={(e) => setF({ ...f, points: e.target.value })}
              className={input}
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Dirección</label>
          <input
            value={f.address}
            onChange={(e) => setF({ ...f, address: e.target.value })}
            className={input}
          />
        </div>

        <div className="rounded-xl bg-brand-soft p-3 text-xs text-muted">
          Podés enviarnos fotos del lugar por WhatsApp para agilizar la visita.
        </div>
      </div>

      <aside>
        <div className="sticky top-20 rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 text-accent">
            <Icon name="bolt" className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Visita técnica
            </span>
          </div>
          <p className="mt-3 text-sm text-muted">
            La electricidad se presupuesta después de evaluar el lugar. Coordinamos
            una visita sin cargo.
          </p>

          <div className="mt-4 space-y-2">
            <input
              placeholder="Tu nombre"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              className={input}
            />
            <input
              placeholder="Teléfono / WhatsApp"
              value={f.phone}
              onChange={(e) => setF({ ...f, phone: e.target.value })}
              className={input}
            />
            <input
              placeholder="Localidad"
              value={f.locality}
              onChange={(e) => setF({ ...f, locality: e.target.value })}
              className={input}
            />
          </div>

          <Button
            variant="whatsapp"
            size="lg"
            className="mt-4 w-full"
            onClick={handleSubmit}
            disabled={status === "sending"}
          >
            <Icon name="whatsapp" className="h-5 w-5" />
            {status === "sending" ? "Enviando…" : "Solicitar visita técnica"}
          </Button>
          {status === "done" && (
            <p className="mt-2 text-center text-xs font-medium text-accent">
              ¡Listo! Coordinamos la visita.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
