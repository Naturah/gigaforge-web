---
description: Test Stripe checkout integration with test cards
argument-hint: [--mode test|live]
allowed-tools: [Bash, Read]
---

# Testing Stripe Checkout

## Purpose

Test the complete Stripe checkout flow locally to verify integration is working correctly. This command runs through a full checkout simulation using Stripe test cards and verifies all components (session creation, redirect handling, webhook delivery).

**When to use**: After implementing/modifying Stripe checkout, before deployment, during Phase 4+ migration.

## Usage

```bash
/gigaforge:testing-stripe-checkout
/gigaforge:testing-stripe-checkout --mode live
```

## Arguments

- `--mode` (optional) - Test mode: `test` (default) or `live` (production keys)

## Implementation Steps

### 1. Verify Environment Variables

```bash
# Check for required Stripe keys
if [ -z "$STRIPE_PUBLISHABLE_KEY" ]; then
  echo "❌ Error: STRIPE_PUBLISHABLE_KEY not set"
  exit 1
fi

if [ -z "$STRIPE_SECRET_KEY" ]; then
  echo "❌ Error: STRIPE_SECRET_KEY not set"
  exit 1
fi

# Verify keys match mode
if [[ "$STRIPE_SECRET_KEY" == sk_test_* ]]; then
  echo "✓ Using Stripe TEST mode"
else
  echo "✓ Using Stripe LIVE mode"
fi
```

### 2. Check Dev Server Status

```bash
# Check if dev server is running
if curl -s http://localhost:3000 > /dev/null; then
  echo "✓ Dev server running on http://localhost:3000"
else
  echo "⚠ Dev server not running"
  echo "Start with: npm run dev"
  exit 1
fi
```

### 3. Run Checkout Test Script

Execute the automated test script that simulates the checkout flow:

```bash
python scripts/custom-scripts/test_stripe_checkout.py
```

The script performs:
1. Creates test cart data (sample products)
2. Calls `/api/create-checkout-session` endpoint
3. Verifies session ID returned
4. Checks redirect URL format
5. Validates session metadata
6. Tests success/cancel URL configuration

### 4. Display Test Card Information

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 STRIPE TEST CARDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ SUCCESS:
   Card Number: 4242 4242 4242 4242
   Expiry: Any future date
   CVC: Any 3 digits

❌ DECLINE (Insufficient Funds):
   Card Number: 4000 0000 0000 9995

❌ DECLINE (Stolen Card):
   Card Number: 4000 0000 0000 9979

🔒 REQUIRES AUTHENTICATION (3D Secure):
   Card Number: 4000 0025 0000 3155

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Webhook Status Check

```bash
# Check if Stripe CLI webhook forwarding is active
if pgrep -f "stripe listen" > /dev/null; then
  echo "✓ Stripe webhook listener active"
  echo "  Webhooks will be forwarded to http://localhost:3000/api/stripe-webhook"
else
  echo "⚠ Stripe webhook listener not running"
  echo "  Start with: stripe listen --forward-to localhost:3000/api/stripe-webhook"
  echo "  Note: Webhooks required for Phase 4+ (inventory updates)"
fi
```

### 6. Display Test Results

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ CHECKOUT TEST RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Environment:
  ✓ STRIPE_PUBLISHABLE_KEY: pk_test_***
  ✓ STRIPE_SECRET_KEY: sk_test_***
  ✓ Dev server: http://localhost:3000

Checkout Session:
  ✓ Session created: cs_test_a1b2c3d4e5f6...
  ✓ Client secret: Valid
  ✓ Success URL: http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}
  ✓ Cancel URL: http://localhost:3000/checkout/cancel

Metadata:
  ✓ Cart items: 2 products
  ✓ Total amount: $49.98

Webhooks:
  ⚠ Listener not active (start with stripe listen)
  ℹ️ Required for Phase 4+ inventory updates

Next Steps:
  1. Open checkout session URL in browser
  2. Use test card: 4242 4242 4242 4242
  3. Complete payment
  4. Verify redirect to /checkout/success
  5. Check webhook delivery (if listener active)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Examples

### Example 1: Basic test mode
```bash
/gigaforge:testing-stripe-checkout
```

**Output**:
- Verifies TEST mode keys
- Creates checkout session
- Displays test card numbers
- Shows webhook status

### Example 2: Live mode validation (production)
```bash
/gigaforge:testing-stripe-checkout --mode live
```

**Output**:
- Verifies LIVE mode keys
- Creates real checkout session
- ⚠️ Warning: Uses production Stripe account
- Recommended only for final pre-launch testing

## Script Integration

**Script**: `scripts/custom-scripts/test_stripe_checkout.py`

**What it does**:
1. Loads environment variables
2. Creates Stripe checkout session via API
3. Parses and validates response
4. Checks session configuration
5. Returns detailed status

**Dependencies**:
```python
import os
import requests
import json
from dotenv import load_dotenv
```

**Example implementation**:
```python
#!/usr/bin/env python3
import os
import requests
import json

# Load environment
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
BASE_URL = os.getenv('BASE_URL', 'http://localhost:3000')

# Test cart data
test_cart = [
    {
        'id': '1',
        'name': 'Test Product 1',
        'price': 2999,  # $29.99
        'quantity': 1
    },
    {
        'id': '2',
        'name': 'Test Product 2',
        'price': 1999,  # $19.99
        'quantity': 1
    }
]

# Call checkout session endpoint
response = requests.post(
    f"{BASE_URL}/api/create-checkout-session",
    json={'items': test_cart},
    headers={'Content-Type': 'application/json'}
)

# Validate response
if response.status_code == 200:
    session = response.json()
    print(f"✓ Session created: {session['id']}")
    print(f"✓ Checkout URL: {session['url']}")
else:
    print(f"❌ Error: {response.status_code}")
    print(response.text)
```

## Output

**Success Output**:
```
✅ Stripe checkout test PASSED

All checks completed:
  ✓ Environment variables configured
  ✓ Dev server running
  ✓ Checkout session created
  ✓ Success/cancel URLs valid
  ✓ Metadata populated

Manual test required:
  → Open checkout URL in browser
  → Complete payment with test card
  → Verify success page redirect
```

**Failure Output**:
```
❌ Stripe checkout test FAILED

Issues found:
  ❌ STRIPE_SECRET_KEY not set (check .env.local)
  ⚠ Dev server not running (npm run dev)

Fix issues and retry: /gigaforge:testing-stripe-checkout
```

## Related Commands

- `/gigaforge:checking-api-health` - Verify Stripe API connectivity
- `/gigaforge:validating-inventory` - Check inventory sync (Phase 4+)
- `/saving-session` - Save after successful test

## Quality Checklist

After running this test, verify:
- [ ] Checkout session creates successfully
- [ ] Test card completes payment
- [ ] Success page displays order confirmation
- [ ] Cancel page handles abandonment
- [ ] Webhook delivers (if Phase 4+)
- [ ] Inventory updates (if Phase 4+)

## Troubleshooting

**Error: STRIPE_SECRET_KEY not set**:
- Solution: Add to `.env.local`
- Format: `STRIPE_SECRET_KEY=sk_test_...`

**Error: Dev server not running**:
- Solution: `npm run dev`
- Verify: `curl http://localhost:3000`

**Error: Checkout session creation fails**:
- Check Stripe API logs: https://dashboard.stripe.com/test/logs
- Verify API key is valid
- Check product data format

**Webhook not firing**:
- Start listener: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
- Copy webhook secret to `.env.local`
- Verify endpoint returns 200

## Notes

### Test vs Live Mode

**Test Mode** (default):
- Uses `pk_test_` and `sk_test_` keys
- Test card numbers work
- No real charges
- Webhook events simulated

**Live Mode**:
- Uses `pk_live_` and `sk_live_` keys
- Real card numbers required
- Real charges occur
- Production webhook events

**Recommendation**: Always use test mode except final pre-launch validation.

### Webhook Requirement

**Phase 1-3**: Webhooks optional (checkout works without)
**Phase 4+**: Webhooks required (inventory sync depends on `checkout.session.completed` event)

### Stripe CLI Setup

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# Windows: scoop install stripe
# Linux: Download from https://stripe.com/docs/stripe-cli

# Authenticate
stripe login

# Forward webhooks to local dev
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Copy webhook secret to .env.local
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Test Card Reference

**All test cards**: https://stripe.com/docs/testing

**Common scenarios**:
- Payment succeeds: `4242 4242 4242 4242`
- Payment declined: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`
- Insufficient funds: `4000 0000 0000 9995`

Use any future expiry date and any 3-digit CVC.

---

**Version**: 1.0.0
**Category**: GigaForge E-Commerce
**Created**: 2025-11-18
**Part of**: GigaForge Dojo Commands
**Migration Phase**: All phases (especially Phase 4+)
