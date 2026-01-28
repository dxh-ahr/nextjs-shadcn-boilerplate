import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];

const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/new-password",
  "/auth/verify-email",
  "/auth/verify-email-otp",
  "/auth/resend-verification-email",
];

function isAuthenticated(request: NextRequest): boolean {
  const accessToken = request.cookies.get("dxh_access_token");
  return !!accessToken?.value;
}

export function handleAuthRedirects(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !authenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthRoute && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return null;
}

export function proxy(req: NextRequest): NextResponse | null {
  return handleAuthRedirects(req);
}
