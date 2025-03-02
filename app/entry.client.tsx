/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/remix";

// Safe hydration with error boundaries
const hydrate = () => {
  startTransition(() => {
    try {
      // Check if we have Clerk key available, wrap conditionally
      if (window.ENV?.CLERK_PUBLISHABLE_KEY) {
        hydrateRoot(
          document,
          <StrictMode>
            <ClerkProvider publishableKey={window.ENV.CLERK_PUBLISHABLE_KEY}>
              <RemixBrowser />
            </ClerkProvider>
          </StrictMode>
        );
      } else {
        // Skip Clerk if no publishable key is available
        hydrateRoot(
          document,
          <StrictMode>
            <RemixBrowser />
          </StrictMode>
        );
      }
    } catch (error) {
      console.error("Error during hydration:", error);
      // Fallback to simplified hydration without Clerk
      hydrateRoot(
        document,
        <StrictMode>
          <RemixBrowser />
        </StrictMode>
      );
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

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  window.setTimeout(hydrate, 1);
}
