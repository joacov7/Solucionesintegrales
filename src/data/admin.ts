/**
 * CAPA DE ACCESO A DATOS — Administración (lecturas y escrituras).
 * Las escrituras requieren base de datos. En modo demo devuelven un aviso
 * amigable en lugar de fallar.
 */

import { prisma, hasDatabase } from "@/lib/prisma";
import type {
  QuoteStatus,
  WorkOrderStatus,
  LeadStatus,
  CustomerType,
} from "@prisma/client";

export type WriteResult = { ok: boolean; message: string };

const DEMO: WriteResult = {
  ok: false,
  message:
    "Modo demo (sin base de datos). Configurá DATABASE_URL y corré las migraciones para poder guardar cambios.",
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export type DashboardStats = {
  monthlySales: number;
  quotesSent: number;
  quotesAccepted: number;
  installationsPending: number;
  installationsDone: number;
  estimatedMargin: number;
  customers: number;
  products: number;
  leadsNew: number;
  demo: boolean;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!hasDatabase()) {
    return {
      monthlySales: 0,
      quotesSent: 0,
      quotesAccepted: 0,
      installationsPending: 0,
      installationsDone: 0,
      estimatedMargin: 0,
      customers: 0,
      products: 0,
      leadsNew: 0,
      demo: true,
    };
  }
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    accepted,
    quotesSent,
    quotesAccepted,
    pending,
    done,
    customers,
    products,
    leadsNew,
  ] = await Promise.all([
    prisma.quote.findMany({
      where: { status: "ACEPTADO", updatedAt: { gte: startOfMonth } },
      select: { saleTotal: true, profit: true },
    }),
    prisma.quote.count({ where: { status: "ENVIADO" } }),
    prisma.quote.count({ where: { status: "ACEPTADO" } }),
    prisma.workOrder.count({
      where: { status: { notIn: ["FINALIZADA", "CANCELADA"] } },
    }),
    prisma.workOrder.count({ where: { status: "FINALIZADA" } }),
    prisma.customer.count(),
    prisma.product.count(),
    prisma.lead.count({ where: { status: "NUEVO" } }),
  ]);

  const monthlySales = accepted.reduce((a, q) => a + Number(q.saleTotal), 0);
  const estimatedMargin = accepted.reduce((a, q) => a + Number(q.profit), 0);

  return {
    monthlySales,
    quotesSent,
    quotesAccepted,
    installationsPending: pending,
    installationsDone: done,
    estimatedMargin,
    customers,
    products,
    leadsNew,
    demo: false,
  };
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export async function updateSettings(
  entries: { key: string; value: string }[]
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.$transaction(
      entries.map((e) =>
        prisma.setting.upsert({
          where: { key: e.key },
          update: { value: e.value },
          create: { key: e.key, value: e.value },
        })
      )
    );
    return { ok: true, message: "Configuración guardada." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo guardar la configuración." };
  }
}

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------

export async function updateProduct(
  id: string,
  data: { priceUsd?: number; marginPct?: number; active?: boolean }
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.product.update({ where: { id }, data });
    return { ok: true, message: "Producto actualizado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo actualizar el producto." };
  }
}

// ---------------------------------------------------------------------------
// Métodos de pago / financiación
// ---------------------------------------------------------------------------

export async function updatePaymentMethod(
  id: string,
  data: { financingCost?: number; downPaymentPct?: number; active?: boolean }
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.paymentMethod.update({ where: { id }, data });
    return { ok: true, message: "Financiación actualizada." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo actualizar la financiación." };
  }
}

// ---------------------------------------------------------------------------
// Servicios (mano de obra)
// ---------------------------------------------------------------------------

export async function updateService(
  id: string,
  data: { priceArs?: number; estimatedMin?: number; active?: boolean }
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.service.update({ where: { id }, data });
    return { ok: true, message: "Servicio actualizado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo actualizar el servicio." };
  }
}

// ---------------------------------------------------------------------------
// Clientes
// ---------------------------------------------------------------------------

export type AdminCustomer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  locality: string | null;
  type: CustomerType;
  createdAt: Date;
};

export async function listCustomers(): Promise<AdminCustomer[]> {
  if (!hasDatabase()) return [];
  const rows = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    email: c.email,
    locality: c.locality,
    type: c.type,
    createdAt: c.createdAt,
  }));
}

export async function createCustomer(data: {
  name: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  taxId?: string;
  address?: string;
  locality?: string;
  type?: CustomerType;
  notes?: string;
}): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.customer.create({ data });
    return { ok: true, message: "Cliente creado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo crear el cliente." };
  }
}

// ---------------------------------------------------------------------------
// Leads (CRM)
// ---------------------------------------------------------------------------

export type AdminLead = {
  id: string;
  name: string;
  phone: string | null;
  service: string | null;
  locality: string | null;
  estimatedArs: number | null;
  source: string | null;
  status: LeadStatus;
  createdAt: Date;
};

export async function listLeads(): Promise<AdminLead[]> {
  if (!hasDatabase()) return [];
  const rows = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return rows.map((l) => ({
    id: l.id,
    name: l.name,
    phone: l.phone,
    service: l.service,
    locality: l.locality,
    estimatedArs: l.estimatedArs ? Number(l.estimatedArs) : null,
    source: l.source,
    status: l.status,
    createdAt: l.createdAt,
  }));
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.lead.update({ where: { id }, data: { status } });
    return { ok: true, message: "Lead actualizado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo actualizar el lead." };
  }
}

// ---------------------------------------------------------------------------
// Presupuestos
// ---------------------------------------------------------------------------

export type AdminQuote = {
  id: string;
  code: string;
  customerName: string | null;
  status: QuoteStatus;
  saleTotal: number;
  marginPct: number;
  createdAt: Date;
};

export async function listQuotes(): Promise<AdminQuote[]> {
  if (!hasDatabase()) return [];
  const rows = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
    take: 200,
  });
  return rows.map((q) => ({
    id: q.id,
    code: q.code,
    customerName: q.customer?.name ?? null,
    status: q.status,
    saleTotal: Number(q.saleTotal),
    marginPct: Number(q.marginPct),
    createdAt: q.createdAt,
  }));
}
