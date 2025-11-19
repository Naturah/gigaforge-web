import { ActionFunction, json } from '@remix-run/node';
import Stripe from 'stripe';

// Check for required environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set. Stripe functionality will be limited.');
}

// Initialize Stripe with your secret key
const stripe = STRIPE_SECRET_KEY 
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' })
  : null;

// Default base URL for success/cancel redirects
const BASE_URL = process.env.BASE_URL || 
                (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

export const loader = async () => {
  return json({ error: "This endpoint requires a POST request" }, { status: 405 });
};

export const action: ActionFunction = async ({ request }) => {
  // Check if Stripe is properly initialized
  if (!stripe) {
    console.error('Stripe is not initialized. Check STRIPE_SECRET_KEY environment variable.');
    return json(
      { error: 'Payment system is not configured properly. Please contact support.' }, 
      { status: 503 }
    );
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const productId = formData.get('productId')?.toString();
    const productName = formData.get('productName')?.toString();
    const productPrice = parseFloat(formData.get('productPrice')?.toString() || '0');
    const quantity = parseInt(formData.get('quantity')?.toString() || '1');

    if (!productId || !productName || !productPrice) {
      return json({ error: 'Missing required product information' }, { status: 400 });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: `Product ID: ${productId}`,
            },
            unit_amount: Math.round((productPrice / quantity) * 100), // Convert to cents and use per-unit price
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/checkout/cancel`,
      payment_intent_data: {
        metadata: {
          productId: productId,
          quantity: quantity.toString(),
        },
      },
    });

    return json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error.message || 'Failed to create checkout session';
    return json({ error: errorMessage }, { status: 500 });
  }
} 