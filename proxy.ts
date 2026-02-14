// middleware.ts
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

  // Better Auth default cookie names (dev + prod)
  const possibleCookies = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
  ];

  const sessionCookie = possibleCookies
    .map((name) => request.cookies.get(name))
    .find((cookie) => cookie?.value);

  const isLoggedIn = !!sessionCookie?.value;

  if (isLoggedIn) {
    if (pathname === "/" || pathname === "/signin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  else {
      const protectedRoutes = ["/dashboard"];
      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );
  
      if (isProtectedRoute)
        return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to almost everything except api/static/next internals
    "/((?!api|_next/static|_next/image|favicon.ico|static).*)",
  ],
};