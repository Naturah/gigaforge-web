/**
 * Client-only rendering approach to completely bypass hydration issues
 * This is a radical solution when traditional SSR hydration causes persistent errors
 */

import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
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
 * Pure client-side rendering approach
 * This completely bypasses hydration by creating a fresh client-only render
 */
function initializeClient() {
  console.log("Creating app container");
  
  // Get the container element where we'll attach our app
  const rootContainer = document.getElementById("remix-app-root");
  
  if (!rootContainer) {
    console.error("Could not find root container element #remix-app-root");
    return;
  }
  
  // Instead of hydrating, we'll create a completely new client-side render
  // First, save any important attributes and content we need to preserve
  const rootAttributes = {};
  Array.from(rootContainer.attributes).forEach(attr => {
    rootAttributes[attr.name] = attr.value;
  });
  
  // Create a temporary element to hold the content
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = rootContainer.innerHTML;
  
  // Extract any important non-React content that needs to be preserved
  // For example, scripts or styles that were added outside of React
  const nonReactContent = Array.from(tempContainer.querySelectorAll("script:not([src]), style"))
    .map(node => node.cloneNode(true));
  
  // Now clear the container completely to avoid hydration mismatches
  rootContainer.innerHTML = "";
  
  // Restore any attributes
  for (const [key, value] of Object.entries(rootAttributes)) {
    if (key !== "id") { // Don't reset the id
      rootContainer.setAttribute(key, value);
    }
  }
  
  // Add a placeholder while we load
  const loadingEl = document.createElement("div");
  loadingEl.className = "loading-indicator";
  loadingEl.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; width: 100%;">
      <div style="text-align: center;">
        <div style="border: 4px solid rgba(255, 255, 255, 0.1); border-left-color: rgba(255, 255, 255, 0.8); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 20px; color: rgba(255, 255, 255, 0.8);">Loading GigaForge...</p>
      </div>
    </div>
    <style>
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
  `;
  rootContainer.appendChild(loadingEl);
  
  console.log("Starting client-side render (no hydration)...");
  
  try {
    // Add non-React content back
    nonReactContent.forEach(node => {
      document.head.appendChild(node.cloneNode(true));
    });
    
    // Determine if we're using Clerk
    const hasClerkKey = !!window.ENV?.CLERK_PUBLISHABLE_KEY;
    console.log("Has Clerk key:", hasClerkKey);
    
    // Short delay to ensure the browser has time to paint the loading indicator
    setTimeout(() => {
      // Remove the loading indicator
      if (loadingEl.parentNode) {
        loadingEl.parentNode.removeChild(loadingEl);
      }
      
      // Create a root for our app
      const reactRoot = createRoot(rootContainer);
      
      // Render with or without ClerkProvider based on availability of key
      if (hasClerkKey) {
        console.log("Rendering with ClerkProvider");
        reactRoot.render(
          <Suspense fallback={<div>Loading application...</div>}>
            <ClerkProvider publishableKey={window.ENV.CLERK_PUBLISHABLE_KEY}>
              <RemixBrowser />
            </ClerkProvider>
          </Suspense>
        );
      } else {
        console.log("Rendering without ClerkProvider");
        reactRoot.render(
          <Suspense fallback={<div>Loading application...</div>}>
            <RemixBrowser />
          </Suspense>
        );
      }
      
      console.log("Client-side render complete");
    }, 100);
  } catch (error) {
    console.error("Error during client-side rendering:", error);
    
    // Fallback content in case of rendering failure
    rootContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; color: white; background-color: #111; border: 1px solid #444; border-radius: 8px; margin: 20px;">
        <h2 style="color: #f55">Failed to load application</h2>
        <p>There was a problem initializing the application.</p>
        <p style="color: #999; font-size: 12px; margin-top: 10px;">Error: ${error?.message || 'Unknown error'}</p>
        <pre style="text-align: left; max-width: 500px; margin: 15px auto; overflow: auto; background: #222; padding: 10px; border-radius: 4px; font-size: 11px; color: #ddd;">
          ${error?.stack?.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;') || 'No stack trace available'}
        </pre>
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
  }, 50);
}
