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
    ENV: {
      CLERK_PUBLISHABLE_KEY: string;
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
    if (!window.ENV?.CLERK_PUBLISHABLE_KEY) {
      console.warn("No Clerk publishable key found in window.ENV");
      return;
    }

    hydrateRoot(
      document,
      <StrictMode>
        <ClerkProvider publishableKey={window.ENV.CLERK_PUBLISHABLE_KEY}>
          <RemixBrowser />
        </ClerkProvider>
      </StrictMode>
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  window.setTimeout(hydrate, 1);
}
