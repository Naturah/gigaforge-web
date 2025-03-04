import { SignUp } from "@clerk/remix";
import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

// Handle all subroutes of sign-up, including verify-email-address
export const loader: LoaderFunction = ({ params }) => {
  // Log the params to help with debugging
  console.log("Sign-up action params:", params);
  
  const { action } = params;
  
  // Validate the action parameter
  if (!action || !["verify-email-address", "continue"].includes(action)) {
    // Redirect invalid paths back to the main sign-up page
    return redirect("/sign-up");
  }
  
  // Continue with the request, letting Clerk handle it
  return null;
};

export default function SignUpAction() {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md">
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-2xl">
          <SignUp 
            routing="path" 
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/onboarding"
            appearance={{
              baseTheme: "dark",
              elements: {
                formButtonPrimary: 
                  "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "border border-gray-600 bg-gray-900/70 hover:bg-gray-800 text-white",
                socialButtonsProviderIcon__google: "text-white",
                formFieldInput: 
                  "bg-gray-900/70 border border-gray-600 text-white placeholder-gray-400",
                formFieldLabel: "text-gray-200",
                dividerLine: "bg-gray-600",
                dividerText: "text-gray-300",
                footer: "hidden",
                formFieldErrorText: "text-red-400",
                formFieldAction: "text-blue-400 hover:text-blue-300",
                otpCodeFieldInput: "bg-gray-900 border border-gray-600 text-white"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 