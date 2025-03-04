import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: [
    "/",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/trpc/(.*)",
  ],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/_next/static/(.*)",
    "/favicon.ico",
  ],
  // Add security headers
  afterAuth(auth, req, evt) {
    // Add security headers
    const response = evt.nextResponse;
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' https://img.clerk.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com; style-src 'self' 'unsafe-inline' https://clerk.com;"
    );
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 