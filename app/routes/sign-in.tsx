import { SignIn } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In | GigaForge" },
    { name: "description", content: "Sign in to your GigaForge account" }
  ];
};

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In to GigaForge</h1>
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800">
          <SignIn routing="path" path="/sign-in" />
        </div>
      </div>
    </div>
  );
} 