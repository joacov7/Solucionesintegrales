"use server";

import { cookies } from "next/headers";
import {
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  authConfigurationError,
} from "@/lib/auth";

export type LoginResult = { ok: boolean; message?: string; role?: string };

export async function loginAction(password: string): Promise<LoginResult> {
  const configurationError = authConfigurationError();
  if (configurationError) {
    return {
      ok: false,
      message: "El acceso administrativo no está configurado correctamente. Contactá al responsable del sistema.",
    };
  }

  const role = verifyPassword(password);
  if (!role) return { ok: false, message: "Contraseña incorrecta." };

  const installerId =
    role === "INSTALLER" ? process.env.AUTH_INSTALLER_ID : undefined;
  if (role === "INSTALLER" && !installerId) {
    return {
      ok: false,
      message: "El acceso de instalador todavía no está habilitado para una cuenta individual.",
    };
  }

  const token = await createSessionToken(role, installerId);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return { ok: true, role };
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
