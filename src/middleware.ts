import { NextResponse, type NextRequest } from "next/server";
import {
  authEnabled,
  verifySessionToken,
  SESSION_COOKIE,
  type Role,
} from "@/lib/auth";

/**
 * Protege /admin y /installer. Si no hay contraseñas configuradas por entorno,
 * la protección se desactiva (modo dev/demo abierto).
 */
export async function middleware(req: NextRequest) {
  if (!authEnabled()) return NextResponse.next();

  const { pathname } = req.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isInstaller = pathname.startsWith("/installer");
  if (!isAdmin && !isInstaller) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  const allowed = (role: Role) =>
    isAdmin ? role === "ADMIN" : role === "ADMIN" || role === "INSTALLER";

  if (session && allowed(session.role)) return NextResponse.next();

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/installer/:path*"],
};
