import { SignUp } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";
import Logo from "~/components/logo";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up | GigaForge" },
    { name: "description", content: "Create your GigaForge account" }
  ];
};

export default function SignUpPage() {
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
          
          <SignUp 
            routing="path" 
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/onboarding"
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