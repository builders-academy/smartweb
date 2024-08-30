import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedRoutes = ["/dashboard", "/Chat"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isConnected = request.cookies.get("wallet_connected")?.value === "true";

  // Redirect to /dashboard if wallet is connected and path is /
  if (isConnected && path === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect to / if trying to access protected route without connection
  if (isProtectedRoute && !isConnected) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to protected routes if connected
  if (isProtectedRoute && isConnected) {
    return NextResponse.next();
  }

  // For all other cases, proceed with the request
  return NextResponse.next();
}

// Update the matcher to include the root path
export const config = {
  matcher: ["/", "/dashboard", "/Chat", "/dashboard/:path*", "/Chat/:path*"],
};
