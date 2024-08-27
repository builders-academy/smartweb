import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /Chat)
  const path = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/Chat"];

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Get the token from local storage (you might need to adjust this based on how you're storing the connection state)
  const isConnected = request.cookies.get("wallet_connected")?.value === "true";

  // If it's a protected route and the user is not connected, redirect to the home page
  if (isProtectedRoute && !isConnected) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If it's not a protected route or the user is connected, continue with the request
  return NextResponse.next();
}

// Specify the paths for which this middleware will run
export const config = {
  matcher: ["/dashboard", "/Chat", "/dashboard/:path*", "/Chat/:path*"],
};
