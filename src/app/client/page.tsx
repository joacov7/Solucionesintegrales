import type { Metadata } from "next";
import { ClientPortal } from "@/features/portal/ClientPortal";

export const metadata: Metadata = {
  title: "Portal de clientes",
  robots: { index: false },
};

/**
 * Portal de clientes (Fase 3).
 * Acceso por teléfono como stand-in mientras se integra Supabase Auth.
 * Con Auth + rol CUSTOMER y Row Level Security, cada cliente accederá
 * únicamente a su propia información.
 */
export default function ClientPortalPage() {
  return (
    <div className="min-h-dvh bg-brand-soft p-6">
      <div className="mx-auto max-w-2xl py-10">
        <ClientPortal />
      </div>
    </div>
  );
}
