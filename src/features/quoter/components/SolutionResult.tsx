"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui";
import { computeFinancing, formatArs } from "@/lib/pricing";
import { buildQuoteMessage } from "@/lib/whatsapp";
import { siteConfig, whatsappUrl } from "@/config/site";
import { submitLead } from "@/app/actions/leads";
import type { Solution, PricedPaymentMethod } from "../types";

export function SolutionResult({
  solution,
  paymentMethods,
  source,
  serviceLabel,
}: {
  solution: Solution;
  paymentMethods: PricedPaymentMethod[];
  source: string;
  serviceLabel: string;
}) {
  const [methodId, setMethodId] = useState(paymentMethods[0]?.id ?? "");
  const method =
    paymentMethods.find((m) => m.id === methodId) ?? paymentMethods[0];

  const financing = useMemo(() => {
    if (!method)
      return computeFinancing({
        cashPrice: solution.saleTotal,
        financingCost: 0,
        installments: 1,
        downPaymentPct: 0,
      });
    return computeFinancing({
      cashPrice: solution.saleTotal,
      financingCost: method.financingCost,
      installments: method.installments,
      downPaymentPct: method.downPaymentPct,
    });
  }, [method, solution.saleTotal]);

  const [form, setForm] = useState({ name: "", phone: "", locality: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const waMessage = useMemo(
    () =>
      buildQuoteMessage({
        companyName: siteConfig.name,
        solution,
        paymentLabel: method?.name ?? "Contado",
        financing,
      }),
    [solution, method, financing]
  );

  async function handleRequest() {
    setStatus("sending");
    await submitLead({
      name: form.name || "Sin nombre",
      phone: form.phone,
      locality: form.locality,
      service: serviceLabel,
      estimatedArs: solution.saleTotal,
      source,
      payload: { solution, paymentMethod: method?.name, financing },
    });
    setStatus("done");
    window.open(whatsappUrl(waMessage), "_blank");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Detalle de la solución */}
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="flex items-center gap-2 text-accent">
            <Icon name="spark" className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wide">
              Solución recomendada
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-ink">{solution.title}</h2>

          <ul className="mt-5 divide-y divide-line">
            {solution.lines.map((l, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-3">
                <span className="flex items-center gap-3 text-ink">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-accent/10 text-accent">
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  <span className="text-sm">
                    {l.quantity > 1 && (
                      <span className="font-semibold">{l.quantity}× </span>
                    )}
                    {l.label}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {solution.notes.length > 0 && (
            <div className="mt-4 space-y-2">
              {solution.notes.map((n, i) => (
                <p
                  key={i}
                  className="rounded-lg bg-brand-soft px-3 py-2 text-sm text-muted"
                >
                  {n}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Precio + financiación + CTA */}
      <div className="lg:col-span-2">
        <div className="sticky top-20 rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="text-sm text-muted">Precio contado</div>
          <div className="text-3xl font-bold text-ink">
            {formatArs(solution.saleTotal)}
          </div>

          <div className="mt-5">
            <label className="mb-1 block text-sm font-medium text-ink">
              Forma de pago
            </label>
            <select
              value={methodId}
              onChange={(e) => setMethodId(e.target.value)}
              className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm"
            >
              {paymentMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {method && method.installments > 1 && (
            <dl className="mt-4 space-y-2 rounded-xl bg-brand-soft p-4 text-sm">
              <Row label="Costo financiero" value={formatArs(financing.financingCostAmount)} />
              <Row label="Total financiado" value={formatArs(financing.financedTotal)} strong />
              {financing.downPayment > 0 && (
                <Row label="Anticipo" value={formatArs(financing.downPayment)} />
              )}
              <Row
                label={`${financing.installments} cuotas de`}
                value={formatArs(financing.installmentValue)}
                strong
              />
            </dl>
          )}

          <div className="mt-5 space-y-2">
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
            {status === "sending" ? "Enviando…" : "Solicitar instalación"}
          </Button>
          <p className="mt-2 text-center text-xs text-muted">
            Te abrimos WhatsApp con el presupuesto listo para enviar.
          </p>
          {status === "done" && (
            <p className="mt-2 text-center text-xs font-medium text-accent">
              ¡Listo! Guardamos tu consulta.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "font-semibold text-ink" : "text-ink"}>{value}</dd>
    </div>
  );
}
