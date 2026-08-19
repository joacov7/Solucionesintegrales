import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <AdminCard>
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </AdminCard>
  );
}

export function DemoBanner() {
  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <strong>Modo demo.</strong> No hay base de datos configurada
      (<code>DATABASE_URL</code>). Los catálogos se muestran desde el seed y los
      cambios no se guardan. Configurá PostgreSQL y corré las migraciones + seed
      para operar con datos reales.
    </div>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
      <table className="w-full min-w-[640px] text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "border-b border-line px-4 py-3 text-left font-semibold text-muted",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <td className={cn("border-b border-line px-4 py-3 text-ink", className)}>
      {children}
    </td>
  );
}

const statusColors: Record<string, string> = {
  BORRADOR: "bg-slate-100 text-slate-700",
  ENVIADO: "bg-blue-100 text-blue-700",
  ACEPTADO: "bg-emerald-100 text-emerald-700",
  RECHAZADO: "bg-rose-100 text-rose-700",
  VENCIDO: "bg-amber-100 text-amber-800",
  CANCELADO: "bg-slate-100 text-slate-500",
  NUEVO: "bg-blue-100 text-blue-700",
  CONTACTADO: "bg-indigo-100 text-indigo-700",
  PRESUPUESTADO: "bg-amber-100 text-amber-800",
  GANADO: "bg-emerald-100 text-emerald-700",
  PERDIDO: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        statusColors[status] ?? "bg-slate-100 text-slate-700"
      )}
    >
      {status}
    </span>
  );
}
