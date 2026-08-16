import type { IconName } from "@/config/services";
import { cn } from "@/lib/utils";

type Props = {
  name: IconName | "whatsapp" | "arrow-right" | "check" | "phone" | "mail" | "menu" | "x" | "spark";
  className?: string;
};

/** Set de íconos SVG inline (sin dependencias externas). */
export function Icon({ name, className }: Props) {
  const cls = cn("h-6 w-6", className);
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      );
    case "home":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M3 11l9-7 9 7" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
      );
    case "wifi":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M2 8.5a16 16 0 0120 0M5 12a11 11 0 0114 0M8 15.5a6 6 0 018 0" />
          <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "wrench":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M14.7 6.3a4 4 0 00-5.3 5.3L4 17l3 3 5.4-5.4a4 4 0 005.3-5.3l-2.5 2.5-2.1-.4-.4-2.1 2.5-2.5z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 2a8 8 0 016.8 12.2l.3.5-.6 2.2-2.3-.6-.5.3A8 8 0 1112 4zm-3 4c-.3 0-.6.1-.8.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.7 4.3 3.7 2.1.8 2.5.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.3-.2-.6-.4-.3-.2-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.1-.3.2-.5.1-.3-.1-1.1-.4-2-1.3-.8-.7-1.3-1.5-1.4-1.8-.1-.3 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5 0-.1-.6-1.4-.8-1.9-.2-.4-.4-.4-.6-.4h-.5z" />
        </svg>
      );
    case "arrow-right":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M5 12l5 5L20 7" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M4 5a1 1 0 011-1h3l2 5-2 1a11 11 0 005 5l1-2 5 2v3a1 1 0 01-1 1A16 16 0 014 5z" />
        </svg>
      );
    case "mail":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" className={cls} {...stroke}>
          <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
        </svg>
      );
    default:
      return null;
  }
}
