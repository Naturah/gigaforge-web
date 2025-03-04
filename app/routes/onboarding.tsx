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
          <h2 className="text-xl font-semibold mb-2">Loading your profile...</h2>
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
        
        <div className="bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-xl p-2 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="relative">
            {/* Profile header decoration */}
            <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"></div>
            
            {/* Enhanced content container */}
            <div className="relative z-10 p-6">
              <UserProfile 
                appearance={{
                  baseTheme: "dark",
                  elements: {
                    rootBox: "font-sans",
                    card: "bg-transparent shadow-none border-0",
                    navbar: "hidden",
                    pageScrollBox: "p-0",
                    accordionTriggerButton: "bg-gray-900/70 hover:bg-gray-800/80 border border-gray-700/50 backdrop-blur-md rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
                    profilePage: {
                      rootBox: "gap-y-8"
                    },
                    profileSection: {
                      rootBox: "bg-gray-900/40 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 shadow-md transition-all duration-200 hover:shadow-lg"
                    },
                    formButtonPrimary: 
                      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200",
                    formButtonReset: "text-gray-300 hover:text-white transition-colors duration-200",
                    formFieldInput: 
                      "bg-gray-900/70 border border-gray-600/70 rounded-lg text-white placeholder-gray-400 backdrop-blur-md transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    formFieldLabel: "text-gray-200 font-medium",
                    userPreviewMainIdentifier: "text-white font-medium",
                    userPreviewSecondaryIdentifier: "text-gray-400",
                    headerTitle: "text-white text-2xl font-bold",
                    headerSubtitle: "text-gray-400",
                    avatarImageActionsUpload: "bg-blue-600 hover:bg-blue-700 transition-colors duration-200",
                    formFieldSuccessText: "text-green-400",
                    formFieldWarningText: "text-yellow-400",
                    formFieldErrorText: "text-red-400",
                    breadcrumbsItem: "text-gray-400",
                    breadcrumbsItemDivider: "text-gray-600",
                    iconButton: "text-gray-400 hover:text-white transition-colors duration-200",
                    navbarButton: "text-gray-400 hover:text-white transition-colors duration-200",
                    pageScrollBox: "p-0",
                    profileSectionPrimaryButton: "bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-lg shadow-sm hover:shadow-md",
                    profileSectionSecondaryButton: "text-gray-300 hover:text-white transition-colors duration-200",
                    badge: "bg-blue-500/20 text-blue-200 border border-blue-500/30 px-2 py-1 rounded-md text-xs font-medium"
                  }
                }}
              />
            </div>
          </div>
          
          <div className="mt-8 pb-4 text-center">
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