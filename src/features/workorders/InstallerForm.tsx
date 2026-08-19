"use client";

import { useState } from "react";
import { createInstallerAction } from "@/app/actions/operations";
import { AdminCard } from "@/components/admin/ui";

export function InstallerForm() {
  const [f, setF] = useState({ name: "", phone: "", email: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!f.name.trim()) {
      setMsg("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    setMsg(null);
    const res = await createInstallerAction(f);
    setMsg(res.message);
    if (res.ok) setF({ name: "", phone: "", email: "" });
    setSaving(false);
  }

  const input =
    "h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-accent focus:outline-none";

  return (
    <AdminCard>
      <h2 className="text-sm font-semibold text-ink">Nuevo instalador</h2>
      <div className="mt-3 space-y-2">
        <input
          placeholder="Nombre *"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
          className={input}
        />
        <input
          placeholder="Teléfono"
          value={f.phone}
          onChange={(e) => setF({ ...f, phone: e.target.value })}
          className={input}
        />
        <input
          placeholder="Email"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          className={input}
        />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
      >
        {saving ? "Guardando…" : "Crear instalador"}
      </button>
      {msg && <p className="mt-2 text-center text-xs text-accent">{msg}</p>}
    </AdminCard>
  );
}
