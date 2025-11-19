---
description: Health check for Strapi API and Stripe connectivity
argument-hint:
allowed-tools: [Bash, Read]
---

# Checking API Health

## Purpose

Verify external service connectivity for GigaForge: Strapi CMS, Stripe API, and webhook endpoint configuration.

**When to use**: Start of session, after deployment, troubleshooting integration issues.

## Usage

```bash
/gigaforge:checking-api-health
```

## Implementation Steps

### 1. Check Strapi API

```bash
echo "Checking Strapi API..."

curl -f "$STRAPI_API_URL/_health" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ Strapi API: Healthy"
else
  echo "❌ Strapi API: Unreachable"
fi

# Test products endpoint
curl -f "$STRAPI_API_URL/api/products" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ Products endpoint: Accessible"
else
  echo "❌ Products endpoint: Error"
fi
```

### 2. Check Stripe API

```bash
echo "Checking Stripe API..."

# Test Stripe API with list products
curl -f -u "$STRIPE_SECRET_KEY:" https://api.stripe.com/v1/products > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ Stripe API: Valid credentials"
else
  echo "❌ Stripe API: Invalid credentials"
fi
```

### 3. Check Webhook Configuration

```bash
echo "Checking webhook configuration..."

# Check if webhook endpoint exists
curl -f http://localhost:3000/api/stripe-webhook > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ Webhook endpoint: Exists"
else
  echo "⚠ Webhook endpoint: Not implemented or server not running"
fi
```

### 4. Display Service Dashboard

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SERVICE HEALTH DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Strapi CMS:
  ✓ API Health: OK
  ✓ Products Endpoint: Accessible
  URL: https://gigaforge-strapi.railway.app

Stripe:
  ✓ API Credentials: Valid (TEST mode)
  ✓ Connection: Healthy

Webhooks:
  ✓ Endpoint: /api/stripe-webhook exists
  ⚠ Listener: Not running (start with stripe listen)

All systems operational ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Script Integration

**Script**: `scripts/custom-scripts/check_api_health.py`

## Related Commands

- `/gigaforge:syncing-strapi-products` - Sync products after health check
- `/gigaforge:testing-stripe-checkout` - Test checkout after verification

---

**Version**: 1.0.0
**Category**: GigaForge E-Commerce
**Created**: 2025-11-18
