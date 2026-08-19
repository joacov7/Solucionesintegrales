"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui";
import { siteConfig, whatsappUrl } from "@/config/site";
import { submitLead } from "@/app/actions/leads";

export function ContactForm() {
  const [f, setF] = useState({
    name: "",
    phone: "",
    locality: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const wa = useMemo(
    () =>
      [
        `Hola ${siteConfig.name}, quiero una consulta.`,
        f.service ? `Servicio: ${f.service}` : "",
        f.message ? `Detalle: ${f.message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [f]
  );

  async function handleSubmit() {
    setStatus("sending");
    await submitLead({
      name: f.name || "Sin nombre",
      phone: f.phone,
      locality: f.locality,
      service: f.service || "Consulta general",
      source: "contacto",
      payload: { message: f.message },
    });
    setStatus("done");
    window.open(whatsappUrl(wa), "_blank");
  }

  const input =
    "h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-accent focus:outline-none";

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          placeholder="Nombre"
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
        <input
          placeholder="¿Qué servicio te interesa?"
          value={f.service}
          onChange={(e) => setF({ ...f, service: e.target.value })}
          className={input}
        />
      </div>
      <textarea
        rows={4}
        placeholder="Contanos qué necesitás…"
        value={f.message}
        onChange={(e) => setF({ ...f, message: e.target.value })}
        className="mt-3 w-full rounded-xl border border-line p-3 text-sm focus:border-accent focus:outline-none"
      />
      <Button
        variant="whatsapp"
        size="lg"
        className="mt-4 w-full sm:w-auto"
        onClick={handleSubmit}
        disabled={status === "sending"}
      >
        <Icon name="whatsapp" className="h-5 w-5" />
        {status === "sending" ? "Enviando…" : "Enviar por WhatsApp"}
      </Button>
      {status === "done" && (
        <p className="mt-2 text-sm font-medium text-accent">
          ¡Gracias! Te respondemos a la brevedad.
        </p>
      )}
    </div>
  );
}
