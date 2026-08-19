/**
 * CAPA DE ACCESO A DATOS — Operaciones (Fase 2)
 * Presupuestos, órdenes de trabajo, instaladores e instalaciones.
 * Las escrituras requieren base de datos (DATABASE_URL).
 */

import { prisma, hasDatabase } from "@/lib/prisma";
import type {
  QuoteStatus,
  WorkOrderStatus,
  MaintenanceType,
} from "@prisma/client";
import { computeQuoteTotals, type QuoteLine } from "@/lib/pricing";
import { alarmChecklistTemplate } from "./initial-data";

export type WriteResult = { ok: boolean; message: string; id?: string };

const DEMO: WriteResult = {
  ok: false,
  message:
    "Modo demo (sin base de datos). Configurá DATABASE_URL y corré las migraciones para operar.",
};

// ---------------------------------------------------------------------------
// Presupuestos
// ---------------------------------------------------------------------------

export type NewQuoteItem = {
  kind: "product" | "service" | "custom";
  productId?: string;
  serviceId?: string;
  label: string;
  quantity: number;
  unitCost: number;
  unitSale: number;
};

export type NewQuote = {
  customerId?: string;
  paymentMethodId?: string;
  discountPct: number;
  notes?: string;
  items: NewQuoteItem[];
};

export async function createQuote(input: NewQuote): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  if (input.items.length === 0)
    return { ok: false, message: "Agregá al menos un ítem al presupuesto." };

  const lines: QuoteLine[] = input.items.map((i) => ({
    quantity: i.quantity,
    unitCost: i.unitCost,
    unitSale: i.unitSale,
  }));
  const totals = computeQuoteTotals(lines, input.discountPct);

  try {
    const quote = await prisma.quote.create({
      data: {
        customerId: input.customerId || null,
        paymentMethodId: input.paymentMethodId || null,
        discountPct: input.discountPct,
        costTotal: totals.costTotal,
        saleTotal: totals.saleTotal,
        profit: totals.profit,
        marginPct: totals.marginPct,
        notes: input.notes,
        status: "BORRADOR",
        items: {
          create: input.items.map((i) => ({
            productId: i.kind === "product" ? i.productId || null : null,
            serviceId: i.kind === "service" ? i.serviceId || null : null,
            label: i.label,
            quantity: i.quantity,
            unitCost: i.unitCost,
            unitSale: i.unitSale,
          })),
        },
      },
    });
    return { ok: true, message: "Presupuesto creado.", id: quote.id };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo crear el presupuesto." };
  }
}

export type QuoteDetail = {
  id: string;
  code: string;
  status: QuoteStatus;
  customerId: string | null;
  customerName: string | null;
  paymentMethodName: string | null;
  discountPct: number;
  costTotal: number;
  saleTotal: number;
  profit: number;
  marginPct: number;
  notes: string | null;
  createdAt: Date;
  items: {
    id: string;
    label: string;
    quantity: number;
    unitCost: number;
    unitSale: number;
  }[];
  hasWorkOrder: boolean;
  workOrderId: string | null;
};

export async function getQuote(id: string): Promise<QuoteDetail | null> {
  if (!hasDatabase()) return null;
  const q = await prisma.quote.findUnique({
    where: { id },
    include: {
      customer: true,
      paymentMethod: true,
      items: true,
      workOrders: { select: { id: true } },
    },
  });
  if (!q) return null;
  return {
    id: q.id,
    code: q.code,
    status: q.status,
    customerId: q.customerId,
    customerName: q.customer?.name ?? null,
    paymentMethodName: q.paymentMethod?.name ?? null,
    discountPct: Number(q.discountPct),
    costTotal: Number(q.costTotal),
    saleTotal: Number(q.saleTotal),
    profit: Number(q.profit),
    marginPct: Number(q.marginPct),
    notes: q.notes,
    createdAt: q.createdAt,
    items: q.items.map((i) => ({
      id: i.id,
      label: i.label,
      quantity: i.quantity,
      unitCost: Number(i.unitCost),
      unitSale: Number(i.unitSale),
    })),
    hasWorkOrder: q.workOrders.length > 0,
    workOrderId: q.workOrders[0]?.id ?? null,
  };
}

/**
 * Cambia el estado de un presupuesto. Al pasar a ACEPTADO, crea
 * automáticamente la orden de trabajo (con checklist de alarma) si no existe.
 */
export async function setQuoteStatus(
  id: string,
  status: QuoteStatus
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { items: true, workOrders: { select: { id: true } } },
    });
    if (!quote) return { ok: false, message: "Presupuesto no encontrado." };

    await prisma.quote.update({ where: { id }, data: { status } });

    if (status === "ACEPTADO" && quote.workOrders.length === 0) {
      if (!quote.customerId) {
        return {
          ok: true,
          message:
            "Presupuesto aceptado. Asigná un cliente para generar la orden de trabajo.",
        };
      }
      await prisma.workOrder.create({
        data: {
          quoteId: quote.id,
          customerId: quote.customerId,
          status: "PENDIENTE",
          items: {
            create: quote.items
              .filter((i) => i.productId)
              .map((i) => ({
                productId: i.productId,
                label: i.label,
                quantity: i.quantity,
              })),
          },
          checklist: {
            create: alarmChecklistTemplate.map((label, idx) => ({
              label,
              order: idx,
            })),
          },
        },
      });
      return {
        ok: true,
        message: "Presupuesto aceptado. Se generó la orden de trabajo.",
      };
    }
    return { ok: true, message: "Estado actualizado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo actualizar el presupuesto." };
  }
}

// ---------------------------------------------------------------------------
// Órdenes de trabajo
// ---------------------------------------------------------------------------

export type WorkOrderListItem = {
  id: string;
  code: string;
  status: WorkOrderStatus;
  customerName: string;
  installerName: string | null;
  scheduledAt: Date | null;
};

export async function listWorkOrders(
  installerId?: string
): Promise<WorkOrderListItem[]> {
  if (!hasDatabase()) return [];
  const rows = await prisma.workOrder.findMany({
    where: installerId ? { installerId } : {},
    include: { customer: true, installer: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return rows.map((w) => ({
    id: w.id,
    code: w.code,
    status: w.status,
    customerName: w.customer.name,
    installerName: w.installer?.name ?? null,
    scheduledAt: w.scheduledAt,
  }));
}

export type WorkOrderDetail = {
  id: string;
  code: string;
  status: WorkOrderStatus;
  customer: {
    name: string;
    phone: string | null;
    address: string | null;
    locality: string | null;
  };
  installerId: string | null;
  address: string | null;
  scheduledAt: Date | null;
  notes: string | null;
  items: { id: string; label: string; quantity: number; installed: boolean }[];
  checklist: { id: string; label: string; done: boolean; order: number }[];
  installation: {
    id: string;
    observations: string | null;
    photos: string[];
    clientSignedOff: boolean;
  } | null;
};

export async function getWorkOrder(id: string): Promise<WorkOrderDetail | null> {
  if (!hasDatabase()) return null;
  const w = await prisma.workOrder.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
      checklist: { orderBy: { order: "asc" } },
      installation: true,
    },
  });
  if (!w) return null;
  return {
    id: w.id,
    code: w.code,
    status: w.status,
    customer: {
      name: w.customer.name,
      phone: w.customer.phone,
      address: w.address ?? w.customer.address,
      locality: w.customer.locality,
    },
    installerId: w.installerId,
    address: w.address,
    scheduledAt: w.scheduledAt,
    notes: w.notes,
    items: w.items.map((i) => ({
      id: i.id,
      label: i.label,
      quantity: i.quantity,
      installed: i.installed,
    })),
    checklist: w.checklist.map((c) => ({
      id: c.id,
      label: c.label,
      done: c.done,
      order: c.order,
    })),
    installation: w.installation
      ? {
          id: w.installation.id,
          observations: w.installation.observations,
          photos: w.installation.photos,
          clientSignedOff: w.installation.clientSignedOff,
        }
      : null,
  };
}

export async function updateWorkOrder(
  id: string,
  data: {
    installerId?: string | null;
    status?: WorkOrderStatus;
    address?: string;
    scheduledAt?: Date | null;
    notes?: string;
  }
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.workOrder.update({ where: { id }, data });
    return { ok: true, message: "Orden actualizada." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo actualizar la orden." };
  }
}

export async function setWorkOrderItemInstalled(
  itemId: string,
  installed: boolean
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.workOrderItem.update({
      where: { id: itemId },
      data: { installed },
    });
    return { ok: true, message: "Ítem actualizado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo actualizar el ítem." };
  }
}

export async function setChecklistItemDone(
  itemId: string,
  done: boolean
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.installationChecklistItem.update({
      where: { id: itemId },
      data: { done },
    });
    return { ok: true, message: "Checklist actualizado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo actualizar el checklist." };
  }
}

/** Finaliza la instalación: crea el registro, garantías y marca la orden. */
export async function completeInstallation(
  workOrderId: string,
  data: {
    observations?: string;
    photos?: string[];
    clientSignedOff: boolean;
    warranties?: { productName: string; serialNumber?: string; warrantyMonths: number }[];
  }
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    const wo = await prisma.workOrder.findUnique({
      where: { id: workOrderId },
      include: { installation: true, items: true },
    });
    if (!wo) return { ok: false, message: "Orden no encontrada." };

    // Descuento de stock (solo la primera vez, para ítems instalados con producto).
    if (!wo.installation) {
      for (const item of wo.items) {
        if (item.productId && item.installed) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    }

    if (wo.installation) {
      await prisma.installation.update({
        where: { id: wo.installation.id },
        data: {
          observations: data.observations,
          photos: data.photos ?? [],
          clientSignedOff: data.clientSignedOff,
        },
      });
    } else {
      await prisma.installation.create({
        data: {
          workOrderId: wo.id,
          customerId: wo.customerId,
          installerId: wo.installerId,
          observations: data.observations,
          photos: data.photos ?? [],
          clientSignedOff: data.clientSignedOff,
          warranties: data.warranties?.length
            ? {
                create: data.warranties.map((w) => ({
                  productName: w.productName,
                  serialNumber: w.serialNumber,
                  warrantyMonths: w.warrantyMonths,
                })),
              }
            : undefined,
        },
      });
    }

    await prisma.workOrder.update({
      where: { id: workOrderId },
      data: { status: "FINALIZADA" },
    });
    return { ok: true, message: "Instalación registrada y orden finalizada." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo registrar la instalación." };
  }
}

// ---------------------------------------------------------------------------
// Instalaciones y garantías
// ---------------------------------------------------------------------------

export type InstallationRow = {
  id: string;
  customerName: string;
  installerName: string | null;
  installedAt: Date;
  clientSignedOff: boolean;
  warranties: { productName: string; serialNumber: string | null; warrantyMonths: number }[];
};

export async function listInstallations(): Promise<InstallationRow[]> {
  if (!hasDatabase()) return [];
  const rows = await prisma.installation.findMany({
    include: { customer: true, installer: true, warranties: true },
    orderBy: { installedAt: "desc" },
    take: 200,
  });
  return rows.map((i) => ({
    id: i.id,
    customerName: i.customer.name,
    installerName: i.installer?.name ?? null,
    installedAt: i.installedAt,
    clientSignedOff: i.clientSignedOff,
    warranties: i.warranties.map((w) => ({
      productName: w.productName,
      serialNumber: w.serialNumber,
      warrantyMonths: w.warrantyMonths,
    })),
  }));
}

// ---------------------------------------------------------------------------
// Instaladores
// ---------------------------------------------------------------------------

export type InstallerRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  active: boolean;
};

export async function listInstallers(activeOnly = false): Promise<InstallerRow[]> {
  if (!hasDatabase()) return [];
  const rows = await prisma.installer.findMany({
    where: activeOnly ? { active: true } : {},
    orderBy: { name: "asc" },
  });
  return rows.map((i) => ({
    id: i.id,
    name: i.name,
    phone: i.phone,
    email: i.email,
    active: i.active,
  }));
}

export async function createInstaller(data: {
  name: string;
  phone?: string;
  email?: string;
}): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.installer.create({ data });
    return { ok: true, message: "Instalador creado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo crear el instalador." };
  }
}

// ---------------------------------------------------------------------------
// Mantenimiento (Fase 3)
// ---------------------------------------------------------------------------

export type MaintenanceRow = {
  id: string;
  installationId: string;
  customerName: string;
  type: MaintenanceType;
  scheduledAt: Date | null;
  done: boolean;
  notes: string | null;
};

export async function listMaintenance(): Promise<MaintenanceRow[]> {
  if (!hasDatabase()) return [];
  const rows = await prisma.maintenance.findMany({
    include: { installation: { include: { customer: true } } },
    orderBy: [{ done: "asc" }, { scheduledAt: "asc" }],
    take: 200,
  });
  return rows.map((m) => ({
    id: m.id,
    installationId: m.installationId,
    customerName: m.installation.customer.name,
    type: m.type,
    scheduledAt: m.scheduledAt,
    done: m.done,
    notes: m.notes,
  }));
}

export type InstallationOption = { id: string; label: string };

export async function listInstallationOptions(): Promise<InstallationOption[]> {
  if (!hasDatabase()) return [];
  const rows = await prisma.installation.findMany({
    include: { customer: true },
    orderBy: { installedAt: "desc" },
    take: 200,
  });
  return rows.map((i) => ({
    id: i.id,
    label: `${i.customer.name} · ${new Date(i.installedAt).toLocaleDateString("es-AR")}`,
  }));
}

export async function createMaintenance(data: {
  installationId: string;
  type: MaintenanceType;
  scheduledAt?: Date | null;
  notes?: string;
}): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.maintenance.create({ data });
    return { ok: true, message: "Mantenimiento agendado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo agendar el mantenimiento." };
  }
}

export async function setMaintenanceDone(
  id: string,
  done: boolean
): Promise<WriteResult> {
  if (!hasDatabase()) return DEMO;
  try {
    await prisma.maintenance.update({ where: { id }, data: { done } });
    return { ok: true, message: "Mantenimiento actualizado." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "No se pudo actualizar." };
  }
}

// ---------------------------------------------------------------------------
// Portal de clientes (Fase 3)
// ---------------------------------------------------------------------------
// NOTA: sin autenticación todavía. El acceso es por teléfono como stand-in.
// Con Supabase Auth (rol CUSTOMER) + RLS, cada cliente verá solo su información.

export type CustomerPortalData = {
  customer: { id: string; name: string; locality: string | null };
  quotes: { id: string; code: string; status: QuoteStatus; saleTotal: number; createdAt: Date }[];
  workOrders: { id: string; code: string; status: WorkOrderStatus; scheduledAt: Date | null }[];
  installations: {
    id: string;
    installedAt: Date;
    warranties: { productName: string; warrantyMonths: number; startsAt: Date }[];
  }[];
  maintenance: { id: string; type: MaintenanceType; scheduledAt: Date | null; done: boolean }[];
};

export async function getCustomerPortal(
  phone: string
): Promise<CustomerPortalData | null> {
  if (!hasDatabase()) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return null;

  const customer = await prisma.customer.findFirst({
    where: {
      OR: [
        { phone: { contains: digits } },
        { whatsapp: { contains: digits } },
      ],
    },
    include: {
      quotes: { orderBy: { createdAt: "desc" } },
      workOrders: { orderBy: { createdAt: "desc" } },
      installations: {
        include: { warranties: true, maintenance: true },
        orderBy: { installedAt: "desc" },
      },
    },
  });
  if (!customer) return null;

  return {
    customer: { id: customer.id, name: customer.name, locality: customer.locality },
    quotes: customer.quotes.map((q) => ({
      id: q.id,
      code: q.code,
      status: q.status,
      saleTotal: Number(q.saleTotal),
      createdAt: q.createdAt,
    })),
    workOrders: customer.workOrders.map((w) => ({
      id: w.id,
      code: w.code,
      status: w.status,
      scheduledAt: w.scheduledAt,
    })),
    installations: customer.installations.map((i) => ({
      id: i.id,
      installedAt: i.installedAt,
      warranties: i.warranties.map((w) => ({
        productName: w.productName,
        warrantyMonths: w.warrantyMonths,
        startsAt: w.startsAt,
      })),
    })),
    maintenance: customer.installations.flatMap((i) =>
      i.maintenance.map((m) => ({
        id: m.id,
        type: m.type,
        scheduledAt: m.scheduledAt,
        done: m.done,
      }))
    ),
  };
}
