import { Link, useSearchParams } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import Stripe from "stripe";
import Logo from "../components/logo";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (sessionId) {
    try {
      // Verify the session and get additional details
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
    <div className="container mx-auto p-4 max-w-6xl">
      <Logo />
      
      <div className="max-w-md mx-auto bg-black/40 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 rounded-xl p-8 mt-10 text-center backdrop-blur-sm">
        <div className="mb-6 text-green-400">
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
        
        <h2 className="text-2xl font-bold text-white mb-4">Payment Successful!</h2>
        
        <p className="text-gray-300 mb-8">
          Thank you for your purchase. Your order has been processed successfully.
          {sessionId && <span className="block mt-2 text-xs text-gray-500">Session ID: {sessionId}</span>}
        </p>
        
        <div className="flex flex-col space-y-3">
          <Link
            to="/"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-colors shadow-lg shadow-cyan-500/20"
          >
            Return to Home
          </Link>
          
          <Link
            to="/products"
            className="border border-cyan-500 text-cyan-400 px-6 py-3 rounded-lg font-medium hover:bg-cyan-500/10 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 