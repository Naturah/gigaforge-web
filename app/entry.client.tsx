/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, Suspense, ErrorBoundary as ReactErrorBoundary } from "react";
import { hydrateRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/remix";

// Simple error boundary component
const ErrorFallback = ({ error }: { error: Error }) => {
  console.error("React error caught by boundary:", error);
  return (
    <div style={{ 
      padding: '20px',
      margin: '20px',
      border: '1px solid red',
      borderRadius: '5px',
      backgroundColor: '#ffeeee'
    }}>
      <h2 style={{ color: 'red' }}>Something went wrong</h2>
      <pre style={{ padding: '10px', backgroundColor: '#333', color: 'white', overflow: 'auto' }}>
        {error.message}
      </pre>
      <button onClick={() => window.location.reload()} style={{ 
        padding: '10px',
        marginTop: '10px',
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}>
        Try reloading
      </button>
    </div>
  );
};

// Error boundary wrapper
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Hydration error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error!} />;
    }
    return this.props.children;
  }
}

// Safe hydration with error boundaries
const hydrate = () => {
  console.log("Starting hydration...");
  
  // Check if window.ENV exists
  console.log("Window.ENV available:", window.ENV ? "Yes" : "No");
  console.log("Clerk publishable key:", window.ENV?.CLERK_PUBLISHABLE_KEY || "Not available");
  
  startTransition(() => {
    try {
      console.log("Attempting hydration...");
      
      // Extra-cautious approach with debugging
      if (window.ENV?.CLERK_PUBLISHABLE_KEY) {
        console.log("Using Clerk Provider for hydration");
        
        const AppWithClerk = (
          <StrictMode>
            <ErrorBoundary>
              <Suspense fallback={<div>Loading...</div>}>
                <ClerkProvider publishableKey={window.ENV.CLERK_PUBLISHABLE_KEY}>
                  <RemixBrowser />
                </ClerkProvider>
              </Suspense>
            </ErrorBoundary>
          </StrictMode>
        );
        
        hydrateRoot(document, AppWithClerk);
      } else {
        console.log("Skipping Clerk Provider due to missing key");
        
        const AppWithoutClerk = (
          <StrictMode>
            <ErrorBoundary>
              <Suspense fallback={<div>Loading...</div>}>
                <RemixBrowser />
              </Suspense>
            </ErrorBoundary>
          </StrictMode>
        );
        
        hydrateRoot(document, AppWithoutClerk);
      }
      
      console.log("Hydration complete");
    } catch (error) {
      console.error("Fatal error during hydration attempt:", error);
      
      // Ultimate fallback - extremely minimal approach
      try {
        console.log("Attempting minimal fallback hydration");
        hydrateRoot(
          document,
          <div>
            <h1>Something went wrong</h1>
            <p>The application encountered an error during initialization.</p>
            <button onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        );
      } catch (finalError) {
        console.error("Even minimal hydration failed:", finalError);
        // At this point, manually inject content if all else fails
        document.body.innerHTML = `
          <div style="padding: 20px; margin: 20px; text-align: center;">
            <h1>Fatal Application Error</h1>
            <p>The application could not be loaded.</p>
            <button onclick="window.location.reload()">Reload</button>
          </div>
        `;
      }
    }
  });
};

// Add global type for ENV
declare global {
  interface Window {
    ENV?: {
      CLERK_PUBLISHABLE_KEY?: string;
      [key: string]: any;
    };
  }
}

console.log("entry.client.tsx loaded, preparing to hydrate");

// Check for requestIdleCallback
if (window.requestIdleCallback) {
  console.log("Using requestIdleCallback");
  window.requestIdleCallback(hydrate);
} else {
  console.log("Using setTimeout fallback");
  window.setTimeout(hydrate, 1);
}
