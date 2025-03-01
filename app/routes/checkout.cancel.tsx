import { Link } from "@remix-run/react";
import Logo from "../components/logo";

export default function CheckoutCancel() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Logo />
      
      <div className="max-w-md mx-auto bg-black/40 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 rounded-xl p-8 mt-10 text-center backdrop-blur-sm">
        <div className="mb-6 text-yellow-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Payment Cancelled</h2>
        
        <p className="text-gray-300 mb-8">
          Your checkout process was cancelled. No payment has been processed.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors shadow-lg shadow-cyan-500/20"
          >
            Return to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="border border-cyan-500 text-cyan-400 px-6 py-3 rounded-lg font-medium hover:bg-cyan-500/10 transition-colors"
          >
            Back to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
} 