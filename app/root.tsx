import * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { ClerkApp, ClerkProvider } from '@clerk/remix';
import { rootAuthLoader } from '@clerk/remix/ssr.server';
import Nav from "./components/nav";

import styles from "./tailwind.css?url";

// Check for required environment variables
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.error(
    `Missing Clerk environment variables in ${process.env.NODE_ENV} environment. ` +
    "Authentication will not work properly. " +
    "Make sure to add CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to your environment."
  );
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

// Try to use Clerk's root loader, but don't crash if it fails
export const loader: LoaderFunction = async (args) => {
  try {
    return await rootAuthLoader(args, ({ request }) => {
      return {
        ENV: {
          CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || ''
        }
      };
    });
  } catch (error) {
    console.error("Error in rootAuthLoader:", error);
    return {
      ENV: {
        CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || ''
      }
    };
  }
};

// Custom error boundary for Clerk components
class ClerkErrorBoundary extends React.Component<
  {children: React.ReactNode, fallback: React.ReactNode}, 
  {hasError: boolean}
> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    console.error("Error in ClerkProvider:", error);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}

function App() {
  const data = useLoaderData<typeof loader>();
  const publishableKey = data.ENV.CLERK_PUBLISHABLE_KEY;
  
  // Create layout without Clerk as fallback
  const layout = (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white">
        <Nav />
        <main className="min-h-screen">
          <Outlet />
        </main>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
  
  // If we have a publishable key, try to wrap with ClerkProvider
  if (publishableKey) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body className="bg-black text-white">
          <ClerkErrorBoundary fallback={<>{layout.props.children}</>}>
            <ClerkProvider publishableKey={publishableKey}>
              <Nav />
              <main className="min-h-screen">
                <Outlet />
              </main>
            </ClerkProvider>
          </ClerkErrorBoundary>
          <ScrollRestoration />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
          <Scripts />
        </body>
      </html>
    );
  }
  
  // Fallback to layout without Clerk if no publishable key
  return layout;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <html lang="en">
      <head>
        <title>Error - GigaForge</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black text-white">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-black/40 backdrop-blur-lg border border-red-500/30 p-8 rounded-xl max-w-xl w-full text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              {isRouteErrorResponse(error)
                ? `${error.status} ${error.statusText}`
                : error instanceof Error
                ? error.message
                : "An unexpected error occurred"}
            </h1>
            <a
              href="/"
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-colors inline-block mt-4"
            >
              Return to Home
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

// Wrap the App component with ClerkApp
export default ClerkApp(App);
