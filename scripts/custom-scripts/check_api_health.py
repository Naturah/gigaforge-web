#!/usr/bin/env python3
"""
API Health Check

Verifies connectivity to Strapi CMS and Stripe API.
"""

import os
import sys
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def check_api_health():
    """Check health of all external services."""

    print("━" * 60)
    print("📊 SERVICE HEALTH DASHBOARD")
    print("━" * 60)
    print()

    all_healthy = True

    # Check Strapi
    print("Strapi CMS:")

    strapi_url = os.getenv('STRAPI_API_URL')

    if not strapi_url:
        print("  ❌ STRAPI_API_URL not configured")
        all_healthy = False
    else:
        print(f"  URL: {strapi_url}")

        try:
            # Health check
            health = requests.get(f"{strapi_url}/_health", timeout=5)
            if health.status_code in [200, 204]:
                print("  ✓ Health: OK")
            else:
                print(f"  ⚠️  Health: Status {health.status_code}")

            # Products endpoint
            products = requests.get(f"{strapi_url}/api/products", timeout=5)
            if products.status_code == 200:
                product_count = len(products.json().get('data', []))
                print(f"  ✓ Products: {product_count} available")
            else:
                print(f"  ❌ Products: Status {products.status_code}")
                all_healthy = False

        except requests.exceptions.RequestException as e:
            print(f"  ❌ Connection: Failed ({e})")
            all_healthy = False

    print()

    # Check Stripe
    print("Stripe:")

    stripe_secret = os.getenv('STRIPE_SECRET_KEY')

    if not stripe_secret:
        print("  ❌ STRIPE_SECRET_KEY not configured")
        all_healthy = False
    else:
        mode = "TEST" if stripe_secret.startswith('sk_test_') else "LIVE"
        print(f"  Mode: {mode}")
        print(f"  Key: {stripe_secret[:15]}...")

        try:
            # Test API with simple request
            response = requests.get(
                'https://api.stripe.com/v1/products',
                auth=(stripe_secret, ''),
                params={'limit': 1},
                timeout=5
            )

            if response.status_code == 200:
                print("  ✓ API: Credentials valid")
            else:
                print(f"  ❌ API: Status {response.status_code}")
                all_healthy = False

        except requests.exceptions.RequestException as e:
            print(f"  ❌ Connection: Failed ({e})")
            all_healthy = False

    print()

    # Check local dev server (if running)
    print("Local Development:")

    base_url = os.getenv('BASE_URL', 'http://localhost:3000')

    try:
        response = requests.get(base_url, timeout=2)
        if response.status_code == 200:
            print(f"  ✓ Dev server: Running on {base_url}")

            # Check webhook endpoint
            webhook_response = requests.post(
                f"{base_url}/api/stripe-webhook",
                json={},
                timeout=2
            )
            # Expect 400 or 405 (endpoint exists but needs valid webhook data)
            if webhook_response.status_code in [200, 400, 405]:
                print("  ✓ Webhook endpoint: Exists")
            else:
                print(f"  ⚠️  Webhook endpoint: Status {webhook_response.status_code}")

        else:
            print(f"  ⚠️  Dev server: Status {response.status_code}")

    except requests.exceptions.RequestException:
        print(f"  ℹ️  Dev server: Not running")
        print("     Start with: npm run dev")

    print()
    print("━" * 60)

    if all_healthy:
        print("✅ All systems operational")
    else:
        print("⚠️  Some services need attention")

    print("━" * 60)
    print()

    return all_healthy

if __name__ == '__main__':
    success = check_api_health()
    sys.exit(0 if success else 1)
