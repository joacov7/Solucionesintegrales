"use client";

import { useState } from "react";
import { formatArs } from "@/lib/pricing";
import { saveServiceAction } from "@/app/actions/admin";
import { TableWrap, Th, Td } from "./ui";

export type EditableService = {
  id: string;
  name: string;
  priceArs: number;
  estimatedMin: number;
  active: boolean;
};

export function ServicesTable({ services }: { services: EditableService[] }) {
  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>Servicio</Th>
          <Th>Precio (ARS)</Th>
          <Th>Tiempo (min)</Th>
          <Th>Activo</Th>
          <Th />
        </tr>
      </thead>
      <tbody>
        {services.map((s) => (
          <Row key={s.id} service={s} />
        ))}
      </tbody>
    </TableWrap>
  );
}

function Row({ service }: { service: EditableService }) {
  const [priceArs, setPriceArs] = useState(service.priceArs);
  const [estimatedMin, setEstimatedMin] = useState(service.estimatedMin);
  const [active, setActive] = useState(service.active);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await saveServiceAction(service.id, {
      priceArs,
      estimatedMin,
      active,
    });
    setStatus(res.message);
    setSaving(false);
  }

  const input =
    "h-9 w-24 rounded-lg border border-line px-2 text-sm focus:border-accent focus:outline-none";

  return (
    <tr>
      <Td>
        <div className="font-medium text-ink">{service.name}</div>
        <div className="text-xs text-muted">= {formatArs(priceArs)}</div>
        {status && <div className="mt-1 text-xs text-accent">{status}</div>}
      </Td>
      <Td>
        <input
          type="number"
          value={priceArs}
          onChange={(e) => setPriceArs(Number(e.target.value))}
          className={input}
        />
      </Td>
      <Td>
        <input
          type="number"
          value={estimatedMin}
          onChange={(e) => setEstimatedMin(Number(e.target.value))}
          className={input}
        />
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
