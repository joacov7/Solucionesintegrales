"use client";

import { useState } from "react";
import type { MaintenanceType } from "@prisma/client";
import {
  createMaintenanceAction,
  setMaintenanceDoneAction,
} from "@/app/actions/operations";
import { AdminCard, TableWrap, Th, Td } from "@/components/admin/ui";

const TYPES: { value: MaintenanceType; label: string }[] = [
  { value: "PREVENTIVO", label: "Mantenimiento preventivo" },
  { value: "REPARACION", label: "Reparación" },
  { value: "VISITA_TECNICA", label: "Visita técnica" },
  { value: "AMPLIACION", label: "Ampliación" },
  { value: "CAMBIO_BATERIA", label: "Cambio de batería" },
];

type Row = {
  id: string;
  customerName: string;
  type: MaintenanceType;
  scheduledAt: string | null;
  done: boolean;
  notes: string | null;
};

export function MaintenanceManager({
  installations,
  initialRows,
}: {
  installations: { id: string; label: string }[];
  initialRows: Row[];
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [f, setF] = useState({
    installationId: installations[0]?.id ?? "",
    type: "PREVENTIVO" as MaintenanceType,
    scheduledAt: "",
    notes: "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function create() {
    if (!f.installationId) {
      setMsg("Primero registrá una instalación.");
      return;
    }
    setSaving(true);
    setMsg(null);
    const res = await createMaintenanceAction({
      installationId: f.installationId,
      type: f.type,
      scheduledAt: f.scheduledAt ? new Date(f.scheduledAt) : null,
      notes: f.notes || undefined,
    });
    setMsg(res.message);
    setSaving(false);
    if (res.ok) {
      const inst = installations.find((i) => i.id === f.installationId);
      setRows((cur) => [
        {
          id: `tmp-${Date.now()}`,
          customerName: inst?.label ?? "—",
          type: f.type,
          scheduledAt: f.scheduledAt || null,
          done: false,
          notes: f.notes || null,
        },
        ...cur,
      ]);
      setF({ ...f, scheduledAt: "", notes: "" });
    }
  }

  async function toggle(row: Row) {
    const next = !row.done;
    setRows((cur) => cur.map((r) => (r.id === row.id ? { ...r, done: next } : r)));
    if (!row.id.startsWith("tmp-")) await setMaintenanceDoneAction(row.id, next);
  }

  const input =
    "h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-accent focus:outline-none";

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <AdminCard>
          <h2 className="text-sm font-semibold text-ink">Agendar mantenimiento</h2>
          <div className="mt-3 space-y-2">
            <select
              value={f.installationId}
              onChange={(e) => setF({ ...f, installationId: e.target.value })}
              className={input}
            >
              {installations.length === 0 && <option value="">Sin instalaciones</option>}
              {installations.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.label}
                </option>
              ))}
            </select>
            <select
              value={f.type}
              onChange={(e) => setF({ ...f, type: e.target.value as MaintenanceType })}
              className={input}
            >
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={f.scheduledAt}
              onChange={(e) => setF({ ...f, scheduledAt: e.target.value })}
              className={input}
            />
            <textarea
              placeholder="Notas"
              rows={2}
              value={f.notes}
              onChange={(e) => setF({ ...f, notes: e.target.value })}
              className="w-full rounded-xl border border-line p-3 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <button
            onClick={create}
            disabled={saving}
            className="mt-4 w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Agendar"}
          </button>
          {msg && <p className="mt-2 text-center text-xs text-accent">{msg}</p>}
        </AdminCard>
      </div>

      <div className="lg:col-span-3">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
            No hay mantenimientos agendados.
          </div>
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>Cliente</Th>
                <Th>Tipo</Th>
                <Th>Fecha</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <Td>{r.customerName}</Td>
                  <Td>{TYPES.find((t) => t.value === r.type)?.label ?? r.type}</Td>
                  <Td>
                    {r.scheduledAt
                      ? new Date(r.scheduledAt).toLocaleString("es-AR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "—"}
                  </Td>
                  <Td>
                    <button
                      onClick={() => toggle(r)}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        r.done
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.done ? "Hecho" : "Pendiente"}
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </div>
    </div>
  );
}
