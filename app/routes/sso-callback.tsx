import { OAuthCallback } from "@clerk/remix";
import type { LoaderFunction } from "@remix-run/node";
import { rootAuthLoader } from "@clerk/remix/ssr.server";

// Use Clerk's rootAuthLoader to handle OAuth callback
export const loader: LoaderFunction = args => 
  rootAuthLoader(args);

export default function OAuthCallbackPage() {
  // This component handles the OAuth callback flow
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="p-8 text-center">
        <div className="animate-pulse mb-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-600"></div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Completing sign in...</h2>
        <p className="text-gray-400">You'll be redirected in a moment</p>
      </div>
      <OAuthCallback />
    </div>
  );
} 