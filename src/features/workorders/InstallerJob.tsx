"use client";

import { useState } from "react";
import { whatsappUrl } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import {
  toggleWorkOrderItemAction,
  toggleChecklistItemAction,
  completeInstallationAction,
} from "@/app/actions/operations";

type Item = { id: string; label: string; quantity: number; installed: boolean };
type Check = { id: string; label: string; done: boolean };

export function InstallerJob({
  workOrderId,
  customer,
  items: initialItems,
  checklist: initialChecklist,
  installation,
  finished,
}: {
  workOrderId: string;
  customer: { name: string; phone: string | null; address: string | null };
  items: Item[];
  checklist: Check[];
  installation: { observations: string | null; photos: string[]; clientSignedOff: boolean } | null;
  finished: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [checklist, setChecklist] = useState(initialChecklist);
  const [observations, setObservations] = useState(installation?.observations ?? "");
  const [photos, setPhotos] = useState<string[]>(installation?.photos ?? []);
  const [photoUrl, setPhotoUrl] = useState("");
  const [signedOff, setSignedOff] = useState(installation?.clientSignedOff ?? false);
  const [done, setDone] = useState(finished);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const checkedCount = checklist.filter((c) => c.done).length;

  async function toggleItem(item: Item) {
    const next = !item.installed;
    setItems((cur) => cur.map((i) => (i.id === item.id ? { ...i, installed: next } : i)));
    await toggleWorkOrderItemAction(item.id, next, workOrderId);
  }

  async function toggleCheck(c: Check) {
    const next = !c.done;
    setChecklist((cur) => cur.map((x) => (x.id === c.id ? { ...x, done: next } : x)));
    await toggleChecklistItemAction(c.id, next, workOrderId);
  }

  function addPhoto() {
    const url = photoUrl.trim();
    if (!url) return;
    setPhotos((cur) => [...cur, url]);
    setPhotoUrl("");
  }

  async function finish() {
    setSaving(true);
    setMsg(null);
    const res = await completeInstallationAction(workOrderId, {
      observations,
      photos,
      clientSignedOff: signedOff,
    });
    setMsg(res.message);
    if (res.ok) setDone(true);
    setSaving(false);
  }

  const wa = customer.phone
    ? whatsappUrl(`Hola ${customer.name}, estamos en camino.`, customer.phone.replace(/\D/g, ""))
    : null;

  return (
    <div className="space-y-4">
      {/* Cliente / dirección */}
      <Section title="Cliente">
        <div className="text-sm">
          <div className="font-semibold text-ink">{customer.name}</div>
          <div className="text-muted">{customer.address ?? "Sin dirección"}</div>
        </div>
        <div className="mt-3 flex gap-2">
          {customer.address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(customer.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg border border-line py-2 text-center text-sm font-medium text-ink"
            >
              Cómo llegar
            </a>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-[#25D366] py-2 text-center text-sm font-medium text-white"
            >
              WhatsApp
            </a>
          )}
        </div>
      </Section>

      {/* Materiales */}
      <Section title="Materiales">
        {items.length === 0 ? (
          <p className="text-sm text-muted">Sin materiales cargados.</p>
        ) : (
          <ul className="space-y-1">
            {items.map((i) => (
              <li key={i.id}>
                <button
                  onClick={() => toggleItem(i)}
                  disabled={done}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-brand-soft disabled:opacity-60"
                >
                  <CheckBox on={i.installed} />
                  <span className={i.installed ? "text-muted line-through" : "text-ink"}>
                    {i.quantity > 1 && `${i.quantity}× `}
                    {i.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Checklist */}
      <Section title={`Checklist (${checkedCount}/${checklist.length})`}>
        <ul className="space-y-1">
          {checklist.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => toggleCheck(c)}
                disabled={done}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-brand-soft disabled:opacity-60"
              >
                <CheckBox on={c.done} />
                <span className={c.done ? "text-muted" : "text-ink"}>{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* Fotos */}
      <Section title="Fotos">
        {photos.length > 0 && (
          <ul className="mb-3 space-y-1">
            {photos.map((p, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-muted">
                <Icon name="camera" className="h-4 w-4 flex-none" />
                <span className="truncate">{p}</span>
              </li>
            ))}
          </ul>
        )}
        {!done && (
          <div className="flex gap-2">
            <input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Pegá el link de una foto"
              className="h-10 flex-1 rounded-lg border border-line px-3 text-sm"
            />
            <button
              onClick={addPhoto}
              className="rounded-lg border border-line px-3 text-sm font-medium text-ink"
            >
              Agregar
            </button>
          </div>
        )}
        <p className="mt-2 text-xs text-muted">
          La carga de archivos se integrará con Supabase Storage. Por ahora se
          registran enlaces.
        </p>
      </Section>

      {/* Observaciones */}
      <Section title="Observaciones">
        <textarea
          rows={3}
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          disabled={done}
          placeholder="Detalles de la instalación…"
          className="w-full rounded-xl border border-line p-3 text-sm disabled:bg-brand-soft"
        />
      </Section>

      {/* Finalizar */}
      {done ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-800">
          ✓ Instalación finalizada y registrada.
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={signedOff}
              onChange={(e) => setSignedOff(e.target.checked)}
              className="h-5 w-5 rounded border-line accent-[color:rgb(var(--accent))]"
            />
            <span className="text-sm text-ink">
              El cliente dio conformidad de la instalación.
            </span>
          </label>
          <button
            onClick={finish}
            disabled={saving}
            className="mt-4 w-full rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Marcar trabajo terminado"}
          </button>
          {msg && <p className="mt-2 text-center text-xs text-accent">{msg}</p>}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-card">
      <h2 className="mb-3 text-sm font-semibold text-ink">{title}</h2>
      {children}
    </div>
  );
}

function CheckBox({ on }: { on: boolean }) {
  return (
    <span
      className={`grid h-6 w-6 flex-none place-items-center rounded-md border ${
        on ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface"
      }`}
    >
      {on && <Icon name="check" className="h-4 w-4" />}
    </span>
  );
}
