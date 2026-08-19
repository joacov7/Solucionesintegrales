"use client";

import { useState } from "react";
import type { CustomerPortalData } from "@/data/operations";
import { lookupCustomerPortalAction } from "@/app/actions/operations";
import { formatArs } from "@/lib/pricing";
import { siteConfig, whatsappUrl } from "@/config/site";
import { Icon } from "@/components/ui/Icon";

export function ClientPortal() {
  const [phone, setPhone] = useState("");
  const [data, setData] = useState<CustomerPortalData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup() {
    setLoading(true);
    setError(null);
    const res = await lookupCustomerPortalAction(phone);
    if (res.ok && res.data) {
      setData(res.data);
    } else {
      setData(null);
      setError(res.message ?? "No encontramos tus datos.");
    }
    setLoading(false);
  }

  if (data) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Hola, {data.customer.name}</h1>
          <button
            onClick={() => setData(null)}
            className="mt-1 text-sm font-medium text-accent"
          >
            ← Salir
          </button>
        </div>

        <PortalCard title="Presupuestos" empty={data.quotes.length === 0}>
          {data.quotes.map((q) => (
            <Line
              key={q.id}
              left={`#${q.code.slice(0, 8)}`}
              mid={q.status}
              right={formatArs(q.saleTotal)}
            />
          ))}
        </PortalCard>

        <PortalCard title="Órdenes de trabajo" empty={data.workOrders.length === 0}>
          {data.workOrders.map((w) => (
            <Line
              key={w.id}
              left={`#${w.code.slice(0, 8)}`}
              mid={w.status.replace(/_/g, " ")}
              right={
                w.scheduledAt
                  ? new Date(w.scheduledAt).toLocaleDateString("es-AR")
                  : "—"
              }
            />
          ))}
        </PortalCard>

        <PortalCard title="Instalaciones y garantías" empty={data.installations.length === 0}>
          {data.installations.map((i) => (
            <div key={i.id} className="py-2">
              <div className="text-sm font-medium text-ink">
                {new Date(i.installedAt).toLocaleDateString("es-AR")}
              </div>
              {i.warranties.map((w, idx) => (
                <div key={idx} className="text-xs text-muted">
                  {w.productName} · garantía {w.warrantyMonths} meses
                </div>
              ))}
            </div>
          ))}
        </PortalCard>

        <PortalCard title="Mantenimientos" empty={data.maintenance.length === 0}>
          {data.maintenance.map((m) => (
            <Line
              key={m.id}
              left={m.type.replace(/_/g, " ")}
              mid={m.done ? "Hecho" : "Pendiente"}
              right={
                m.scheduledAt
                  ? new Date(m.scheduledAt).toLocaleDateString("es-AR")
                  : "—"
              }
            />
          ))}
        </PortalCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-brand-fg">
          <Icon name="shield" className="h-7 w-7 text-accent" />
        </div>
        <h1 className="mt-5 text-center text-xl font-bold text-ink">
          Portal de clientes
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Ingresá tu teléfono para ver tus presupuestos, instalaciones y garantías.
        </p>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Tu teléfono"
          inputMode="tel"
          className="mt-5 h-11 w-full rounded-xl border border-line px-3 text-sm focus:border-accent focus:outline-none"
        />
        <button
          onClick={lookup}
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-fg hover:bg-brand/90 disabled:opacity-50"
        >
          {loading ? "Buscando…" : "Ingresar"}
        </button>
        {error && (
          <div className="mt-3 text-center text-sm text-rose-600">
            {error}{" "}
            <a
              href={whatsappUrl(`Hola ${siteConfig.name}, consulta sobre mi cuenta.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent underline"
            >
              WhatsApp
            </a>
          </div>
        )}
        <p className="mt-5 text-center text-xs text-muted">
          Próximamente con acceso seguro (Supabase Auth).
        </p>
      </div>
    </div>
  );
}

function PortalCard({
  title,
  empty,
  children,
}: {
  title: string;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {empty ? (
        <p className="mt-2 text-sm text-muted">Sin registros.</p>
      ) : (
        <div className="mt-2 divide-y divide-line">{children}</div>
      )}
    </div>
  );
}

function Line({
  left,
  mid,
  right,
}: {
  left: string;
  mid: string;
  right: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <span className="font-medium text-ink">{left}</span>
      <span className="text-xs text-muted">{mid}</span>
      <span className="text-ink">{right}</span>
    </div>
  );
}
