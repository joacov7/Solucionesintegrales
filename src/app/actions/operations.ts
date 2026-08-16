"use server";

import { revalidatePath } from "next/cache";
import type { QuoteStatus, WorkOrderStatus } from "@prisma/client";
import {
  createQuote,
  setQuoteStatus,
  updateWorkOrder,
  setWorkOrderItemInstalled,
  setChecklistItemDone,
  completeInstallation,
  createInstaller,
  type NewQuote,
  type WriteResult,
} from "@/data/operations";

export async function createQuoteAction(input: NewQuote): Promise<WriteResult> {
  const res = await createQuote(input);
  revalidatePath("/admin/presupuestos");
  return res;
}

export async function setQuoteStatusAction(
  id: string,
  status: QuoteStatus
): Promise<WriteResult> {
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
  const res = await createInstaller(data);
  revalidatePath("/admin/instaladores");
  return res;
}
