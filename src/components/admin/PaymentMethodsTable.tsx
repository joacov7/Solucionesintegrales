"use client";

import { useState } from "react";
import { computeFinancing, formatArs } from "@/lib/pricing";
import { savePaymentMethodAction } from "@/app/actions/admin";
import { TableWrap, Th, Td, AdminCard } from "./ui";

export type EditablePaymentMethod = {
  id: string;
  name: string;
  installments: number;
  financingCost: number;
  downPaymentPct: number;
  active: boolean;
};

export function PaymentMethodsTable({
  methods,
}: {
  methods: EditablePaymentMethod[];
}) {
  const [sample, setSample] = useState(500000);
  return (
    <div className="space-y-4">
      <AdminCard className="max-w-sm">
        <label className="mb-1 block text-sm font-medium text-ink">
          Precio de ejemplo (para previsualizar cuotas)
        </label>
        <input
          type="number"
          value={sample}
          onChange={(e) => setSample(Number(e.target.value))}
          className="h-10 w-full rounded-lg border border-line px-3 text-sm"
        />
      </AdminCard>

      <TableWrap>
        <thead>
          <tr>
            <Th>Método</Th>
            <Th>Cuotas</Th>
            <Th>Costo financiero</Th>
            <Th>Anticipo</Th>
            <Th>Vista previa</Th>
            <Th>Activo</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {methods.map((m) => (
            <Row key={m.id} method={m} sample={sample} />
          ))}
        </tbody>
      </TableWrap>
      <p className="text-xs text-muted">
        El costo financiero se muestra por separado y no modifica el margen del
        producto. Ingresá 0.2 para 20%, 0.3 para 30%, etc.
      </p>
    </div>
  );
}

function Row({
  method,
  sample,
}: {
  method: EditablePaymentMethod;
  sample: number;
}) {
  const [financingCost, setFinancingCost] = useState(method.financingCost);
  const [downPaymentPct, setDownPaymentPct] = useState(method.downPaymentPct);
  const [active, setActive] = useState(method.active);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const f = computeFinancing({
    cashPrice: sample,
    financingCost,
    installments: method.installments,
    downPaymentPct,
  });

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await savePaymentMethodAction(method.id, {
      financingCost,
      downPaymentPct,
      active,
    });
    setStatus(res.message);
    setSaving(false);
  }

  const input =
    "h-9 w-20 rounded-lg border border-line px-2 text-sm focus:border-accent focus:outline-none";

  return (
    <tr>
      <Td>
        <div className="font-medium text-ink">{method.name}</div>
        {status && <div className="mt-1 text-xs text-accent">{status}</div>}
      </Td>
      <Td>{method.installments}</Td>
      <Td>
        <input
          type="number"
          step="0.01"
          value={financingCost}
          onChange={(e) => setFinancingCost(Number(e.target.value))}
          className={input}
        />
      </Td>
      <Td>
        <input
          type="number"
          step="0.01"
          value={downPaymentPct}
          onChange={(e) => setDownPaymentPct(Number(e.target.value))}
          className={input}
        />
      </Td>
      <Td>
        {method.installments > 1 ? (
          <div className="text-xs">
            <div className="font-semibold text-ink">
              {f.installments}× {formatArs(f.installmentValue)}
            </div>
            <div className="text-muted">
              +{formatArs(f.financingCostAmount)} · total {formatArs(f.financedTotal)}
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted">{formatArs(sample)}</span>
        )}
      </Td>
      <Td>
        <button
          type="button"
          onClick={() => setActive((v) => !v)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {active ? "Activo" : "Inactivo"}
        </button>
      </Td>
      <Td>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
        >
          {saving ? "…" : "Guardar"}
        </button>
      </Td>
    </tr>
  );
}
