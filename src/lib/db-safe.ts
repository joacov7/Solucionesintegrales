import "server-only";

/**
 * Ejecuta una lectura de base de datos y devuelve un fallback si falla.
 * Evita que el panel caiga con error 500 cuando la base todavía no tiene las
 * tablas (ej: antes de correr el seed) o ante una falla transitoria.
 * Las ESCRITURAS no usan esto: deben informar el error al usuario.
 */
export async function safeDbRead<T>(
  fn: () => Promise<T>,
  fallback: T,
  label = "lectura"
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[db-safe] ${label} falló; se devuelve fallback.`, error);
    return fallback;
  }
}
