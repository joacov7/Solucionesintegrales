import "server-only";

import { cookies } from "next/headers";
import { prisma, hasDatabase } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  verifySessionToken,
  type Role,
  type SessionPayload,
} from "@/lib/auth";

export async function getAuthenticatedSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireRole(roles: Role[]): Promise<SessionPayload | null> {
  const session = await getAuthenticatedSession();
  if (!session || !roles.includes(session.role)) return null;
  if (session.role === "INSTALLER" && !session.installerId) return null;
  return session;
}

export async function canAccessWorkOrder(
  workOrderId: string
): Promise<boolean> {
  const session = await getAuthenticatedSession();
  if (!session) return false;
  if (session.role === "ADMIN") return true;
  if (session.role !== "INSTALLER" || !session.installerId || !hasDatabase()) {
    return false;
  }

  const order = await prisma.workOrder.findFirst({
    where: { id: workOrderId, installerId: session.installerId },
    select: { id: true },
  });
  return Boolean(order);
}

export async function canAccessWorkOrderItem(
  itemId: string,
  workOrderId: string,
  kind: "item" | "checklist"
): Promise<boolean> {
  const session = await getAuthenticatedSession();
  if (!session) return false;
  if (session.role === "ADMIN") return true;
  if (session.role !== "INSTALLER" || !session.installerId || !hasDatabase()) {
    return false;
  }

  if (kind === "item") {
    const item = await prisma.workOrderItem.findFirst({
      where: {
        id: itemId,
        workOrderId,
        workOrder: { installerId: session.installerId },
      },
      select: { id: true },
    });
    return Boolean(item);
  }

  const checklist = await prisma.installationChecklistItem.findFirst({
    where: {
      id: itemId,
      workOrderId,
      workOrder: { installerId: session.installerId },
    },
    select: { id: true },
  });
  return Boolean(checklist);
}
