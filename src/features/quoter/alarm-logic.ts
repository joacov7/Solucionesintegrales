/**
 * Motor de recomendación de alarmas (pura, sin UI).
 * Toma las respuestas del wizard y el catálogo ya cotizado (desde la DB) y
 * arma la "solución recomendada". No inventa precios: usa los del dataset.
 */

import type {
  AlarmAnswers,
  QuoterDataset,
  Solution,
  SolutionLine,
  PricedProduct,
} from "./types";
import { round2 } from "@/lib/pricing";

// SKUs usados por el armador (deben existir en el catálogo Vetti).
const SKU = {
  kit: "VET-KIT-STD",
  apertura: "VET-APE-PLUS",
  presencia: "VET-PRES-LR",
  sirenaKit: "VET-KIT-SIR-INAL",
  moduloOnOff: "VET-MOD-ONOFF",
} as const;

function find(products: PricedProduct[], sku: string) {
  return products.find((p) => p.sku === sku);
}

function service(dataset: QuoterDataset, slug: string) {
  return dataset.services.find((s) => s.slug === slug);
}

/** Construye la solución de alarma a partir de las respuestas. */
export function buildAlarmSolution(
  answers: AlarmAnswers,
  dataset: QuoterDataset
): Solution {
  const lines: SolutionLine[] = [];
  const notes: string[] = [];
  const { products } = dataset;

  const pushProduct = (sku: string, qty: number, label?: string) => {
    if (qty <= 0) return;
    const p = find(products, sku);
    if (!p) return;
    lines.push({
      label: label ?? p.name,
      quantity: qty,
      unitSale: p.salePrice,
      unitCost: p.unitCost,
      kind: "product",
    });
  };

  const pushService = (slug: string, qty: number, label?: string) => {
    if (qty <= 0) return;
    const s = service(dataset, slug);
    if (!s) return;
    lines.push({
      label: label ?? s.name,
      quantity: qty,
      unitSale: s.priceArs,
      unitCost: 0,
      kind: "service",
    });
  };

  // 1) Central (kit base) — siempre.
  pushProduct(SKU.kit, 1, "Central de alarma Vetti (kit base)");

  // 2) Sensores de apertura. El kit ya incluye 1; agregamos los adicionales.
  const openings = answers.openings ?? 1;
  const extraOpenings = Math.max(0, openings - 1);
  pushProduct(SKU.apertura, extraOpenings, "Sensor de apertura adicional (instalado)");

  // 3) Detección de movimiento (presencia). El kit incluye 1; si pide, reforzamos.
  if (answers.wantsMovement) {
    pushProduct(SKU.presencia, 1, "Sensor de presencia adicional (instalado)");
  }

  // 4) Automatización: un módulo por cada cosa a automatizar.
  const autoCount = answers.automation.filter((a) => a).length;
  if (autoCount > 0) {
    pushProduct(SKU.moduloOnOff, autoCount, "Módulo de automatización (instalado)");
  }

  // 5) Cámaras: la lista Uniview/Uniarch aún no tiene precios cargados, así que
  //    NO se cotizan acá. Se derivan al cotizador de cámaras.
  if (answers.cameras && answers.cameras > 0) {
    notes.push(
      `Sumaste ${answers.cameras}${answers.cameras >= 6 ? "+" : ""} cámara(s): se cotizan aparte en el cotizador de cámaras.`
    );
  }

  // 6) Mano de obra de instalación.
  pushService("inst-central", 1, "Instalación y puesta en marcha de la central");
  pushService("configuracion", 1, "Configuración de app y usuarios");
  if (extraOpenings > 0) pushService("inst-sensor-apertura", extraOpenings);
  if (answers.wantsMovement) pushService("inst-sensor-presencia", 1);

  const costTotal = round2(
    lines.reduce((a, l) => a + l.unitCost * l.quantity, 0)
  );
  const saleTotal = round2(
    lines.reduce((a, l) => a + l.unitSale * l.quantity, 0)
  );

  return {
    title: "Tu solución de seguridad recomendada",
    lines,
    notes,
    costTotal,
    saleTotal,
    profit: round2(saleTotal - costTotal),
  };
}
