import { Link, useSearchParams } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import Stripe from "stripe";
import Logo from "../components/logo";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (sessionId) {
    try {
      // You can verify the session and get additional details if needed
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2024-04-10',
      });
      
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      // Here you could save order details to your database
      
      return json({ success: true, session });
    } catch (error) {
      console.error("Error retrieving checkout session:", error);
      return json({ success: false, error: "Failed to verify checkout session" });
    }
  }

  return json({ success: true });
};

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="container mx-auto p-4">
      <Logo />
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-10 text-center">
        <div className="mb-4 text-green-500">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been processed successfully.
          {sessionId && <span className="block mt-2 text-xs text-gray-500">Session ID: {sessionId}</span>}
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Return to Home
          </Link>
          <Link
            to="/orders"
            className="text-blue-600 hover:underline"
          >
            View Your Orders
          </Link>
        </div>
      </div>
    </div>
  );
} 