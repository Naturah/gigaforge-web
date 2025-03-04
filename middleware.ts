import { createRemixRequestHandler } from '@remix-run/server-runtime';
import { getAuth } from '@clerk/remix/ssr.server';

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

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (isPublic(path) || isIgnored(path)) {
    return addSecurityHeaders(new Response(null, { status: 200 }));
  }

  try {
    const { userId } = await getAuth(request);
    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', request.url);
      return Response.redirect(signInUrl);
    }
    return addSecurityHeaders(new Response(null, { status: 200 }));
  } catch (error) {
    console.error('Auth error:', error);
    return Response.redirect(new URL('/sign-in', request.url));
  }
}

function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' https://img.clerk.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com; style-src 'self' 'unsafe-inline' https://clerk.com;"
  );

  return new Response(response.body, {
    status: response.status,
    headers
  });
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 