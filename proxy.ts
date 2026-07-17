import { type NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/admin/login" || path === "/admin/unauthorized-response") return NextResponse.next();
  try {
    const current = await getAuth().api.getSession({ headers: request.headers });
    if (current?.user.role === "admin") return NextResponse.next();
  } catch (error) {
    logger.error("admin.proxy_auth_failed", { path, error: String(error) });
  }
  return NextResponse.rewrite(new URL("/admin/unauthorized-response", request.url), { status: 401 });
}

export const config = { matcher: ["/admin/:path*"] };
