"use client";

import { useState } from "react";
import { saveSettingsAction } from "@/app/actions/admin";
import { AdminCard } from "./ui";

type Field = { key: string; label: string; hint?: string; step?: string };

const FIELDS: Field[] = [
  { key: "dolar", label: "Tipo de cambio (USD → ARS)", hint: "Ej: 1520", step: "0.01" },
  { key: "iva", label: "IVA (fracción)", hint: "0.21 = 21%", step: "0.01" },
  { key: "default_margin_pct", label: "Margen por defecto (%)", hint: "Markup sobre el costo final", step: "1" },
  { key: "quote_validity_days", label: "Validez del presupuesto (días)", step: "1" },
];

export function SettingsForm({ values }: { values: Record<string, string> }) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of FIELDS) init[f.key] = values[f.key] ?? "";
    return init;
  });
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus(null);
    const entries = FIELDS.map((f) => ({ key: f.key, value: form[f.key] }));
    const res = await saveSettingsAction(entries);
    setStatus(res.message);
    setSaving(false);
  }

  return (
    <AdminCard className="max-w-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-medium text-ink">
              {f.label}
            </label>
            <input
              type="number"
              step={f.step}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className="h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-accent focus:outline-none"
            />
            {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        {status && <span className="text-sm text-accent">{status}</span>}
      </div>
    </AdminCard>
  );
}
