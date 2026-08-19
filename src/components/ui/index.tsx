import Link from "next/link";
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
type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-fg hover:bg-brand/90",
  accent: "bg-accent text-accent-fg hover:bg-accent/90",
  outline: "border border-line bg-surface text-ink hover:bg-brand-soft",
  ghost: "text-ink hover:bg-brand-soft",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebe5a]",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ComponentProps<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

type LinkButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  href,
  external,
  className,
  children,
}: LinkButtonProps) {
  const cls = cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
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
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-6 shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

// --- Badge -----------------------------------------------------------------
export function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-ink",
        className
      )}
    >
      {children}
    </span>
  );
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
