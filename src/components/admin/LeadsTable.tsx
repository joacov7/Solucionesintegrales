"use client";

import { useState } from "react";
import type { LeadStatus } from "@prisma/client";
import { formatArs } from "@/lib/pricing";
import { whatsappUrl, siteConfig } from "@/config/site";
import { updateLeadStatusAction } from "@/app/actions/admin";
import { TableWrap, Th, Td, StatusBadge } from "./ui";

const STATUSES: LeadStatus[] = [
  "NUEVO",
  "CONTACTADO",
  "PRESUPUESTADO",
  "GANADO",
  "PERDIDO",
];

export type AdminLeadRow = {
  id: string;
  name: string;
  phone: string | null;
  service: string | null;
  locality: string | null;
  estimatedArs: number | null;
  source: string | null;
  status: LeadStatus;
  createdAt: string;
};

export function LeadsTable({ leads }: { leads: AdminLeadRow[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
        Todavía no hay leads. Se cargan automáticamente cuando alguien usa los
        cotizadores o formularios del sitio.
      </div>
    );
  }
  return (
    <TableWrap>
      <thead>
        <tr>
          <Th>Contacto</Th>
          <Th>Servicio</Th>
          <Th>Estimado</Th>
          <Th>Origen</Th>
          <Th>Estado</Th>
          <Th />
        </tr>
      </thead>
      <tbody>
        {leads.map((l) => (
          <Row key={l.id} lead={l} />
        ))}
      </tbody>
    </TableWrap>
  );
}

function Row({ lead }: { lead: AdminLeadRow }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [saving, setSaving] = useState(false);

  async function change(next: LeadStatus) {
    setStatus(next);
    setSaving(true);
    await updateLeadStatusAction(lead.id, next);
    setSaving(false);
  }

  const wa = lead.phone
    ? whatsappUrl(
        `Hola ${lead.name}, te contactamos de ${siteConfig.name} por tu consulta.`,
        lead.phone.replace(/\D/g, "")
      )
    : null;

  return (
    <tr>
      <Td>
        <div className="font-medium text-ink">{lead.name}</div>
        <div className="text-xs text-muted">
          {lead.phone ?? "sin teléfono"} · {lead.locality ?? "—"}
        </div>
      </Td>
      <Td>{lead.service ?? "—"}</Td>
      <Td>{lead.estimatedArs ? formatArs(lead.estimatedArs) : "—"}</Td>
      <Td>
        <span className="text-xs text-muted">{lead.source ?? "—"}</span>
      </Td>
      <Td>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <select
            value={status}
            disabled={saving}
            onChange={(e) => change(e.target.value as LeadStatus)}
            className="h-8 rounded-lg border border-line px-2 text-xs"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </Td>
      <Td>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white"
          >
            WhatsApp
          </a>
        )}
      </Td>
    </tr>
  );
}
