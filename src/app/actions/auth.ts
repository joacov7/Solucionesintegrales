"use server";

import { cookies } from "next/headers";
import {
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  authEnabled,
} from "@/lib/auth";

export type LoginResult = { ok: boolean; message?: string; role?: string };

export async function loginAction(password: string): Promise<LoginResult> {
  if (!authEnabled()) {
    return { ok: true, role: "ADMIN" }; // sin protección configurada
  }
  const role = verifyPassword(password);
  if (!role) return { ok: false, message: "Contraseña incorrecta." };

  const token = await createSessionToken(role);
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
