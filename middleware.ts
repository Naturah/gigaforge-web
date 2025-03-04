import { withClerkMiddleware } from "@clerk/nextjs/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/api/trpc/(.*)",
];

const ignoredRoutes = [
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/_next/static/(.*)",
  "/favicon.ico",
];

function isPublic(path: string) {
  return publicRoutes.some(
    (publicRoute) => path.match(new RegExp(`^${publicRoute.replace(/\*/g, '.*')}$`))
  );
}

function isIgnored(path: string) {
  return ignoredRoutes.some(
    (ignoredRoute) => path.match(new RegExp(`^${ignoredRoute.replace(/\*/g, '.*')}$`))
  );
}

export default withClerkMiddleware((request: NextRequest) => {
  const path = request.nextUrl.pathname;

  if (isPublic(path) || isIgnored(path)) {
    return addSecurityHeaders(NextResponse.next());
  }

  // If the user is not signed in and the route is private, redirect them to sign in
  const { userId } = request.auth;
  if (!userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  return addSecurityHeaders(NextResponse.next());
});

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' https://img.clerk.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com; style-src 'self' 'unsafe-inline' https://clerk.com;"
  );
  return response;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 