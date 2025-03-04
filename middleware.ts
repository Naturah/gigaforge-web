import { authMiddleware } from "@clerk/remix/ssr.server";

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

export default authMiddleware({
  publicRoutes,
  ignoredRoutes,
  afterAuth(auth, req) {
    // Add security headers
    const headers = new Headers();
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' https://img.clerk.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com; style-src 'self' 'unsafe-inline' https://clerk.com;"
    );

    return new Response(null, {
      status: 200,
      headers
    });
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 