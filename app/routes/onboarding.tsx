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
        <h1 className="text-3xl font-bold mb-8">Complete Your Profile</h1>
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800">
          <UserProfile 
            appearance={{
              elements: {
                card: "bg-transparent shadow-none",
                navbar: "hidden",
                pageScrollBox: "p-0",
                formButtonPrimary: 
                  "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
                formFieldInput: 
                  "bg-gray-900/70 border border-gray-600 text-white placeholder-gray-400",
                formFieldLabel: "text-gray-200",
                headerTitle: "hidden",
                headerSubtitle: "hidden"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 