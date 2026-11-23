import "server-only";

import { prisma, hasDatabase } from "@/lib/prisma";
import { safeDbRead } from "@/lib/db-safe";
import type { SessionPayload } from "@/lib/auth";

/**
 * MULTI-TENANT — resolución de la empresa activa.
 * ---------------------------------------------------------------------------
 * Por ahora la plataforma opera en modo "single-tenant": todos los datos
 * pertenecen a una empresa por defecto (slug "default"). La arquitectura queda
 * lista para múltiples empresas: cuando la sesión transporte `tenantId`, se usa
 * ese; si no, se cae a la empresa por defecto.
 *
 * El scoping de consultas por `tenantId` y las políticas RLS se aplican sobre
 * esta base en el siguiente incremento (requiere la base operativa para probar
 * el aislamiento de datos de punta a punta).
 */

export const DEFAULT_TENANT_SLUG = "default";
export const DEFAULT_TENANT_NAME = "Servicios Integrales";

let cachedDefaultTenantId: string | null | undefined;

/** Id de la empresa por defecto (cacheado por proceso). null en modo demo. */
export async function getDefaultTenantId(): Promise<string | null> {
  if (cachedDefaultTenantId !== undefined) return cachedDefaultTenantId;
  if (!hasDatabase()) {
    cachedDefaultTenantId = null;
    return null;
  }
  const tenant = await safeDbRead(
    () =>
      prisma.tenant.findUnique({
        where: { slug: DEFAULT_TENANT_SLUG },
        select: { id: true },
      }),
    null,
    "getDefaultTenantId"
  );
  cachedDefaultTenantId = tenant?.id ?? null;
  return cachedDefaultTenantId;
}

/** Empresa activa: la de la sesión si la trae, si no la por defecto. */
export async function getActiveTenantId(
  session?: SessionPayload | null
): Promise<string | null> {
  if (session?.tenantId) return session.tenantId;
  return getDefaultTenantId();
}
