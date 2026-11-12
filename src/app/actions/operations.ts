"use server";

import { revalidatePath } from "next/cache";
import { requireRole, canAccessWorkOrder, canAccessWorkOrderItem } from "@/lib/server-auth";
import type { QuoteStatus, WorkOrderStatus, MaintenanceType } from "@prisma/client";
import {
  createQuote,
  setQuoteStatus,
  updateWorkOrder,
  setWorkOrderItemInstalled,
  setChecklistItemDone,
  completeInstallation,
  createInstaller,
  createMaintenance,
  setMaintenanceDone,
  type NewQuote,
  type WriteResult,
  type CustomerPortalData,
} from "@/data/operations";

export async function createQuoteAction(input: NewQuote): Promise<WriteResult> {
  if (!(await requireRole(["ADMIN"]))) {
    return { ok: false, message: "No tenés permisos para realizar esta operación." };
  }

  const res = await createQuote(input);
  revalidatePath("/admin/presupuestos");
  return res;
}

export async function setQuoteStatusAction(
  id: string,
  status: QuoteStatus
): Promise<WriteResult> {
  if (!(await requireRole(["ADMIN"]))) {
    return { ok: false, message: "No tenés permisos para realizar esta operación." };
  }

  const res = await setQuoteStatus(id, status);
  revalidatePath(`/admin/presupuestos/${id}`);
  revalidatePath("/admin/presupuestos");
  revalidatePath("/admin/ordenes");
  return res;
}

export async function updateWorkOrderAction(
  id: string,
  data: {
    installerId?: string | null;
    status?: WorkOrderStatus;
    address?: string;
    scheduledAt?: Date | null;
    notes?: string;
  }
): Promise<WriteResult> {
  if (!(await requireRole(["ADMIN"]))) {
    return { ok: false, message: "No tenés permisos para realizar esta operación." };
  }

  const res = await updateWorkOrder(id, data);
  revalidatePath(`/admin/ordenes/${id}`);
  revalidatePath("/admin/ordenes");
  revalidatePath(`/installer/${id}`);
  revalidatePath("/installer");
  return res;
}

export async function toggleWorkOrderItemAction(
  itemId: string,
  installed: boolean,
  workOrderId: string
): Promise<WriteResult> {
  if (!(await canAccessWorkOrderItem(itemId, workOrderId, "item"))) {
    return { ok: false, message: "No tenés permisos para modificar esta orden." };
  }

  const res = await setWorkOrderItemInstalled(itemId, installed);
  revalidatePath(`/installer/${workOrderId}`);
  revalidatePath(`/admin/ordenes/${workOrderId}`);
  return res;
}

export async function toggleChecklistItemAction(
  itemId: string,
  done: boolean,
  workOrderId: string
): Promise<WriteResult> {
  if (!(await canAccessWorkOrderItem(itemId, workOrderId, "checklist"))) {
    return { ok: false, message: "No tenés permisos para modificar esta orden." };
  }

  const res = await setChecklistItemDone(itemId, done);
  revalidatePath(`/installer/${workOrderId}`);
  revalidatePath(`/admin/ordenes/${workOrderId}`);
  return res;
}

export async function completeInstallationAction(
  workOrderId: string,
  data: {
    observations?: string;
    photos?: string[];
    clientSignedOff: boolean;
    warranties?: {
      productName: string;
      serialNumber?: string;
      warrantyMonths: number;
    }[];
  }
): Promise<WriteResult> {
  if (!(await canAccessWorkOrder(workOrderId))) {
    return { ok: false, message: "No tenés permisos para finalizar esta orden." };
  }

  const res = await completeInstallation(workOrderId, data);
  revalidatePath(`/installer/${workOrderId}`);
  revalidatePath(`/admin/ordenes/${workOrderId}`);
  revalidatePath("/installer");
  revalidatePath("/admin/ordenes");
  return res;
}

export async function createInstallerAction(data: {
  name: string;
  phone?: string;
  email?: string;
}): Promise<WriteResult> {
  if (!(await requireRole(["ADMIN"]))) {
    return { ok: false, message: "No tenés permisos para realizar esta operación." };
  }

  const res = await createInstaller(data);
  revalidatePath("/admin/instaladores");
  return res;
}

export async function createMaintenanceAction(data: {
  installationId: string;
  type: MaintenanceType;
  scheduledAt?: Date | null;
  notes?: string;
}): Promise<WriteResult> {
  if (!(await requireRole(["ADMIN"]))) {
    return { ok: false, message: "No tenés permisos para realizar esta operación." };
  }

  const res = await createMaintenance(data);
  revalidatePath("/admin/mantenimiento");
  return res;
}

export async function setMaintenanceDoneAction(
  id: string,
  done: boolean
): Promise<WriteResult> {
  if (!(await requireRole(["ADMIN"]))) {
    return { ok: false, message: "No tenés permisos para realizar esta operación." };
  }

  const res = await setMaintenanceDone(id, done);
  revalidatePath("/admin/mantenimiento");
  return res;
}

/** El acceso por teléfono se deshabilita hasta implementar autenticación real. */
export async function lookupCustomerPortalAction(
  _phone: string
): Promise<{ ok: boolean; data: CustomerPortalData | null; message?: string }> {
  return {
    ok: false,
    data: null,
    message: "El portal está temporalmente deshabilitado mientras implementamos el acceso seguro. Escribinos por WhatsApp.",
  };
}
