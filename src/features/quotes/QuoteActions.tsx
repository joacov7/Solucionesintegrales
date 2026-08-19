"use client";

import { useState } from "react";
import Link from "next/link";
import type { QuoteStatus } from "@prisma/client";
import { setQuoteStatusAction } from "@/app/actions/operations";
import { formatArs } from "@/lib/pricing";
import { siteConfig, whatsappUrl } from "@/config/site";
import { StatusBadge } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icon";

const STATUSES: QuoteStatus[] = [
  "BORRADOR",
  "ENVIADO",
  "ACEPTADO",
  "RECHAZADO",
  "VENCIDO",
  "CANCELADO",
];

export function QuoteActions({
  quoteId,
  current,
  saleTotal,
  items,
  customerName,
  hasWorkOrder,
  workOrderId,
}: {
  quoteId: string;
  current: QuoteStatus;
  saleTotal: number;
  items: { label: string; quantity: number }[];
  customerName: string | null;
  hasWorkOrder: boolean;
  workOrderId: string | null;
}) {
  const [status, setStatus] = useState<QuoteStatus>(current);
  const [pending, setPending] = useState<QuoteStatus>(current);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [woId, setWoId] = useState<string | null>(workOrderId);
  const [woExists, setWoExists] = useState(hasWorkOrder);

  async function apply() {
    setSaving(true);
    setMessage(null);
    const res = await setQuoteStatusAction(quoteId, pending);
    if (res.ok) {
      setStatus(pending);
      if (pending === "ACEPTADO") setWoExists(true);
    }
    setMessage(res.message);
    setSaving(false);
  }

  const waText = [
    `*${siteConfig.name}* — Presupuesto`,
    customerName ? `Cliente: ${customerName}` : "",
    "",
    "*Incluye:*",
    ...items.map((i) => `• ${i.quantity > 1 ? `${i.quantity}x ` : ""}${i.label}`),
    "",
    `*Total:* ${formatArs(saleTotal)}`,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">Estado actual:</span>
        <StatusBadge status={status} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={pending}
          onChange={(e) => setPending(e.target.value as QuoteStatus)}
          className="h-10 rounded-lg border border-line px-3 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={apply}
          disabled={saving || pending === status}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
        >
          {saving ? "…" : "Aplicar estado"}
        </button>
        <a
          href={whatsappUrl(waText)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white"
        >
          <Icon name="whatsapp" className="h-4 w-4" /> Enviar por WhatsApp
        </a>
      </div>

      {message && <p className="text-sm text-accent">{message}</p>}

      {woExists && woId && (
        <Link
          href={`/admin/ordenes/${woId}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent"
        >
          Ver orden de trabajo →
        </Link>
      )}
      {woExists && !woId && (
        <Link
          href="/admin/ordenes"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent"
        >
          Ver órdenes de trabajo →
        </Link>
      )}
    </div>
  );
}
