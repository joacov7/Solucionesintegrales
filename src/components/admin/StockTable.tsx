"use client";

import { useState } from "react";
import { saveProductAction } from "@/app/actions/admin";
import { TableWrap, Th, Td } from "./ui";

export type StockProduct = {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
  lowStockThreshold: number;
};

export function StockTable({ products }: { products: StockProduct[] }) {
  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>Producto</Th>
          <Th>Stock</Th>
          <Th>Umbral bajo</Th>
          <Th>Estado</Th>
          <Th />
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <Row key={p.id} product={p} />
        ))}
      </tbody>
    </TableWrap>
  );
}

function Row({ product }: { product: StockProduct }) {
  const [stock, setStock] = useState(product.stock);
  const [threshold, setThreshold] = useState(product.lowStockThreshold);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const low = stock <= threshold;

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await saveProductAction(product.id, {
      stock,
      lowStockThreshold: threshold,
    });
    setMsg(res.message);
    setSaving(false);
  }

  const input =
    "h-9 w-20 rounded-lg border border-line px-2 text-sm focus:border-accent focus:outline-none";

  return (
    <tr>
      <Td>
        <div className="font-medium text-ink">{product.name}</div>
        {product.sku && <div className="text-xs text-muted">{product.sku}</div>}
        {msg && <div className="mt-1 text-xs text-accent">{msg}</div>}
      </Td>
      <Td>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          className={input}
        />
      </Td>
      <Td>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className={input}
        />
      </Td>
      <Td>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            low ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {low ? "Stock bajo" : "OK"}
        </span>
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
