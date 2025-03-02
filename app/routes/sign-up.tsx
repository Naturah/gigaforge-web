import { SignUp } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";
import Logo from "~/components/logo";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up | GigaForge" },
    { name: "description", content: "Create your GigaForge account" }
  ];
};

export default function SignUpPage() {
  const [clerkReady, setClerkReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Clerk is properly initialized
    const hasValidClerkKey = window.ENV?.CLERK_PUBLISHABLE_KEY && 
                            !window.ENV.CLERK_PUBLISHABLE_KEY.includes('your_dev_key') &&
                            window.ENV.CLERK_PUBLISHABLE_KEY.trim() !== '';
    
    if (!hasValidClerkKey) {
      setError("Authentication system unavailable. Please try again later or contact support.");
    } else {
      setClerkReady(true);
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md text-center mb-6">
        <Logo />
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-2xl">
          <div className="mb-6 pb-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold mb-2">Join GigaForge</h1>
            <p className="text-gray-400">Create an account to start your 3D printing journey</p>
          </div>
          
          {error ? (
            <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-center">
              <p className="text-red-300">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Reload Page
              </button>
            </div>
          ) : !clerkReady ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <SignUp 
              routing="path" 
              path="/sign-up" 
              appearance={{
                elements: {
                  formButtonPrimary: 
                    "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
                  card: "bg-transparent shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: 
                    "border border-gray-600 bg-gray-900/70 hover:bg-gray-800 text-white",
                  formFieldInput: 
                    "bg-gray-900/70 border border-gray-600 text-white placeholder-gray-400",
                  formFieldLabel: "text-gray-200",
                  dividerLine: "bg-gray-600",
                  dividerText: "text-gray-300",
                  footer: "hidden",
                  formFieldErrorText: "text-red-400",
                  formFieldAction: "text-blue-400 hover:text-blue-300"
                }
              }}
            />
          )}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account? <a href="/sign-in" className="text-blue-400 hover:text-blue-300">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
} 