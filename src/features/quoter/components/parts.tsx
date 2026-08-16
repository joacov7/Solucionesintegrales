"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/** Barra de progreso del wizard. */
export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted">
        <span>
          Paso {step} de {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-brand-soft">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Tarjeta seleccionable (single o multi select). */
export function OptionCard({
  selected,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
        selected
          ? "border-accent bg-accent/5 shadow-card ring-1 ring-accent"
          : "border-line bg-surface hover:border-accent/40 hover:shadow-card"
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-fg">
          <Icon name="check" className="h-3.5 w-3.5" />
        </span>
      )}
      {icon && (
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            selected ? "bg-accent/10 text-accent" : "bg-brand-soft text-ink"
          )}
        >
          {icon}
        </span>
      )}
      <span className="font-semibold text-ink">{title}</span>
      {subtitle && <span className="text-sm text-muted">{subtitle}</span>}
    </button>
  );
}

/** Píldora seleccionable compacta (para selectores de cantidad). */
export function PillOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-14 items-center justify-center rounded-xl border text-lg font-semibold transition-all",
        selected
          ? "border-accent bg-accent text-accent-fg"
          : "border-line bg-surface text-ink hover:border-accent/40"
      )}
    >
      {children}
    </button>
  );
}

export function StepTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
      {children}
    </h2>
  );
}
