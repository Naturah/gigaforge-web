---
description: Start complete development stack (Remix + Stripe webhooks)
argument-hint: [--stripe-listen]
allowed-tools: [Bash, Read]
---

# Running Dev Stack

## Purpose

Start all development services required for local GigaForge development: Remix dev server and optionally Stripe webhook listener.

**When to use**: Start of every development session.

## Usage

```bash
/gigaforge:running-dev-stack
/gigaforge:running-dev-stack --stripe-listen
```

## Arguments

- `--stripe-listen` (optional) - Also start Stripe webhook listener (required for Phase 4+)

## Implementation Steps

### 1. Check Environment Variables

```bash
# Required variables
required_vars=(
  "STRAPI_API_URL"
  "STRIPE_PUBLISHABLE_KEY"
  "STRIPE_SECRET_KEY"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Error: $var not set"
    missing=true
  fi
done

if [ "$missing" = true ]; then
  echo "Fix .env.local and retry"
  exit 1
fi
```

### 2. Start Remix Dev Server

```bash
echo "Starting Remix dev server..."
npm run dev &
REMIX_PID=$!

# Wait for server to be ready
sleep 3
curl -f http://localhost:3000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ Remix dev server running on http://localhost:3000"
else
  echo "❌ Remix server failed to start"
  kill $REMIX_PID
  exit 1
fi
```

### 3. Start Stripe Webhook Listener (Optional)

```bash
if [ "$STRIPE_LISTEN" = true ]; then
  echo "Starting Stripe webhook listener..."

  stripe listen --forward-to localhost:3000/api/stripe-webhook &
  STRIPE_PID=$!

  sleep 2
  echo "✓ Stripe webhooks forwarding to http://localhost:3000/api/stripe-webhook"
fi
```

### 4. Display Running Services

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 DEV STACK RUNNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Services:
  ✓ Remix Dev Server: http://localhost:3000
  ✓ Stripe Webhooks: Forwarding to /api/stripe-webhook

Environment:
  ✓ STRAPI_API_URL: https://gigaforge-strapi.railway.app
  ✓ STRIPE_SECRET_KEY: sk_test_***

Ports:
  3000: Remix (HTTP)

Stop all services: Ctrl+C
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Script Integration

**Script**: `scripts/custom-scripts/run_dev_stack.sh`

## Related Commands

- `/gigaforge:checking-api-health` - Verify services after startup
- `/gigaforge:testing-stripe-checkout` - Test checkout with running stack

---

**Version**: 1.0.0
**Category**: GigaForge E-Commerce
**Created**: 2025-11-18
