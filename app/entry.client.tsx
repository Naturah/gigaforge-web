/**
 * Client-only rendering approach to completely bypass hydration issues
 * This is a radical solution when traditional SSR hydration causes persistent errors
 */

import * as React from "react";
import { RemixBrowser } from "@remix-run/react";
import { Suspense, useState, useEffect } from "react";
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
 * Safer wrapper for Clerk integration that includes error boundaries
 */
function SafeClerkApp() {
  const [error, setError] = useState<Error | null>(null);
  const [clerkAttempted, setClerkAttempted] = useState(false);
  
  // If there was an error rendering with Clerk, show the error or fallback
  if (error) {
    console.error("Error rendering with Clerk:", error);
    return <RemixBrowser />;
  }
  
  try {
    // Detect if we have a publishable key and it's valid
    const publishableKey = window.ENV?.CLERK_PUBLISHABLE_KEY || '';
    
    // More thorough validation of the key
    const isValidKey = 
      publishableKey && 
      publishableKey.trim() !== '' && 
      !publishableKey.includes('your_dev_key') &&
      (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'));
    
    // Only try to use Clerk if we have a properly formatted key
    if (isValidKey) {
      console.log("Using Clerk with publishable key:", publishableKey.substring(0, 10) + "...");
      
      return (
        <ErrorCatcher onError={(e) => {
          console.error("ClerkProvider error:", e);
          setError(e);
          setClerkAttempted(true);
        }}>
          <ClerkProvider publishableKey={publishableKey}>
            <RemixBrowser />
          </ClerkProvider>
        </ErrorCatcher>
      );
    } else {
      // Log a clear message about why Clerk isn't being used
      if (!publishableKey || publishableKey.trim() === '') {
        console.warn("Clerk publishable key is missing or empty");
      } else if (publishableKey.includes('your_dev_key')) {
        console.warn("Clerk publishable key contains placeholder text");
      } else if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
        console.warn("Clerk publishable key has invalid format");
      }
      
      console.warn("Rendering without Clerk authentication due to invalid key");
      return <RemixBrowser />;
    }
  } catch (e) {
    console.error("Error in SafeClerkApp:", e);
    return <RemixBrowser />;
  }
}

/**
 * Simple error boundary component
 */
class ErrorCatcher extends React.Component<{
  children: React.ReactNode;
  onError: (error: Error) => void;
}> {
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }
  
  render() {
    return this.props.children;
  }
}

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
      try {
        // Remove the loading indicator
        if (loadingEl.parentNode) {
          loadingEl.parentNode.removeChild(loadingEl);
        }
        
        // Create a root for our app
        const reactRoot = createRoot(rootContainer);
        
        // Wrap everything in a general try-catch in case there's an error during rendering
        try {
          console.log("Rendering with SafeClerkApp wrapper");
          
          // Always use the SafeClerkApp which will handle errors within Clerk
          reactRoot.render(
            <Suspense fallback={<div>Loading application...</div>}>
              <SafeClerkApp />
            </Suspense>
          );
          
          console.log("Client-side render complete");
        } catch (renderError) {
          console.error("Error during render:", renderError);
          
          // If there's an error rendering with SafeClerkApp, fall back to basic RemixBrowser
          reactRoot.render(
            <Suspense fallback={<div>Loading application...</div>}>
              <RemixBrowser />
            </Suspense>
          );
          
          console.log("Fallback render complete");
        }
      } catch (timeoutError) {
        console.error("Error in setTimeout callback:", timeoutError);
        displayErrorFallback(rootContainer, timeoutError);
      }
    }, 100);
  } catch (error) {
    console.error("Error during client-side rendering:", error);
    displayErrorFallback(rootContainer, error);
  }
}

// Helper function to display error fallback UI
function displayErrorFallback(container: HTMLElement, error: any) {
  container.innerHTML = `
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
