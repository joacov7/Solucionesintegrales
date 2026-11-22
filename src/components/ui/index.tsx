import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

// --- Container -------------------------------------------------------------
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}

// --- Button ----------------------------------------------------------------
export const buttonVariants = cva(
  "focus-ring inline-flex select-none items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-fg shadow-xs hover:bg-brand/90",
        accent: "bg-accent text-accent-fg shadow-xs hover:bg-accent/90",
        outline: "border border-line bg-surface text-ink hover:bg-surface-2",
        ghost: "text-ink hover:bg-brand-soft",
        subtle: "bg-brand-soft text-ink hover:bg-line/70",
        danger: "bg-danger text-white shadow-xs hover:bg-danger/90",
        whatsapp: "bg-[#25D366] text-white shadow-xs hover:bg-[#1ebe5a]",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type ButtonProps = VariantProps<typeof buttonVariants> & {
  loading?: boolean;
} & ComponentProps<"button">;

export function Button({
  variant,
  size,
  className,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}

type LinkButtonProps = VariantProps<typeof buttonVariants> & {
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

export function LinkButton({
  variant,
  size,
  href,
  external,
  className,
  children,
}: LinkButtonProps) {
  const cls = cn(buttonVariants({ variant, size }), className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

// --- Card ------------------------------------------------------------------
export function Card({
  className,
  interactive,
  children,
}: {
  className?: string;
  interactive?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-6 shadow-card",
        interactive && "transition-all hover:-translate-y-0.5 hover:shadow-pop",
        className
      )}
    >
      {children}
    </div>
  );
}

// --- Badge -----------------------------------------------------------------
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-brand-soft text-ink",
        accent: "bg-accent/10 text-accent",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
        outline: "border border-line text-muted",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export function Badge({
  className,
  tone,
  children,
}: VariantProps<typeof badgeVariants> & {
  className?: string;
  children: ReactNode;
}) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}

// --- Section heading -------------------------------------------------------
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
    </div>
  );
}

// --- Form primitives -------------------------------------------------------
export function Label({
  className,
  children,
  ...props
}: ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-ink", className)}
      {...props}
    >
      {children}
    </label>
  );
}

const fieldStyles =
  "focus-ring h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink placeholder:text-muted/70 transition-colors disabled:cursor-not-allowed disabled:bg-surface-2";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldStyles, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea className={cn(fieldStyles, "h-auto py-2.5", className)} {...props} />
  );
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(fieldStyles, "pr-8", className)} {...props}>
      {children}
    </select>
  );
}

/** Campo con etiqueta, ayuda y mensaje de error opcionales. */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <p className="mt-1 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

// --- Misc primitives -------------------------------------------------------
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-brand-soft",
        "after:absolute after:inset-0 after:-translate-x-full after:animate-shimmer",
        "after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent",
        className
      )}
    />
  );
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-5 w-5 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-line bg-surface-2 px-1.5 font-sans text-[11px] font-medium text-muted">
      {children}
    </kbd>
  );
}
