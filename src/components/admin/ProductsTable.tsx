"use client";

import { useState } from "react";
import { computeProductPrice, formatArs, type PricingContext } from "@/lib/pricing";
import { saveProductAction } from "@/app/actions/admin";
import { TableWrap, Th, Td } from "./ui";

export type EditableProduct = {
  id: string;
  sku: string | null;
  name: string;
  brand: string | null;
  categoryName: string;
  priceUsd: number;
  hasVat: boolean;
  marginPct: number;
  active: boolean;
};

export function ProductsTable({
  products,
  ctx,
}: {
  products: EditableProduct[];
  ctx: PricingContext;
}) {
  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>Producto</Th>
          <Th>Costo USD</Th>
          <Th>Margen %</Th>
          <Th>Precio venta</Th>
          <Th>Activo</Th>
          <Th />
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <Row key={p.id} product={p} ctx={ctx} />
        ))}
      </tbody>
    </TableWrap>
  );
}

function Row({
  product,
  ctx,
}: {
  product: EditableProduct;
  ctx: PricingContext;
}) {
  const [priceUsd, setPriceUsd] = useState(product.priceUsd);
  const [marginPct, setMarginPct] = useState(product.marginPct);
  const [active, setActive] = useState(product.active);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const preview = computeProductPrice(
    { priceUsd, hasVat: product.hasVat, marginPct },
    ctx
  );

  async function save() {
    setSaving(true);
    setStatus(null);
    const res = await saveProductAction(product.id, { priceUsd, marginPct, active });
    setStatus(res.message);
    setSaving(false);
  }

  const input =
    "h-9 w-24 rounded-lg border border-line px-2 text-sm focus:border-accent focus:outline-none";

  return (
    <tr>
      <Td>
        <div className="font-medium text-ink">{product.name}</div>
        <div className="text-xs text-muted">
          {product.brand} · {product.categoryName} {product.sku ? `· ${product.sku}` : ""}
        </div>
        {status && <div className="mt-1 text-xs text-accent">{status}</div>}
      </Td>
      <Td>
        <input
          type="number"
          step="0.01"
          value={priceUsd}
          onChange={(e) => setPriceUsd(Number(e.target.value))}
          className={input}
        />
      </Td>
      <Td>
        <input
          type="number"
          step="1"
          value={marginPct}
          onChange={(e) => setMarginPct(Number(e.target.value))}
          className={input}
        />
      </Td>
      <Td>
        <div className="font-semibold text-ink">{formatArs(preview.salePrice)}</div>
        <div className="text-xs text-muted">
          costo {formatArs(preview.costArsFinal)}
        </div>
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
