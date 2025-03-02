/**
 * Client-side rendering with Clerk authentication
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
    
    // Always wrap with ClerkProvider - let the provider itself handle 
    // the validation of the key rather than adding complex conditionals
    hydrateRoot(
      document,
      <StrictMode>
        <ClerkProvider publishableKey={publishableKey}>
          <RemixBrowser />
        </ClerkProvider>
      </StrictMode>
    );
    
    console.log("Client-side hydration complete");
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
