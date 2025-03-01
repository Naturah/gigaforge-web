import { SignUp } from "@clerk/remix";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up | GigaForge" },
    { name: "description", content: "Create your GigaForge account" }
  ];
};

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Create a GigaForge Account</h1>
        <div className="bg-black/30 backdrop-blur-md p-8 rounded-xl border border-gray-800">
          <SignUp routing="path" path="/sign-up" />
        </div>
      </div>
    </div>
  );
} 