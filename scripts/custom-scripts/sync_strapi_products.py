#!/usr/bin/env python3
"""
Sync Strapi Products

Fetches products from Strapi CMS and validates data integrity.
"""

import os
import sys
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def sync_strapi_products(verify=False, format='table'):
    """Fetch and validate products from Strapi."""

    print("━" * 60)
    print("📦 STRAPI PRODUCTS SYNC")
    print("━" * 60)
    print()

    # Step 1: Verify configuration
    print("Step 1: Checking Strapi configuration...")

    strapi_url = os.getenv('STRAPI_API_URL')
    strapi_token = os.getenv('STRAPI_API_TOKEN')

    if not strapi_url:
        print("❌ Error: STRAPI_API_URL not set")
        print("   Add to .env.local: STRAPI_API_URL=https://your-strapi.railway.app")
        return False

    print(f"✓ Strapi URL: {strapi_url}")

    if not strapi_token:
        print("⚠️  Warning: STRAPI_API_TOKEN not set (public endpoints only)")
    else:
        print(f"✓ API Token: {strapi_token[:10]}...")

    print()

    # Step 2: Test connectivity
    print("Step 2: Testing Strapi connectivity...")

    try:
        health_response = requests.get(f"{strapi_url}/_health", timeout=5)
        if health_response.status_code == 200 or health_response.status_code == 204:
            print(f"✓ Strapi API accessible")
        else:
            print(f"⚠️  Health check returned status {health_response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: Cannot reach Strapi API")
        print(f"   URL: {strapi_url}")
        print(f"   Error: {e}")
        return False

    print()

    # Step 3: Fetch products
    print("Step 3: Fetching products...")

    try:
        headers = {}
        if strapi_token:
            headers['Authorization'] = f'Bearer {strapi_token}'

        response = requests.get(
            f"{strapi_url}/api/products",
            headers=headers,
            params={'populate': '*'},
            timeout=10
        )

        if response.status_code == 200:
            data = response.json()
            products = data.get('data', [])

            print(f"✓ Fetched {len(products)} products")
            print()

            # Step 4: Parse and validate
            print("Step 4: Parsing product data...")

            parsed_products = []
            warnings = []

            for product in products:
                attrs = product.get('attributes', {})

                parsed = {
                    'id': product.get('id'),
                    'name': attrs.get('name', 'Unknown'),
                    'slug': attrs.get('slug', ''),
                    'price': attrs.get('price', 0),
                    'inventory': attrs.get('inventory', 0),
                    'stripeProductId': attrs.get('stripeProductId', ''),
                    'stripePriceId': attrs.get('stripePriceId', ''),
                    'featured': attrs.get('featured', False)
                }

                # Validation checks
                if verify:
                    if not parsed['stripeProductId']:
                        warnings.append(f"Product #{parsed['id']} ({parsed['name']}): Missing Stripe product ID")

                    if parsed['price'] <= 0:
                        warnings.append(f"Product #{parsed['id']} ({parsed['name']}): Invalid price ${parsed['price']}")

                    if parsed['inventory'] < 0:
                        warnings.append(f"Product #{parsed['id']} ({parsed['name']}): Negative inventory")

                parsed_products.append(parsed)

            print(f"✓ Parsed {len(parsed_products)} products")
            print()

            # Step 5: Display results
            if format == 'json':
                output = {
                    'status': 'success',
                    'products': parsed_products,
                    'summary': {
                        'total_products': len(parsed_products),
                        'total_inventory': sum(p['inventory'] for p in parsed_products),
                        'out_of_stock': sum(1 for p in parsed_products if p['inventory'] == 0),
                        'missing_stripe_id': sum(1 for p in parsed_products if not p['stripeProductId'])
                    },
                    'warnings': warnings
                }
                print(json.dumps(output, indent=2))

            else:  # table format
                print("┌" + "─" * 70 + "┐")
                print("│ {:3} │ {:25} │ {:8} │ {:6} │ {:6} │".format(
                    "ID", "Name", "Price", "Stock", "Stripe"
                ))
                print("├" + "─" * 70 + "┤")

                for product in parsed_products:
                    stripe_status = "✓" if product['stripeProductId'] else "⚠"
                    print("│ {:3} │ {:25} │ ${:7.2f} │ {:6} │ {:6} │".format(
                        product['id'],
                        product['name'][:25],
                        product['price'],
                        product['inventory'],
                        stripe_status
                    ))

                print("└" + "─" * 70 + "┘")
                print()

                # Summary
                total_products = len(parsed_products)
                total_inventory = sum(p['inventory'] for p in parsed_products)
                out_of_stock = sum(1 for p in parsed_products if p['inventory'] == 0)
                missing_stripe = sum(1 for p in parsed_products if not p['stripeProductId'])

                print("Summary:")
                print(f"  Total Products: {total_products}")
                print(f"  Total Inventory: {total_inventory} items")
                if out_of_stock > 0:
                    print(f"  Out of Stock: {out_of_stock} product(s)")
                if missing_stripe > 0:
                    print(f"  Missing Stripe ID: {missing_stripe} product(s)")
                print()

                # Display warnings
                if warnings:
                    print("Warnings:")
                    for warning in warnings:
                        print(f"  ⚠️  {warning}")
                    print()

            print("━" * 60)
            print("✅ SYNC COMPLETE")
            print("━" * 60)

            return True

        else:
            print(f"❌ Error fetching products")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Error calling Strapi API")
        print(f"   Error: {e}")
        return False

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Sync Strapi products')
    parser.add_argument('--verify', action='store_true', help='Run validation checks')
    parser.add_argument('--format', choices=['table', 'json'], default='table', help='Output format')

    args = parser.parse_args()

    success = sync_strapi_products(verify=args.verify, format=args.format)

    sys.exit(0 if success else 1)
