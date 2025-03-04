import { LoaderFunction, redirect } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { UserProfile } from "@clerk/remix";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect("/sign-in");
  }
  return null;
};

export default function OnboardingPage() {
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