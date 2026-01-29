import { NextResponse, type NextRequest } from "next/server";

import { AUTH_ROUTES, COOKIE, PROTECTED_ROUTES, ROUTES } from "@/lib/constants";

function isAuthenticated(request: NextRequest): boolean {
  const accessToken = request.cookies.get(COOKIE.ACCESS_TOKEN);
  return !!accessToken?.value;
}

export function handleAuthRedirects(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !authenticated) {
    return NextResponse.redirect(new URL(ROUTES.AUTH.LOGIN, request.url));
  }

  if (isAuthRoute && authenticated) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD.ROOT, request.url));
  }

  return null;
}

export function proxy(req: NextRequest): NextResponse | null {
  return handleAuthRedirects(req);
}
