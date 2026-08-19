"use client";

import { useState } from "react";
import type { CustomerType } from "@prisma/client";
import { createCustomerAction } from "@/app/actions/admin";
import { AdminCard } from "./ui";

const TYPES: { value: CustomerType; label: string }[] = [
  { value: "PARTICULAR", label: "Particular" },
  { value: "COMERCIO", label: "Comercio" },
  { value: "EMPRESA", label: "Empresa" },
];

const empty = {
  name: "",
  phone: "",
  whatsapp: "",
  email: "",
  taxId: "",
  address: "",
  locality: "",
  type: "PARTICULAR" as CustomerType,
  notes: "",
};

export function CustomerForm() {
  const [f, setF] = useState(empty);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!f.name.trim()) {
      setStatus("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    setStatus(null);
    const res = await createCustomerAction(f);
    setStatus(res.message);
    if (res.ok) setF(empty);
    setSaving(false);
  }

  const input =
    "h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-accent focus:outline-none";

  return (
    <AdminCard>
      <h2 className="text-sm font-semibold text-ink">Nuevo cliente</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input placeholder="Nombre *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} />
        <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as CustomerType })} className={input}>
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <input placeholder="Teléfono" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={input} />
        <input placeholder="WhatsApp" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} className={input} />
        <input placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={input} />
        <input placeholder="DNI / CUIT" value={f.taxId} onChange={(e) => setF({ ...f, taxId: e.target.value })} className={input} />
        <input placeholder="Dirección" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} className={input} />
        <input placeholder="Localidad" value={f.locality} onChange={(e) => setF({ ...f, locality: e.target.value })} className={input} />
      </div>
      <textarea
        placeholder="Notas"
        rows={2}
        value={f.notes}
        onChange={(e) => setF({ ...f, notes: e.target.value })}
        className="mt-3 w-full rounded-xl border border-line p-3 text-sm focus:border-accent focus:outline-none"
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Crear cliente"}
        </button>
        {status && <span className="text-sm text-accent">{status}</span>}
      </div>
    </AdminCard>
  );
}
