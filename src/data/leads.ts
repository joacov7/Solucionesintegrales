/**
 * CAPA DE ACCESO A DATOS — Leads (CRM básico).
 * Cada formulario público guarda un lead. En modo demo (sin DB) no persiste,
 * pero no rompe el flujo (el usuario igual va a WhatsApp con su mensaje).
 */

import type { Prisma } from "@prisma/client";
import { prisma, hasDatabase } from "@/lib/prisma";

export type NewLead = {
  name: string;
  phone?: string;
  email?: string;
  service?: string;
  locality?: string;
  estimatedArs?: number;
  source?: string;
  payload?: unknown;
};

export type LeadResult = { ok: boolean; id?: string; persisted: boolean };

export async function createLead(input: NewLead): Promise<LeadResult> {
  if (!hasDatabase()) {
    // Modo demo: no persistimos, pero devolvemos ok para no cortar el flujo.
    return { ok: true, persisted: false };
  }
  try {
    const lead = await prisma.lead.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email,
        service: input.service,
        locality: input.locality,
        estimatedArs: input.estimatedArs,
        source: input.source,
        payload: input.payload
          ? (input.payload as Prisma.InputJsonValue)
          : undefined,
      },
    });
    return { ok: true, id: lead.id, persisted: true };
  } catch (e) {
    console.error("createLead error", e);
    return { ok: false, persisted: false };
  }
}
