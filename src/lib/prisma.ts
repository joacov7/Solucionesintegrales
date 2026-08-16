import { PrismaClient } from "@prisma/client";

/**
 * Cliente Prisma singleton (evita múltiples conexiones en dev con hot-reload).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Indica si hay una base de datos configurada. Sin ella, la app corre en modo demo. */
export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
