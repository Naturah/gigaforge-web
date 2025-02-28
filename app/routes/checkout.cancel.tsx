import { Link } from "@remix-run/react";
import Logo from "../components/logo";

export default function CheckoutCancel() {
  return (
    <div className="container mx-auto p-4">
      <Logo />
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10 text-center">
        <div className="mb-4 text-yellow-500">
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your checkout process was cancelled. No payment has been processed.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Return to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline"
          >
            Back to Previous Page
          </button>
        </div>
      </div>
    </div>
  );
} 