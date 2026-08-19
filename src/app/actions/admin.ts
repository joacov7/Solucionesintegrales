"use server";

import { revalidatePath } from "next/cache";
import type { LeadStatus, CustomerType } from "@prisma/client";
import {
  updateSettings,
  updateProduct,
  updatePaymentMethod,
  updateService,
  createCustomer,
  updateLeadStatus,
  type WriteResult,
} from "@/data/admin";

export async function saveSettingsAction(
  entries: { key: string; value: string }[]
): Promise<WriteResult> {
  const res = await updateSettings(entries);
  revalidatePath("/admin/configuracion");
  revalidatePath("/admin");
  return res;
}

export async function saveProductAction(
  id: string,
  data: {
    priceUsd?: number;
    marginPct?: number;
    active?: boolean;
    stock?: number;
    lowStockThreshold?: number;
  }
): Promise<WriteResult> {
  const res = await updateProduct(id, data);
  revalidatePath("/admin/productos");
  revalidatePath("/admin/stock");
  revalidatePath("/admin");
  return res;
}

export async function savePaymentMethodAction(
  id: string,
  data: { financingCost?: number; downPaymentPct?: number; active?: boolean }
): Promise<WriteResult> {
  const res = await updatePaymentMethod(id, data);
  revalidatePath("/admin/financiacion");
  return res;
}

export async function saveServiceAction(
  id: string,
  data: { priceArs?: number; estimatedMin?: number; active?: boolean }
): Promise<WriteResult> {
  const res = await updateService(id, data);
  revalidatePath("/admin/servicios");
  return res;
}

export async function createCustomerAction(data: {
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
  const res = await createCustomer(data);
  revalidatePath("/admin/clientes");
  return res;
}

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus
): Promise<WriteResult> {
  const res = await updateLeadStatus(id, status);
  revalidatePath("/admin/leads");
  return res;
}
