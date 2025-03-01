import { ActionFunction, json } from '@remix-run/node';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10', // Use the latest API version
});

export const action: ActionFunction = async ({ request }) => {
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
      success_url: `${process.env.BASE_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:3000'}/checkout/cancel`,
      payment_intent_data: {
        metadata: {
          productId: productId,
          quantity: quantity.toString(),
        },
      },
    });

    return json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
} 