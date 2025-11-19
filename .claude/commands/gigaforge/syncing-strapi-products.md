---
description: Pull products from Strapi API and verify data integrity
argument-hint: --verify [--format json|table]
allowed-tools: [Bash, Read]
---

# Syncing Strapi Products

## Purpose

Fetch all products from Strapi CMS and validate data integrity. This command verifies connectivity to Strapi, checks product schema compliance, displays inventory totals, and optionally exports data for inspection.

**When to use**: After Strapi deployment (Phase 2+), when adding/updating products, before testing checkout flow.

## Usage

```bash
/gigaforge:syncing-strapi-products
/gigaforge:syncing-strapi-products --verify
/gigaforge:syncing-strapi-products --format json
/gigaforge:syncing-strapi-products --format table
```

## Arguments

- `--verify` (optional) - Run data validation checks (schema, required fields, inventory)
- `--format` (optional) - Output format: `table` (default) or `json`

## Implementation Steps

### 1. Check Strapi Configuration

```bash
# Verify environment variables
if [ -z "$STRAPI_API_URL" ]; then
  echo "❌ Error: STRAPI_API_URL not set"
  echo "   Add to .env.local: STRAPI_API_URL=https://your-strapi.railway.app"
  exit 1
fi

if [ -z "$STRAPI_API_TOKEN" ]; then
  echo "⚠ Warning: STRAPI_API_TOKEN not set"
  echo "   Public endpoints will work, but admin endpoints require token"
fi

echo "✓ Strapi URL: $STRAPI_API_URL"
```

### 2. Test Connectivity

```bash
# Ping Strapi API health endpoint
curl -f "$STRAPI_API_URL/_health" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✓ Strapi API accessible"
else
  echo "❌ Error: Cannot reach Strapi API at $STRAPI_API_URL"
  echo "   Check Railway deployment status"
  exit 1
fi
```

### 3. Fetch Products

Execute the sync script:

```bash
python scripts/custom-scripts/sync_strapi_products.py
```

The script performs:
1. Fetches products from `/api/products` endpoint
2. Parses JSON response
3. Validates product schema
4. Calculates inventory totals
5. Formats output (table or JSON)
6. Displays warnings for missing fields

### 4. Display Results

**Table Format** (default):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 STRAPI PRODUCTS SYNC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Strapi URL: https://gigaforge-strapi.railway.app
Endpoint: /api/products

┌────────────────────────────────────────────────────────┐
│ ID  │ Name                │ Price   │ Inventory │ Stripe │
├────────────────────────────────────────────────────────┤
│ 1   │ Articulated Dragon  │ $29.99  │ 15       │ ✓      │
│ 2   │ Hex Storage Box     │ $19.99  │ 8        │ ✓      │
│ 3   │ Phone Stand         │ $14.99  │ 12       │ ✓      │
│ 4   │ Flexi Rex           │ $24.99  │ 0        │ ⚠      │
└────────────────────────────────────────────────────────┘

Summary:
  Total Products: 4
  Total Inventory: 35 items
  Out of Stock: 1 product
  Missing Stripe ID: 1 product

Warnings:
  ⚠ Product #4 (Flexi Rex): No Stripe product ID configured

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**JSON Format**:
```json
{
  "status": "success",
  "products": [
    {
      "id": 1,
      "name": "Articulated Dragon",
      "slug": "articulated-dragon",
      "price": 29.99,
      "inventory": 15,
      "stripeProductId": "prod_ABC123",
      "stripePriceId": "price_XYZ789",
      "category": "Technology",
      "featured": true
    }
  ],
  "summary": {
    "total_products": 4,
    "total_inventory": 35,
    "out_of_stock": 1,
    "missing_stripe_id": 1
  },
  "warnings": [
    "Product #4 (Flexi Rex): No Stripe product ID configured"
  ]
}
```

## Examples

### Example 1: Basic sync
```bash
/gigaforge:syncing-strapi-products
```

**Output**:
- Fetches all products
- Displays in table format
- Shows summary stats

### Example 2: Sync with validation
```bash
/gigaforge:syncing-strapi-products --verify
```

**Output**:
- Runs schema validation
- Checks required fields
- Validates price/inventory formats
- Reports data quality issues

### Example 3: Export to JSON
```bash
/gigaforge:syncing-strapi-products --format json > products.json
```

**Output**:
- Exports product data to JSON file
- Useful for inspection or backup

## Script Integration

**Script**: `scripts/custom-scripts/sync_strapi_products.py`

**Dependencies**:
```python
import os
import requests
import json
from dotenv import load_dotenv
from tabulate import tabulate  # For table formatting
```

## Output

**Success Output**:
```
✅ Strapi products synced successfully

Products fetched: 4
Total inventory: 35 items
Data quality: Good (1 warning)

Next steps:
  → Review warnings (missing Stripe IDs)
  → Test checkout with synced products
  → Run /gigaforge:validating-inventory
```

**Failure Output**:
```
❌ Strapi sync failed

Issues:
  ❌ Cannot reach Strapi API
  ℹ️ Check Railway deployment: railway status

Fix and retry: /gigaforge:syncing-strapi-products
```

## Related Commands

- `/gigaforge:checking-api-health` - Verify Strapi + Stripe connectivity
- `/gigaforge:validating-inventory` - Compare Strapi vs Stripe inventory
- `/gigaforge:testing-stripe-checkout` - Test checkout with synced products

## Quality Checklist

After running this command, verify:
- [ ] All products have names and prices
- [ ] All products have Stripe IDs (for checkout)
- [ ] Inventory counts are accurate
- [ ] No duplicate slugs
- [ ] Category relationships exist
- [ ] Images are uploaded

## Troubleshooting

**Error: Cannot reach Strapi API**:
- Check Railway deployment status
- Verify STRAPI_API_URL is correct
- Test manually: `curl $STRAPI_API_URL/_health`

**Error: Empty response from /api/products**:
- Check products are published in Strapi admin
- Verify API permissions (Public read access)
- Check Strapi logs in Railway

**Warning: Missing Stripe IDs**:
- Create products in Stripe Dashboard
- Copy product/price IDs to Strapi
- Re-sync after updating

**Validation errors**:
- Fix data in Strapi admin panel
- Ensure required fields populated
- Re-run sync after fixes

## Notes

### Product Schema

Expected Strapi product structure:
```typescript
{
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;  // In USD (29.99, not 2999)
  inventory: number;
  stripeProductId: string;  // prod_...
  stripePriceId: string;    // price_...
  category: {
    id: number;
    name: string;
  };
  images: Array<{
    url: string;
    name: string;
  }>;
  featured: boolean;
}
```

### Stripe Integration

**Required for checkout**:
- `stripeProductId`: Created in Stripe Dashboard → Products
- `stripePriceId`: Created in Stripe Dashboard → Prices

**Creating Stripe products**:
1. Go to https://dashboard.stripe.com/products
2. Create product with same name as Strapi
3. Set price (one-time payment)
4. Copy product ID and price ID to Strapi

### Data Validation Rules

**--verify flag checks**:
- All required fields present
- Price > 0
- Inventory >= 0
- Valid Stripe ID format (prod_... / price_...)
- No duplicate slugs
- Category exists

### Performance

**Expected timing**:
- 10 products: <1 second
- 100 products: <2 seconds
- 1000 products: <5 seconds

**Optimization**: Uses pagination for large catalogs

---

**Version**: 1.0.0
**Category**: GigaForge E-Commerce
**Created**: 2025-11-18
**Part of**: GigaForge Dojo Commands
**Migration Phase**: Phase 2+ (after Strapi deployment)
