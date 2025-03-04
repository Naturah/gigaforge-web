import type { LoaderFunction } from "@remix-run/node";
import { rootAuthLoader } from "@clerk/remix/ssr.server";

// Use Clerk's rootAuthLoader to handle OAuth callback
export const loader: LoaderFunction = (args) => {
  // Console log to help with debugging
  console.log("OAuth callback received at sign-up/sso-callback", args.request.url);
  
  // Let Clerk handle the OAuth callback
  return rootAuthLoader(args, {
    // After successful authentication, redirect to onboarding
    afterAuthRedirectUrl: "/onboarding"
  });
};

export default function SignUpOAuthCallbackPage() {
  // This component shows a loading state while the OAuth process completes
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="p-8 text-center">
        <div className="animate-pulse mb-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-600"></div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Completing authentication...</h2>
        <p className="text-gray-400">You'll be redirected in a moment</p>
      </div>
    </div>
  );
} 