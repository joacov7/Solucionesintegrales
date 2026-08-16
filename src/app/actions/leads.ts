"use server";

import { z } from "zod";
import { createLead } from "@/data/leads";

const leadSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  service: z.string().optional(),
  locality: z.string().optional(),
  estimatedArs: z.number().optional(),
  source: z.string().optional(),
  payload: z.unknown().optional(),
});

export type LeadActionState = {
  ok: boolean;
  error?: string;
  persisted?: boolean;
};

/** Server action reutilizable por todos los formularios públicos. */
export async function submitLead(
  input: z.input<typeof leadSchema>
): Promise<LeadActionState> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const data = parsed.data;
  const res = await createLead({
    name: data.name,
    phone: data.phone || undefined,
    email: data.email || undefined,
    service: data.service,
    locality: data.locality,
    estimatedArs: data.estimatedArs,
    source: data.source,
    payload: data.payload,
  });
  return { ok: res.ok, persisted: res.persisted };
}
