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
import { ClerkApp } from '@clerk/remix';
import { rootAuthLoader } from '@clerk/remix/ssr.server';
import Nav from "./components/nav";

import styles from "./tailwind.css?url";

// Check for required environment variables
if (!process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.warn(
    "Missing Clerk environment variables. Authentication will not work properly. " +
    "Make sure to add CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to your .env file."
  );
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

// Add Clerk's root loader
export const loader: LoaderFunction = args => {
  try {
    // Check if Clerk environment variables are valid
    const hasValidClerkKeys = 
      process.env.CLERK_PUBLISHABLE_KEY && 
      process.env.CLERK_SECRET_KEY && 
      !process.env.CLERK_PUBLISHABLE_KEY.includes('your_dev_key') &&
      !process.env.CLERK_SECRET_KEY.includes('your_dev_key');
    
    if (!hasValidClerkKeys) {
      console.warn(
        "Invalid Clerk environment variables detected. Authentication will not work properly. " +
        "Make sure to add valid CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to your .env file."
      );
      // Return a fallback response without Clerk
      return { 
        auth: { userId: null, sessionId: null, getToken: async () => null },
        ENV: { CLERK_PUBLISHABLE_KEY: '' }
      };
    }
    
    return rootAuthLoader(args, 
      ({ request }) => {
        // Return ENV to be available on the client
        return {
          ENV: {
            CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || ''
          }
        };
      }
    );
  } catch (error) {
    console.error("Error in rootAuthLoader:", error);
    // Return a fallback response that won't break the app
    return { 
      auth: { userId: null, sessionId: null, getToken: async () => null },
      ENV: { CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || '' }
    };
  }
};

// Custom error boundary for contents within the layout
class ContentErrorBoundary extends React.Component<
  {children: React.ReactNode}, 
  {hasError: boolean, error: Error | null}
> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error in route rendering:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 m-4 bg-black/40 backdrop-blur-lg border border-red-500/30 rounded-xl max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
          <p className="text-gray-300 mb-6">An error occurred while rendering this content.</p>
          <a
            href="/"
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-colors inline-block"
          >
            Return to Home
          </a>
        </div>
      );
    }
    
    return this.props.children;
  }
}

function App() {
  // Get ENV from loader
  const data = useLoaderData<{ ENV?: { CLERK_PUBLISHABLE_KEY?: string } }>();
  
  // Log what we're rendering
  console.log("Rendering App, ENV available:", !!data.ENV);
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white">
        {/* Main application container - this will be targeted by the island architecture */}
        <div id="remix-app-root" className="flex flex-col min-h-screen">
          <Nav />
          <div className="flex-grow">
            <Outlet />
          </div>
          <footer className="bg-black/60 backdrop-blur-lg border-t border-gray-800 py-6 mt-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-400">© 2023 GigaForge. All rights reserved.</p>
                </div>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">Terms</a>
                  <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
                  <a href="#" className="text-gray-400 hover:text-white">Contact</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <ScrollRestoration />
        {/* Pass ENV to window for client hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.ENV = ${JSON.stringify(data?.ENV || {})};
              console.log("ENV injected into window:", window.ENV);
            `
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

// Wrap the App component with ClerkApp
export default (() => {
  // More robust check for valid Clerk publishable key
  const hasValidPublishableKey = 
    typeof process.env.CLERK_PUBLISHABLE_KEY === 'string' && 
    process.env.CLERK_PUBLISHABLE_KEY.trim() !== '' && 
    !process.env.CLERK_PUBLISHABLE_KEY.includes('your_dev_key') &&
    (process.env.CLERK_PUBLISHABLE_KEY.startsWith('pk_test_') || 
     process.env.CLERK_PUBLISHABLE_KEY.startsWith('pk_live_'));
  
  // More robust check for valid Clerk secret key  
  const hasValidSecretKey = 
    typeof process.env.CLERK_SECRET_KEY === 'string' && 
    process.env.CLERK_SECRET_KEY.trim() !== '' && 
    !process.env.CLERK_SECRET_KEY.includes('your_dev_key') &&
    (process.env.CLERK_SECRET_KEY.startsWith('sk_test_') || 
     process.env.CLERK_SECRET_KEY.startsWith('sk_live_'));
  
  // Only use ClerkApp if both keys are valid
  if (hasValidPublishableKey && hasValidSecretKey) {
    return ClerkApp(App);
  } else {
    // Log detailed information about why Clerk isn't being used
    if (!hasValidPublishableKey) {
      console.warn("Clerk publishable key is invalid or missing. Using app without Clerk authentication.");
    }
    if (!hasValidSecretKey) {
      console.warn("Clerk secret key is invalid or missing. Using app without Clerk authentication.");
    }
    return App;
  }
})();

// Keep the exported ErrorBoundary function for Remix root error handling
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <title>{`${error.status} ${error.statusText}`}</title>
        </head>
        <body className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white">
          <div className="flex flex-col min-h-screen">
            <Nav />
            <div className="flex-grow flex items-center justify-center p-8">
              <div className="bg-black/40 backdrop-blur-lg border border-red-500/30 p-8 rounded-xl max-w-xl w-full text-center">
                <h1 className="text-4xl font-bold text-red-400 mb-4">
                  {error.status} {error.statusText}
                </h1>
                <p className="text-gray-300 mb-6">{error.data?.message || "An unexpected error occurred."}</p>
                <a
                  href="/"
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-colors inline-block"
                >
                  Return to Home
                </a>
              </div>
            </div>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Error</title>
      </head>
      <body className="bg-gradient-to-br from-gray-900 to-black min-h-screen text-white">
        <div className="flex flex-col min-h-screen">
          <Nav />
          <div className="flex-grow flex items-center justify-center p-8">
            <div className="bg-black/40 backdrop-blur-lg border border-red-500/30 p-8 rounded-xl max-w-xl w-full text-center">
              <h1 className="text-4xl font-bold text-red-400 mb-4">
                Application Error
              </h1>
              <p className="text-gray-300 mb-6">An unexpected error occurred.</p>
              <a
                href="/"
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-colors inline-block"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
