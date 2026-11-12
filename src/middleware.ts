import { NextResponse, type NextRequest } from "next/server";
import {
  authConfigurationError,
  authEnabled,
  verifySessionToken,
  SESSION_COOKIE,
  type Role,
} from "@/lib/auth";

/**
 * El middleware protege las rutas; las Server Actions repiten la autorización
 * en el servidor porque no deben depender de que la UI esté protegida.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isInstaller = pathname.startsWith("/installer");
  if (!isAdmin && !isInstaller) return NextResponse.next();

  if (!authEnabled() && process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  const allowed = (role: Role) =>
    isAdmin ? role === "ADMIN" : role === "ADMIN" || role === "INSTALLER";

  if (!authConfigurationError() && session && allowed(session.role)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  if (authConfigurationError()) loginUrl.searchParams.set("setup", "required");
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/installer/:path*"],
};
