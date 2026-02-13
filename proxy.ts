import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("better-auth.session_token")?.value;
  const isLoggedIn = !!sessionToken;

  if (isLoggedIn) {
    if (pathname === "/" || pathname === "/signin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  else {
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|static).*)",],
};