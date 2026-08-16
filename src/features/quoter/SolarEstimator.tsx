"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui";
import { OptionCard, PillOption, StepTitle } from "./components/parts";
import { estimateSolar } from "./solar-logic";
import { siteConfig, whatsappUrl } from "@/config/site";
import { submitLead } from "@/app/actions/leads";

const CONSUMOS = [
  { label: "200 kWh", value: 200 },
  { label: "300 kWh", value: 300 },
  { label: "500 kWh", value: 500 },
  { label: "700 kWh", value: 700 },
  { label: "1000 kWh", value: 1000 },
  { label: "+1000 kWh", value: 1200 },
];

export function SolarEstimator() {
  const [monthlyKwh, setMonthlyKwh] = useState(500);
  const [wantsBackup, setWantsBackup] = useState<boolean | null>(null);
  const [hasRoofSpace, setHasRoofSpace] = useState<boolean | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", locality: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const est = useMemo(
    () =>
      estimateSolar({
        monthlyKwh,
        wantsBackup: wantsBackup ?? false,
        hasRoofSpace: hasRoofSpace ?? true,
      }),
    [monthlyKwh, wantsBackup, hasRoofSpace]
  );

  const waMessage = useMemo(
    () =>
      [
        `*${siteConfig.name}* — Solicitud de evaluación solar`,
        "",
        `*Consumo mensual:* ~${monthlyKwh} kWh`,
        `*Respaldo:* ${wantsBackup ? "Sí" : "No"}`,
        `*Espacio en techo:* ${hasRoofSpace ? "Sí" : "No"}`,
        "",
        `*Estimación preliminar:* ${est.systemKwp} kWp · ${est.panels} paneles · inversor ${est.inverterKw} kW`,
        form.name ? `*Nombre:* ${form.name}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [monthlyKwh, wantsBackup, hasRoofSpace, est, form]
  );

  async function handleSubmit() {
    setStatus("sending");
    await submitLead({
      name: form.name || "Sin nombre",
      phone: form.phone,
      locality: form.locality,
      service: "Energía solar",
      source: "cotizador-solar",
      payload: { monthlyKwh, wantsBackup, hasRoofSpace, estimate: est },
    });
    setStatus("done");
    window.open(whatsappUrl(waMessage), "_blank");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div>
          <StepTitle>¿Cuánto consumís por mes?</StepTitle>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {CONSUMOS.map((c) => (
              <PillOption
                key={c.value}
                selected={monthlyKwh === c.value}
                onClick={() => setMonthlyKwh(c.value)}
              >
                <span className="text-base">{c.label}</span>
              </PillOption>
            ))}
          </div>
        </div>

        <div>
          <StepTitle>¿Querés respaldo cuando se corta la luz?</StepTitle>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <OptionCard
              selected={wantsBackup === true}
              onClick={() => setWantsBackup(true)}
              title="Sí"
              subtitle="Con baterías de respaldo"
            />
            <OptionCard
              selected={wantsBackup === false}
              onClick={() => setWantsBackup(false)}
              title="No"
              subtitle="Sistema conectado a red"
            />
          </div>
        </div>

        <div>
          <StepTitle>¿Tenés espacio disponible en el techo?</StepTitle>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <OptionCard
              selected={hasRoofSpace === true}
              onClick={() => setHasRoofSpace(true)}
              title="Sí"
            />
            <OptionCard
              selected={hasRoofSpace === false}
              onClick={() => setHasRoofSpace(false)}
              title="No / no sé"
            />
          </div>
        </div>
      </div>

      <aside>
        <div className="sticky top-20 rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 text-accent">
            <Icon name="sun" className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Estimación preliminar
            </span>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Potencia" value={`${est.systemKwp} kWp`} />
            <Row label="Paneles (aprox.)" value={`${est.panels}`} />
            <Row label="Inversor" value={`${est.inverterKw} kW`} />
            {est.needsBatteries && <Row label="Baterías" value="Incluidas" />}
            <Row label="Techo estimado" value={`~${est.roofAreaM2} m²`} />
          </dl>

          <p className="mt-4 rounded-xl bg-brand-soft p-3 text-xs text-muted">
            Estimación preliminar. La propuesta final requiere evaluación técnica.
          </p>

          <div className="mt-4 space-y-2">
            <input
              placeholder="Tu nombre"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-11 w-full rounded-xl border border-line px-3 text-sm"
            />
            <input
              placeholder="Teléfono / WhatsApp"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="h-11 w-full rounded-xl border border-line px-3 text-sm"
            />
            <input
              placeholder="Localidad"
              value={form.locality}
              onChange={(e) => setForm({ ...form, locality: e.target.value })}
              className="h-11 w-full rounded-xl border border-line px-3 text-sm"
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
            {status === "sending" ? "Enviando…" : "Solicitar evaluación"}
          </Button>
          {status === "done" && (
            <p className="mt-2 text-center text-xs font-medium text-accent">
              ¡Listo! Coordinamos la evaluación técnica.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
