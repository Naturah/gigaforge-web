import { SignIn } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";
import Logo from "~/components/logo";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In | GigaForge" },
    { name: "description", content: "Sign in to your GigaForge account" }
  ];
};

export default function SignInPage() {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="w-full max-w-md text-center mb-6">
        <Logo />
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800 shadow-2xl">
          <div className="mb-6 pb-6 border-b border-gray-800">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to continue your 3D printing journey</p>
          </div>
          
          <SignIn 
            routing="path" 
            path="/sign-in" 
            appearance={{
              elements: {
                formButtonPrimary: 
                  "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: 
                  "border border-gray-700 bg-black/30 hover:bg-black/50",
                formFieldInput: 
                  "bg-black/30 border border-gray-700 text-white",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400",
                footer: "hidden"
              }
            }}
          />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account? <a href="/sign-up" className="text-blue-400 hover:text-blue-300">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
} 