/**
 * Autenticación interina con sesiones HMAC. En producción falla cerrada:
 * requiere contraseñas y un secreto de firma fuerte.
 */
export type Role = "ADMIN" | "INSTALLER";

export type SessionPayload = {
  role: Role;
  exp: number;
  installerId?: string;
};

export const SESSION_COOKIE = "si_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 horas

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "dev-only-insecure-secret";
}

export function authEnabled(): boolean {
  return Boolean(
    process.env.AUTH_ADMIN_PASSWORD || process.env.AUTH_INSTALLER_PASSWORD
  );
}

export function authConfigurationError(): string | null {
  if (process.env.NODE_ENV !== "production") return null;
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    return "Falta AUTH_SECRET o tiene menos de 32 caracteres.";
  }
  if (!authEnabled()) {
    return "No hay contraseñas de acceso configuradas.";
  }
  if (process.env.AUTH_INSTALLER_PASSWORD && !process.env.AUTH_INSTALLER_ID) {
    return "AUTH_INSTALLER_ID es obligatorio cuando se habilita el acceso de instaladores.";
  }
  return null;
}

export function verifyPassword(password: string): Role | null {
  if (typeof password !== "string" || password.length < 1 || password.length > 256) {
    return null;
  }
  if (process.env.AUTH_ADMIN_PASSWORD && password === process.env.AUTH_ADMIN_PASSWORD) {
    return "ADMIN";
  }
  if (process.env.AUTH_INSTALLER_PASSWORD && password === process.env.AUTH_INSTALLER_PASSWORD) {
    return "INSTALLER";
  }
  return null;
}

function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function strToB64url(str: string): string {
  return bytesToB64url(new TextEncoder().encode(str));
}

function b64urlToStr(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(normalized);
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
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return bytesToB64url(new Uint8Array(signature));
}

export async function createSessionToken(
  role: Role,
  installerId?: string
): Promise<string> {
  const payload: SessionPayload = {
    role,
    exp: Date.now() + SESSION_TTL_MS,
    ...(role === "INSTALLER" && installerId ? { installerId } : {}),
  };
  const data = strToB64url(JSON.stringify(payload));
  return data + "." + await sign(data);
}

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token || token.length > 2048) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  try {
    const expected = await sign(parts[0]);
    if (expected !== parts[1]) return null;

    const payload = JSON.parse(b64urlToStr(parts[0])) as SessionPayload;
    if (
      (payload.role !== "ADMIN" && payload.role !== "INSTALLER") ||
      typeof payload.exp !== "number" ||
      !Number.isFinite(payload.exp) ||
      payload.exp <= Date.now()
    ) {
      return null;
    }
    if (
      payload.role === "INSTALLER" &&
      (typeof payload.installerId !== "string" || payload.installerId.length < 1)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_MS / 1000;
