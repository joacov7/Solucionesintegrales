"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { computeQuoteTotals, formatArs } from "@/lib/pricing";
import { createQuoteAction } from "@/app/actions/operations";
import type { QuoterDataset } from "@/features/quoter/types";
import { AdminCard } from "@/components/admin/ui";
import { Icon } from "@/components/ui/Icon";

type BuilderItem = {
  key: string;
  kind: "product" | "service" | "custom";
  productId?: string;
  serviceId?: string;
  label: string;
  quantity: number;
  unitCost: number;
  unitSale: number;
};

type CustomerOption = { id: string; name: string };

let counter = 0;
const uid = () => `it-${counter++}`;

export function QuoteBuilder({
  dataset,
  customers,
}: {
  dataset: QuoterDataset;
  customers: CustomerOption[];
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState(
    dataset.paymentMethods[0]?.id ?? ""
  );
  const [discountPct, setDiscountPct] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<BuilderItem[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const totals = useMemo(
    () =>
      computeQuoteTotals(
        items.map((i) => ({
          quantity: i.quantity,
          unitCost: i.unitCost,
          unitSale: i.unitSale,
        })),
        discountPct
      ),
    [items, discountPct]
  );

  const addProduct = (id: string) => {
    const p = dataset.products.find((x) => x.id === id);
    if (!p) return;
    setItems((cur) => [
      ...cur,
      {
        key: uid(),
        kind: "product",
        productId: p.id,
        label: p.name,
        quantity: 1,
        unitCost: p.unitCost,
        unitSale: p.salePrice,
      },
    ]);
  };

  const addService = (id: string) => {
    const s = dataset.services.find((x) => x.id === id);
    if (!s) return;
    setItems((cur) => [
      ...cur,
      {
        key: uid(),
        kind: "service",
        serviceId: s.id,
        label: s.name,
        quantity: 1,
        unitCost: 0,
        unitSale: s.priceArs,
      },
    ]);
  };

  const addCustom = () =>
    setItems((cur) => [
      ...cur,
      { key: uid(), kind: "custom", label: "", quantity: 1, unitCost: 0, unitSale: 0 },
    ]);

  const update = (key: string, patch: Partial<BuilderItem>) =>
    setItems((cur) => cur.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const remove = (key: string) =>
    setItems((cur) => cur.filter((i) => i.key !== key));

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await createQuoteAction({
      customerId: customerId || undefined,
      paymentMethodId: paymentMethodId || undefined,
      discountPct,
      notes,
      items: items.map((i) => ({
        kind: i.kind,
        productId: i.productId,
        serviceId: i.serviceId,
        label: i.label || "Ítem",
        quantity: i.quantity,
        unitCost: i.unitCost,
        unitSale: i.unitSale,
      })),
    });
    setStatus(res.message);
    setSaving(false);
    if (res.ok && res.id) router.push(`/admin/presupuestos/${res.id}`);
  }

  const input =
    "h-9 rounded-lg border border-line px-2 text-sm focus:border-accent focus:outline-none";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <AdminCard>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Cliente</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className={`${input} h-11 w-full`}
              >
                <option value="">— Sin asignar —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">
                Forma de pago
              </label>
              <select
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                className={`${input} h-11 w-full`}
              >
                {dataset.paymentMethods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex flex-wrap items-center gap-2">
            <AddSelect
              label="+ Producto"
              options={dataset.products.map((p) => ({ id: p.id, name: p.name }))}
              onPick={addProduct}
            />
            <AddSelect
              label="+ Mano de obra"
              options={dataset.services.map((s) => ({ id: s.id, name: s.name }))}
              onPick={addService}
            />
            <button
              onClick={addCustom}
              className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-brand-soft"
            >
              + Ítem libre
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {items.length === 0 && (
              <p className="rounded-lg bg-brand-soft px-3 py-4 text-center text-sm text-muted">
                Agregá productos, mano de obra o ítems libres.
              </p>
            )}
            {items.map((i) => (
              <div
                key={i.key}
                className="grid grid-cols-12 items-center gap-2 rounded-lg border border-line p-2"
              >
                <input
                  value={i.label}
                  onChange={(e) => update(i.key, { label: e.target.value })}
                  placeholder="Descripción"
                  className={`${input} col-span-12 sm:col-span-5`}
                />
                <label className="col-span-3 sm:col-span-1 text-xs text-muted">
                  Cant.
                  <input
                    type="number"
                    value={i.quantity}
                    min={1}
                    onChange={(e) => update(i.key, { quantity: Number(e.target.value) })}
                    className={`${input} w-full`}
                  />
                </label>
                <label className="col-span-4 sm:col-span-2 text-xs text-muted">
                  Costo
                  <input
                    type="number"
                    value={i.unitCost}
                    onChange={(e) => update(i.key, { unitCost: Number(e.target.value) })}
                    className={`${input} w-full`}
                  />
                </label>
                <label className="col-span-4 sm:col-span-2 text-xs text-muted">
                  Venta
                  <input
                    type="number"
                    value={i.unitSale}
                    onChange={(e) => update(i.key, { unitSale: Number(e.target.value) })}
                    className={`${input} w-full`}
                  />
                </label>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => remove(i.key)}
                    className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Quitar"
                  >
                    <Icon name="x" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <textarea
            placeholder="Notas del presupuesto"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-3 w-full rounded-xl border border-line p-3 text-sm focus:border-accent focus:outline-none"
          />
        </AdminCard>
      </div>

      {/* Totales */}
      <div>
        <div className="sticky top-20 rounded-2xl border border-line bg-surface p-6 shadow-card">
          <h2 className="text-sm font-semibold text-ink">Totales</h2>
          <div className="mt-3">
            <label className="text-xs text-muted">Descuento %</label>
            <input
              type="number"
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value))}
              className={`${input} mt-1 w-full`}
            />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Costo total" value={formatArs(totals.costTotal)} />
            <Row label="Subtotal venta" value={formatArs(totals.saleSubtotal)} />
            <Row label="Descuento" value={`- ${formatArs(totals.discountAmount)}`} />
            <div className="border-t border-line pt-2">
              <Row label="Precio de venta" value={formatArs(totals.saleTotal)} strong />
            </div>
            <Row label="Ganancia" value={formatArs(totals.profit)} />
            <Row label="Margen" value={`${totals.marginPct.toFixed(1)}%`} />
          </dl>
          <button
            onClick={save}
            disabled={saving || items.length === 0}
            className="mt-5 w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Crear presupuesto"}
          </button>
          {status && <p className="mt-2 text-center text-xs text-accent">{status}</p>}
        </div>
      </div>
    </div>
  );
}

function AddSelect({
  label,
  options,
  onPick,
}: {
  label: string;
  options: { id: string; name: string }[];
  onPick: (id: string) => void;
}) {
  return (
    <select
      value=""
      onChange={(e) => {
        if (e.target.value) onPick(e.target.value);
        e.target.value = "";
      }}
      className="h-10 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink hover:bg-brand-soft"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
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
      <dd className={strong ? "text-base font-bold text-ink" : "text-ink"}>{value}</dd>
    </div>
  );
}
