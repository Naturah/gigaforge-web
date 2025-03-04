import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAuth } from "@clerk/remix/ssr.server";
import { UserProfile, useAuth } from "@clerk/remix";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  
  // If no userId, redirect to sign-in
  if (!userId) {
    return redirect("/sign-in");
  }
  
  return { userId };
};

export default function OnboardingPage() {
  const { userId } = useLoaderData<{userId: string}>();
  const { isLoaded, isSignedIn } = useAuth();
  
  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-pulse mb-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-600"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading your profile...</h2>
        </div>
      </div>
    );
  }
  
  // Redirect if not signed in on the client side
  if (!isSignedIn) {
    window.location.href = "/sign-in";
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Complete Your Profile</h1>
        
        {/* Apply a background style to UserProfile component */}
        <style jsx global>{`
          /* Target Clerk's main container */
          .cl-component {
            --clerk-primary: #3b82f6;
            --clerk-primary-hover: #2563eb;
            color-scheme: dark;
          }
          
          /* Target the main card */
          .cl-card, .cl-userProfile-root {
            background-color: transparent !important;
            background: rgba(0, 0, 0, 0.5) !important;
            border: 1px solid rgba(75, 85, 99, 0.3) !important;
            border-radius: 0.75rem !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          }
          
          /* Sections */
          .cl-profileSection-root {
            background-color: rgba(17, 24, 39, 0.6) !important;
            border: 1px solid rgba(75, 85, 99, 0.3) !important;
            border-radius: 0.5rem !important;
            padding: 1rem !important;
          }
          
          /* Form fields */
          .cl-formFieldInput, .cl-identityPreview {
            background-color: rgba(17, 24, 39, 0.7) !important;
            border: 1px solid rgba(75, 85, 99, 0.4) !important;
            color: white !important;
          }
          
          /* Text elements */
          .cl-headerTitle, .cl-headerSubtitle, .cl-userPreviewMainIdentifier, .cl-formFieldLabel {
            color: white !important;
          }
          
          .cl-userPreviewSecondaryIdentifier, .cl-formFieldInfoText {
            color: #9ca3af !important;
          }
          
          /* Buttons */
          .cl-formButtonPrimary {
            background: linear-gradient(to right, #3b82f6, #2563eb) !important;
            color: white !important;
          }
          
          .cl-formButtonPrimary:hover {
            filter: brightness(110%) !important;
          }
        `}</style>
        
        <div className="bg-black/30 backdrop-blur-xl p-0 rounded-xl overflow-hidden">
          <UserProfile 
            path="/onboarding"
            routing="path"
            appearance={{
              baseTheme: "dark"
            }}
          />
          
          <div className="p-4 text-center">
            <a 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 