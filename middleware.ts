import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-shared";

/** فحص أولي سريع: من لا يملك كوكي جلسة يُحوَّل لتسجيل الدخول (التحقق الفعلي في الخادم) */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname !== "/admin/login" && !req.cookies.has(SESSION_COOKIE)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
