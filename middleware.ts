import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/auth/sign-in",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/change-password",
  "/auth/profile",
  "/api/auth",
  "/courses",
  "/apply",
  "/about",
  "/contact",
  "/faq",
  "/help",
  "/privacy",
  "/terms",
  "/cookies",
  "/admissions",
  "/blog",
  "/gallery",
  "/updates",
  "/library",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and API routes
  if (
    pathname === "/" ||
    PUBLIC_PATHS.filter((p) => p !== "/").some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for session cookie.
  // Better Auth can store the token under multiple cookie names depending on the version and environment:
  // - "better-auth.session_token"        → standard HTTP
  // - "better-auth.session_token.0"      → split cookie (large tokens)
  // - "__Secure-better-auth.session_token" → HTTPS/secure environments
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("better-auth.session_token.0") ||
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token.0");

  // Not authenticated - redirect to sign-in
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  // For authenticated routes, let the server-side handle role checks
  // This avoids Prisma in Edge Runtime
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - API routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
