import { getDashboardStats } from "@/data/admin";
import { formatArs } from "@/lib/pricing";
import { AdminHeading, StatCard, DemoBanner, AdminCard } from "@/components/admin/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const s = await getDashboardStats();

  return (
    <div>
      <AdminHeading
        title="Dashboard"
        subtitle="Resumen comercial y operativo del mes."
      />

      {s.demo && <DemoBanner />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Ventas del mes" value={formatArs(s.monthlySales)} />
        <StatCard label="Margen estimado" value={formatArs(s.estimatedMargin)} />
        <StatCard label="Presupuestos enviados" value={String(s.quotesSent)} />
        <StatCard label="Presupuestos aceptados" value={String(s.quotesAccepted)} />
        <StatCard
          label="Instalaciones pendientes"
          value={String(s.installationsPending)}
        />
        <StatCard
          label="Instalaciones terminadas"
          value={String(s.installationsDone)}
        />
        <StatCard label="Clientes" value={String(s.customers)} />
        <StatCard label="Productos" value={String(s.products)} />
        <StatCard label="Leads nuevos" value={String(s.leadsNew)} hint="Sin contactar" />
      </div>

      <AdminCard className="mt-6">
        <h2 className="text-sm font-semibold text-ink">Accesos rápidos</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { href: "/admin/leads", label: "Ver leads" },
            { href: "/admin/presupuestos", label: "Presupuestos" },
            { href: "/admin/productos", label: "Productos y precios" },
            { href: "/admin/configuracion", label: "Tipo de cambio" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-brand-soft"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
