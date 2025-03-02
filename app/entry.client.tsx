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
      [key: string]: any;
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
    // Get the publishable key from the window ENV
    const publishableKey = window.ENV?.CLERK_PUBLISHABLE_KEY || '';
    
    // Log whether we have a publishable key
    if (publishableKey) {
      console.log("Using Clerk with publishable key:", publishableKey.substring(0, 10) + "...");
    } else {
      console.warn("No Clerk publishable key found in window.ENV");
    }
    
    // Two-phase mounting:
    // 1. First, mount the app without Clerk for immediate UI rendering
    // 2. Then, try to initialize Clerk with error boundaries
    
    const appWithoutClerk = (
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
    
    const appWithClerk = (
      <StrictMode>
        <ClerkErrorBoundary fallback={appWithoutClerk}>
          <ClerkProvider publishableKey={publishableKey}>
            <RemixBrowser />
          </ClerkProvider>
        </ClerkErrorBoundary>
      </StrictMode>
    );
    
    try {
      // Always attempt to render with Clerk, with a fallback if it fails
      hydrateRoot(document, publishableKey ? appWithClerk : appWithoutClerk);
      console.log("Client-side hydration complete");
    } catch (error) {
      console.error("Critical hydration error:", error);
      // Last resort fallback if even the error boundary fails
      try {
        hydrateRoot(document, appWithoutClerk);
        console.log("Fallback hydration complete");
      } catch (fallbackError) {
        console.error("Fatal: Even fallback hydration failed", fallbackError);
      }
    }
  });
}

// Initialize hydration when the DOM is ready
if (typeof window !== "undefined") {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(hydrate);
  } else {
    window.setTimeout(hydrate, 1);
  }
}
