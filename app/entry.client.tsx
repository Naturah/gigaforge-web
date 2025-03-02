/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, Suspense } from "react";
import { hydrateRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/remix";

// Add global type for ENV
declare global {
  interface Window {
    ENV?: {
      CLERK_PUBLISHABLE_KEY?: string;
      [key: string]: any;
    };
  }
}

// Simple error fallback component
const ErrorFallback = ({ error }: { error: Error }) => {
  console.error("React error caught by boundary:", error);
  return (
    <div style={{ 
      padding: '20px',
      margin: '20px',
      borderRadius: '5px',
      backgroundColor: '#111',
      border: '1px solid #444',
      color: '#fff'
    }}>
      <h2 style={{ color: '#f55' }}>Something went wrong</h2>
      <p>The application encountered an error during initialization.</p>
      <button onClick={() => window.location.reload()} style={{ 
        padding: '10px',
        marginTop: '10px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px'
      }}>
        Try reloading
      </button>
    </div>
  );
};

console.log("entry.client.tsx loaded, preparing to hydrate");

// We're going to use a two-phase approach to avoid hydration errors
// First render an empty shell that matches the server
const renderApp = () => {
  console.log("Starting initial hydration phase...");
  
  // Extract body content before hydration
  const bodyContent = document.body.innerHTML;
  
  try {
    // First perform a "silent" hydration with an empty app
    // This resets React's expectations and avoids hydration mismatches
    hydrateRoot(
      document,
      <Suspense fallback={null}>
        <div id="app-root" />
      </Suspense>
    );
    
    console.log("Initial hydration phase complete, preparing real app...");
    
    // Wait a moment for the initial hydration to complete
    setTimeout(() => {
      console.log("Starting real app hydration...");
      const appRoot = document.getElementById('app-root');
      
      if (appRoot) {
        try {
          const hasClerkKey = !!window.ENV?.CLERK_PUBLISHABLE_KEY;
          console.log("Has Clerk key:", hasClerkKey);
          
          // Create the real app element
          const App = hasClerkKey 
            ? (
              <StrictMode>
                <Suspense fallback={<div>Loading application...</div>}>
                  <ClerkProvider publishableKey={window.ENV.CLERK_PUBLISHABLE_KEY}>
                    <RemixBrowser />
                  </ClerkProvider>
                </Suspense>
              </StrictMode>
            ) 
            : (
              <StrictMode>
                <Suspense fallback={<div>Loading application...</div>}>
                  <RemixBrowser />
                </Suspense>
              </StrictMode>
            );
            
          // Replace the app-root content with our real app
          const appRootElement = document.createElement('div');
          appRoot.appendChild(appRootElement);
          
          // Render the real app into the app root
          const root = hydrateRoot(appRootElement, App);
          console.log("Real app hydration complete");
        } catch (error) {
          console.error("Error during real app hydration:", error);
          appRoot.innerHTML = '';
          const errorRoot = document.createElement('div');
          appRoot.appendChild(errorRoot);
          hydrateRoot(errorRoot, <ErrorFallback error={error as Error} />);
        }
      } else {
        console.error("App root element not found");
        document.body.innerHTML = '';
        const errorRoot = document.createElement('div');
        document.body.appendChild(errorRoot);
        hydrateRoot(errorRoot, <ErrorFallback error={new Error("App root element not found")} />);
      }
    }, 100);
  } catch (error) {
    console.error("Fatal error during initial hydration:", error);
    // Restore original content if initial hydration fails
    document.body.innerHTML = bodyContent;
  }
};

// Delay hydration to ensure the document is fully loaded
if (window.requestIdleCallback) {
  window.requestIdleCallback(renderApp);
} else {
  window.setTimeout(renderApp, 10);
}
