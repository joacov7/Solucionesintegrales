/** Construcción de mensajes de WhatsApp (no envía: abre el chat pre-cargado). */

import { formatArs } from "./pricing";
import type { Solution } from "@/features/quoter/types";
import type { FinancingResult } from "./pricing";

export type QuoteMessageInput = {
  companyName: string;
  solution: Solution;
  paymentLabel: string;
  financing: FinancingResult;
  link?: string;
};

/** Mensaje de presupuesto con servicio, precio, anticipo, cuotas e incluye. */
export function buildQuoteMessage(input: QuoteMessageInput): string {
  const { solution, financing, paymentLabel } = input;
  const lines: string[] = [];
  lines.push(`*${input.companyName}* — Presupuesto`);
  lines.push("");
  lines.push(`*${solution.title}*`);
  lines.push("");
  lines.push("*Incluye:*");
  for (const l of solution.lines) {
    lines.push(`• ${l.quantity > 1 ? `${l.quantity}x ` : ""}${l.label}`);
  }
  lines.push("");
  lines.push(`*Precio contado:* ${formatArs(solution.saleTotal)}`);
  if (financing.financingCostAmount > 0) {
    lines.push(`*Financiación:* ${paymentLabel}`);
    lines.push(`*Total financiado:* ${formatArs(financing.financedTotal)}`);
    if (financing.downPayment > 0) {
      lines.push(`*Anticipo:* ${formatArs(financing.downPayment)}`);
    }
    lines.push(
      `*Cuotas:* ${financing.installments} x ${formatArs(financing.installmentValue)}`
    );
  }
  if (input.link) {
    lines.push("");
    lines.push(`Ver presupuesto: ${input.link}`);
  }
  return lines.join("\n");
}
