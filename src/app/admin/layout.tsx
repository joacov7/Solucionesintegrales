import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false },
};

/**
 * Layout del panel administrativo.
 * NOTA (seguridad): en Fase 1 no hay autenticación. La arquitectura queda
 * preparada para Supabase Auth + roles (ADMIN, SELLER, INSTALLER, CUSTOMER)
 * y Row Level Security. Ver README para el plan de seguridad.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
