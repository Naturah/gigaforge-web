import { createClerkClient } from "@clerk/remix/api.server";
import type { NextRequest, NextResponse } from '@vercel/remix';

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default function middleware(request: NextRequest) {
  const publicRoutes = [
    "/",
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

  // Check if the current path matches any public routes
  const isPublicRoute = publicRoutes.some(route => 
    new RegExp(`^${route.replace(/\*/g, '.*')}$`).test(request.nextUrl.pathname)
  );

  // Check if the current path matches any ignored routes
  const isIgnoredRoute = ignoredRoutes.some(route => 
    new RegExp(`^${route.replace(/\*/g, '.*')}$`).test(request.nextUrl.pathname)
  );

  if (isPublicRoute || isIgnoredRoute) {
    return addSecurityHeaders(request);
  }

  // For all other routes, verify authentication
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  
  try {
    const session = clerk.sessions.getToken(request);
    if (!session) {
      return Response.redirect(new URL('/sign-in', request.url));
    }
    return addSecurityHeaders(request);
  } catch (error) {
    console.error('Auth error:', error);
    return Response.redirect(new URL('/sign-in', request.url));
  }
}

function addSecurityHeaders(request: NextRequest): Response {
  const response = new Response(null, {
    status: 200,
    headers: new Headers({
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' https://img.clerk.com data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com; style-src 'self' 'unsafe-inline' https://clerk.com;"
    })
  });

  return response;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 