/**
 * Client-side rendering with Clerk authentication
 * Using a progressive enhancement approach
 */

import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/remix";

// Global type for ENV
declare global {
  interface Window {
    ENV?: {
      CLERK_PUBLISHABLE_KEY?: string;
    };
  }
}

console.log("entry.client.tsx loaded");

/**
 * ErrorBoundary for Clerk initialization
 */
class ClerkErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error) {
    console.error("Error initializing Clerk:", error);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
}

function hydrate() {
  startTransition(() => {
    const publishableKey = window.ENV?.CLERK_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      console.warn("No Clerk publishable key found in window.ENV");
    }
    
    // Create fallback app without Clerk
    const fallbackApp = (
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
    
    // Create app with Clerk if we have a publishable key
    const appWithClerk = publishableKey ? (
      <StrictMode>
        <ClerkErrorBoundary fallback={fallbackApp}>
          <ClerkProvider publishableKey={publishableKey}>
            <RemixBrowser />
          </ClerkProvider>
        </ClerkErrorBoundary>
      </StrictMode>
    ) : fallbackApp;
    
    try {
      hydrateRoot(document, appWithClerk);
      console.log("Client-side hydration complete");
    } catch (error) {
      console.error("Critical hydration error:", error);
      // Last resort fallback
      try {
        hydrateRoot(document, fallbackApp);
      } catch (fallbackError) {
        console.error("Fatal: Even fallback hydration failed", fallbackError);
      }
    }
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
