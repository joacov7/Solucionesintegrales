/**
 * Estimación preliminar de energía solar (pura, sin UI).
 * IMPORTANTE: devuelve un DIMENSIONAMIENTO técnico aproximado, NO un precio.
 * La propuesta final requiere evaluación técnica.
 */

export type SolarInput = {
  monthlyKwh: number; // consumo mensual aproximado
  wantsBackup: boolean;
  hasRoofSpace: boolean;
};

export type SolarEstimate = {
  systemKwp: number;
  panels: number;
  inverterKw: number;
  needsBatteries: boolean;
  roofAreaM2: number;
  monthlyCoverageKwh: number;
};

// Supuestos de dimensionamiento (aprox. para Argentina).
const KWH_PER_KWP_MONTH = 120; // ~4 h sol pico * 30 días
const PANEL_WATTS = 550;
const PANEL_AREA_M2 = 2.6;

export function estimateSolar(input: SolarInput): SolarEstimate {
  const systemKwp = Math.max(0.5, input.monthlyKwh / KWH_PER_KWP_MONTH);
  const panels = Math.ceil((systemKwp * 1000) / PANEL_WATTS);
  const inverterKw = Math.max(1, Math.ceil(systemKwp * 2) / 2); // redondeo a 0.5
  return {
    systemKwp: Math.round(systemKwp * 10) / 10,
    panels,
    inverterKw,
    needsBatteries: input.wantsBackup,
    roofAreaM2: Math.round(panels * PANEL_AREA_M2),
    monthlyCoverageKwh: Math.round(systemKwp * KWH_PER_KWP_MONTH),
  };
}
