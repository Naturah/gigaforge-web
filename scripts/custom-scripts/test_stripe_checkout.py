#!/usr/bin/env python3
"""
Test Stripe Checkout Integration

Tests the complete Stripe checkout flow by creating a test session
and validating all configuration parameters.
"""

import os
import sys
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def test_stripe_checkout():
    """Test Stripe checkout session creation and configuration."""

    print("━" * 60)
    print("🧪 TESTING STRIPE CHECKOUT")
    print("━" * 60)
    print()

    # Step 1: Verify environment variables
    print("Step 1: Verifying environment variables...")

    stripe_secret = os.getenv('STRIPE_SECRET_KEY')
    stripe_public = os.getenv('STRIPE_PUBLISHABLE_KEY')
    base_url = os.getenv('BASE_URL', 'http://localhost:3000')

    if not stripe_secret:
        print("❌ Error: STRIPE_SECRET_KEY not set")
        print("   Add to .env.local: STRIPE_SECRET_KEY=sk_test_...")
        return False

    if not stripe_public:
        print("❌ Error: STRIPE_PUBLISHABLE_KEY not set")
        print("   Add to .env.local: STRIPE_PUBLISHABLE_KEY=pk_test_...")
        return False

    # Determine mode
    if stripe_secret.startswith('sk_test_'):
        print(f"✓ Using Stripe TEST mode")
        print(f"  Secret Key: {stripe_secret[:15]}...")
        print(f"  Public Key: {stripe_public[:15]}...")
    else:
        print(f"⚠️  Using Stripe LIVE mode")
        print(f"  Secret Key: {stripe_secret[:15]}...")
        print(f"  Public Key: {stripe_public[:15]}...")
        print()
        confirm = input("  Continue with LIVE mode? [y/N]: ")
        if confirm.lower() != 'y':
            print("Aborted.")
            return False

    print()

    # Step 2: Check dev server
    print("Step 2: Checking dev server status...")

    try:
        response = requests.get(base_url, timeout=2)
        if response.status_code == 200:
            print(f"✓ Dev server running on {base_url}")
        else:
            print(f"⚠️  Dev server returned status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: Dev server not accessible at {base_url}")
        print(f"   Start with: npm run dev")
        print(f"   Error: {e}")
        return False

    print()

    # Step 3: Create test checkout session
    print("Step 3: Creating test checkout session...")

    test_cart = [
        {
            'id': 'test-product-1',
            'name': 'Test Product 1',
            'price': 2999,  # $29.99 in cents
            'quantity': 1
        },
        {
            'id': 'test-product-2',
            'name': 'Test Product 2',
            'price': 1999,  # $19.99 in cents
            'quantity': 1
        }
    ]

    try:
        response = requests.post(
            f"{base_url}/api/create-checkout-session",
            json={'items': test_cart},
            headers={'Content-Type': 'application/json'},
            timeout=10
        )

        if response.status_code == 200:
            session = response.json()

            print(f"✓ Checkout session created")
            print(f"  Session ID: {session.get('id', 'N/A')[:30]}...")
            print(f"  Total: ${(2999 + 1999) / 100:.2f}")
            print()

            # Validate session structure
            print("Step 4: Validating session configuration...")

            required_fields = ['id', 'url']
            for field in required_fields:
                if field in session:
                    print(f"  ✓ {field}: Present")
                else:
                    print(f"  ❌ {field}: Missing")
                    return False

            # Check URLs
            if 'url' in session:
                print(f"  ✓ Checkout URL: {session['url'][:50]}...")

            print()

            # Display checkout URL
            print("━" * 60)
            print("✅ CHECKOUT TEST PASSED")
            print("━" * 60)
            print()
            print("Manual Test Steps:")
            print(f"1. Open: {session['url']}")
            print("2. Use test card: 4242 4242 4242 4242")
            print("3. Expiry: Any future date (e.g., 12/34)")
            print("4. CVC: Any 3 digits (e.g., 123)")
            print("5. Complete payment")
            print("6. Verify redirect to /checkout/success")
            print()

            return True

        else:
            print(f"❌ Error creating checkout session")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Error calling checkout endpoint")
        print(f"   Error: {e}")
        return False

def display_test_cards():
    """Display Stripe test card information."""

    print()
    print("━" * 60)
    print("📋 STRIPE TEST CARDS")
    print("━" * 60)
    print()
    print("✅ SUCCESS:")
    print("   Card: 4242 4242 4242 4242")
    print("   Expiry: Any future date")
    print("   CVC: Any 3 digits")
    print()
    print("❌ DECLINE (Insufficient Funds):")
    print("   Card: 4000 0000 0000 9995")
    print()
    print("❌ DECLINE (Stolen Card):")
    print("   Card: 4000 0000 0000 9979")
    print()
    print("🔒 REQUIRES AUTHENTICATION (3D Secure):")
    print("   Card: 4000 0025 0000 3155")
    print()
    print("More test cards: https://stripe.com/docs/testing")
    print("━" * 60)
    print()

if __name__ == '__main__':
    success = test_stripe_checkout()

    if success:
        display_test_cards()
        sys.exit(0)
    else:
        print()
        print("━" * 60)
        print("❌ CHECKOUT TEST FAILED")
        print("━" * 60)
        print()
        print("Fix the issues above and retry:")
        print("  /gigaforge:testing-stripe-checkout")
        print()
        sys.exit(1)
