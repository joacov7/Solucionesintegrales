import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Logotipo: usa imagen si está configurada, si no un logotipo tipográfico. */
export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)}>
      {siteConfig.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={siteConfig.logo} alt={siteConfig.name} className="h-8 w-auto" />
      ) : (
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-xl",
            light ? "bg-white/10 text-white" : "bg-brand text-brand-fg"
          )}
        >
          <Icon name="shield" className="h-5 w-5 text-accent" />
        </span>
      )}
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          light ? "text-white" : "text-ink"
        )}
      >
        {siteConfig.name}
      </span>
    </Link>
  );
}
