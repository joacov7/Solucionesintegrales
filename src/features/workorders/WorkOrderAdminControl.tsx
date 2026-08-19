"use client";

import { useState } from "react";
import type { WorkOrderStatus } from "@prisma/client";
import { updateWorkOrderAction } from "@/app/actions/operations";

const STATUSES: WorkOrderStatus[] = [
  "PENDIENTE",
  "PROGRAMADA",
  "EN_PREPARACION",
  "EN_CAMINO",
  "EN_INSTALACION",
  "FINALIZADA",
  "CANCELADA",
];

export function WorkOrderAdminControl({
  workOrderId,
  installers,
  current,
}: {
  workOrderId: string;
  installers: { id: string; name: string }[];
  current: {
    installerId: string | null;
    status: WorkOrderStatus;
    address: string | null;
    scheduledAt: string | null;
    notes: string | null;
  };
}) {
  const [installerId, setInstallerId] = useState(current.installerId ?? "");
  const [statusValue, setStatusValue] = useState<WorkOrderStatus>(current.status);
  const [address, setAddress] = useState(current.address ?? "");
  const [scheduledAt, setScheduledAt] = useState(
    current.scheduledAt ? current.scheduledAt.slice(0, 16) : ""
  );
  const [notes, setNotes] = useState(current.notes ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await updateWorkOrderAction(workOrderId, {
      installerId: installerId || null,
      status: statusValue,
      address,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      notes,
    });
    setMsg(res.message);
    setSaving(false);
  }

  const input =
    "h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-accent focus:outline-none";

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Instalador</label>
        <select
          value={installerId}
          onChange={(e) => setInstallerId(e.target.value)}
          className={input}
        >
          <option value="">— Sin asignar —</option>
          {installers.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Estado</label>
        <select
          value={statusValue}
          onChange={(e) => setStatusValue(e.target.value as WorkOrderStatus)}
          className={input}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">
          Fecha y hora
        </label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className={input}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Dirección</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={input}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Notas</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-line p-3 text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
      >
        {saving ? "Guardando…" : "Guardar orden"}
      </button>
      {msg && <p className="text-center text-xs text-accent">{msg}</p>}
    </div>
  );
}
