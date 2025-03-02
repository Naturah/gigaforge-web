/**
 * Modified entry.client.tsx that uses an "island architecture" approach to avoid hydration issues.
 * Inspired by kiliman/remix-hydration-fix
 */

import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, Suspense } from "react";
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
 * Island Architecture approach with extra precautions for Clerk and Suspense
 */
function initializeClient() {
  // Create app root element
  const appRootElement = document.createElement("div");
  appRootElement.id = "app-root";
  
  // Get the container element where we'll attach our app
  const rootContainer = document.getElementById("remix-app-root") || document.body;
  
  // Save any existing attributes from the root container
  const rootAttributes = {};
  Array.from(rootContainer.attributes).forEach(attr => {
    rootAttributes[attr.name] = attr.value;
  });
  
  // Save container's existing classnames
  const rootClassNames = rootContainer.className;
  
  console.log("Creating app container");
  
  // Clear the container's contents
  rootContainer.innerHTML = "";
  
  // Set saved attributes on the app root element
  for (const [key, value] of Object.entries(rootAttributes)) {
    if (key !== "id") { // Don't copy the id
      appRootElement.setAttribute(key, value);
    }
  }
  
  // Copy className if it existed
  if (rootClassNames) {
    appRootElement.className = rootClassNames;
  }
  
  // Append our new root element to the container
  rootContainer.appendChild(appRootElement);
  
  console.log("Starting hydration...");
  
  try {
    // Determine if we're using Clerk
    const hasClerkKey = !!window.ENV?.CLERK_PUBLISHABLE_KEY;
    console.log("Has Clerk key:", hasClerkKey);
    
    // Create app with or without Clerk based on key availability
    if (hasClerkKey) {
      console.log("Using ClerkProvider");
      
      // First render a placeholder to give the browser time to stabilize
      const root = hydrateRoot(
        appRootElement, 
        <div id="app-placeholder">Loading application...</div>
      );
      
      // After a short delay, render the actual app
      setTimeout(() => {
        console.log("Rendering Clerk app");
        root.render(
          <Suspense fallback={<div>Loading application...</div>}>
            <ClerkProvider publishableKey={window.ENV.CLERK_PUBLISHABLE_KEY}>
              <RemixBrowser />
            </ClerkProvider>
          </Suspense>
        );
      }, 50);
    } else {
      console.log("Skipping ClerkProvider");
      
      // Render without Clerk
      hydrateRoot(
        appRootElement,
        <Suspense fallback={<div>Loading application...</div>}>
          <RemixBrowser />
        </Suspense>
      );
    }
    
    console.log("Hydration process initiated successfully");
  } catch (error) {
    console.error("Error during hydration:", error);
    
    // Fallback content in case of hydration failure
    appRootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: white; background-color: #111; border: 1px solid #444; border-radius: 8px; margin: 20px;">
        <h2 style="color: #f55">Failed to load application</h2>
        <p>There was a problem initializing the application.</p>
        <p style="color: #999; font-size: 12px; margin-top: 10px;">Error: ${error?.message || 'Unknown error'}</p>
        <button onclick="window.location.reload()" 
                style="padding: 10px 20px; background-color: #333; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 15px;">
          Reload page
        </button>
      </div>
    `;
  }
}

// Start the process after a short delay to ensure the DOM is fully loaded
if (typeof requestIdleCallback === "function") {
  requestIdleCallback(() => {
    initializeClient();
  });
} else {
  setTimeout(() => {
    initializeClient();
  }, 10);
}
