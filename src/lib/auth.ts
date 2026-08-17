/**
 * AUTENTICACIÓN (interina, lista para reemplazar por Supabase Auth)
 * ---------------------------------------------------------------------------
 * Protege /admin y /installer con una sesión firmada (HMAC-SHA256) guardada en
 * cookie. Los roles y la verificación viven acá para poder cambiar la fuente de
 * identidad por Supabase Auth sin tocar el resto de la app.
 *
 * Comportamiento:
 *  - Si NO hay contraseñas configuradas por entorno, la protección se
 *    DESACTIVA (modo dev/demo abierto), coherente con el resto de la plataforma.
 *  - Si hay contraseñas, se exige login.
 *
 * Variables de entorno:
 *  - AUTH_SECRET            → clave para firmar la sesión (obligatoria en prod)
 *  - AUTH_ADMIN_PASSWORD    → habilita el login de administración/ventas
 *  - AUTH_INSTALLER_PASSWORD→ habilita el login de instaladores
 *
 * NOTA: usa solo Web Crypto para funcionar también en el runtime edge (middleware).
 */

export type Role = "ADMIN" | "INSTALLER";

export const SESSION_COOKIE = "si_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

type SessionPayload = { role: Role; exp: number };

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-insecure-secret-change-me";
}

/** ¿Está activada la protección? (hay al menos una contraseña configurada) */
export function authEnabled(): boolean {
  return Boolean(
    process.env.AUTH_ADMIN_PASSWORD || process.env.AUTH_INSTALLER_PASSWORD
  );
}

/** Valida una contraseña y devuelve el rol correspondiente, o null. */
export function verifyPassword(password: string): Role | null {
  const admin = process.env.AUTH_ADMIN_PASSWORD;
  const installer = process.env.AUTH_INSTALLER_PASSWORD;
  if (admin && password === admin) return "ADMIN";
  if (installer && password === installer) return "INSTALLER";
  return null;
}

// --- Codificación base64url segura para edge y node ------------------------
function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function strToB64url(str: string): string {
  return bytesToB64url(new TextEncoder().encode(str));
}

function b64urlToStr(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return bytesToB64url(new Uint8Array(sig));
}

/** Crea el token de sesión firmado para un rol. */
export async function createSessionToken(role: Role): Promise<string> {
  const payload: SessionPayload = { role, exp: Date.now() + SESSION_TTL_MS };
  const data = strToB64url(JSON.stringify(payload));
  const sig = await sign(data);
  return `${data}.${sig}`;
}

/** Verifica el token y devuelve el payload, o null si es inválido/expirado. */
export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expected = await sign(data);
  if (expected !== sig) return null;
  try {
    const payload = JSON.parse(b64urlToStr(data)) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000;
