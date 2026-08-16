"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui";
import { OptionCard, PillOption, StepTitle } from "./components/parts";
import { siteConfig, whatsappUrl } from "@/config/site";
import { submitLead } from "@/app/actions/leads";

const PACKAGES = [1, 2, 4, 6, 8];
const LOCATIONS = [
  { key: "interior", label: "Interior" },
  { key: "exterior", label: "Exterior" },
];
const TECH = [
  { key: "wifi", label: "WiFi" },
  { key: "poe", label: "PoE" },
  { key: "ip", label: "IP" },
  { key: "analogica", label: "Analógica" },
];

type Answers = {
  cameras: number;
  location: string[];
  tech: string | null;
  recorder: boolean;
  disk: boolean;
  installation: boolean;
};

export function CameraWizard() {
  const [a, setA] = useState<Answers>({
    cameras: 4,
    location: ["exterior"],
    tech: "wifi",
    recorder: true,
    disk: true,
    installation: true,
  });
  const [form, setForm] = useState({ name: "", phone: "", locality: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const toggleLoc = (key: string) =>
    setA((s) => ({
      ...s,
      location: s.location.includes(key)
        ? s.location.filter((x) => x !== key)
        : [...s.location, key],
    }));

  const summary = useMemo(() => {
    const parts = [
      `${a.cameras} cámara(s)`,
      a.location.join(" + ") || "ubicación a definir",
      a.tech ? a.tech.toUpperCase() : "tecnología a definir",
      a.recorder ? "con NVR/DVR" : "sin grabador",
      a.disk ? "con disco" : "sin disco",
      a.installation ? "con instalación" : "sin instalación",
    ];
    return parts.join(" · ");
  }, [a]);

  const waMessage = useMemo(() => {
    return [
      `*${siteConfig.name}* — Solicitud de cotización de cámaras`,
      "",
      `*Configuración:* ${summary}`,
      form.name ? `*Nombre:* ${form.name}` : "",
      form.locality ? `*Localidad:* ${form.locality}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [summary, form]);

  async function handleRequest() {
    setStatus("sending");
    await submitLead({
      name: form.name || "Sin nombre",
      phone: form.phone,
      locality: form.locality,
      service: "Cámaras",
      source: "cotizador-camaras",
      payload: a,
    });
    setStatus("done");
    window.open(whatsappUrl(waMessage), "_blank");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div>
          <StepTitle>¿Cuántas cámaras necesitás?</StepTitle>
          <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {PACKAGES.map((n) => (
              <PillOption
                key={n}
                selected={a.cameras === n}
                onClick={() => setA({ ...a, cameras: n })}
              >
                {n === 8 ? "8+" : n}
              </PillOption>
            ))}
          </div>
        </div>

        <div>
          <StepTitle>¿Dónde las vas a poner?</StepTitle>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {LOCATIONS.map((l) => (
              <OptionCard
                key={l.key}
                selected={a.location.includes(l.key)}
                onClick={() => toggleLoc(l.key)}
                title={l.label}
              />
            ))}
          </div>
        </div>

        <div>
          <StepTitle>Tecnología</StepTitle>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TECH.map((t) => (
              <OptionCard
                key={t.key}
                selected={a.tech === t.key}
                onClick={() => setA({ ...a, tech: t.key })}
                title={t.label}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <ToggleCard
            label="Grabador NVR/DVR"
            value={a.recorder}
            onChange={(v) => setA({ ...a, recorder: v })}
          />
          <ToggleCard
            label="Disco de grabación"
            value={a.disk}
            onChange={(v) => setA({ ...a, disk: v })}
          />
          <ToggleCard
            label="Instalación"
            value={a.installation}
            onChange={(v) => setA({ ...a, installation: v })}
          />
        </div>
      </div>

      <aside>
        <div className="sticky top-20 rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 text-accent">
            <Icon name="camera" className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Tu configuración
            </span>
          </div>
          <p className="mt-3 text-sm text-muted">{summary}</p>

          <div className="mt-4 rounded-xl bg-brand-soft p-3 text-xs text-muted">
            Cotizamos tu sistema Uniview / Uniarch a medida según los equipos
            elegidos. Te pasamos el presupuesto por WhatsApp.
          </div>

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
            onClick={handleRequest}
            disabled={status === "sending"}
          >
            <Icon name="whatsapp" className="h-5 w-5" />
            {status === "sending" ? "Enviando…" : "Solicitar cotización"}
          </Button>
          {status === "done" && (
            <p className="mt-2 text-center text-xs font-medium text-accent">
              ¡Listo! Te contactamos con el presupuesto.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function ToggleCard({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
        value ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-line bg-surface"
      }`}
    >
      <span className="text-sm font-medium text-ink">{label}</span>
      <span
        className={`flex h-6 w-11 items-center rounded-full p-0.5 transition-colors ${
          value ? "bg-accent" : "bg-line"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : ""
          }`}
        />
      </span>
    </button>
  );
}
