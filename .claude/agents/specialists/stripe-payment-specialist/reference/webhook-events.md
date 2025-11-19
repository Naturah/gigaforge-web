# Stripe Webhook Events

Complete guide to Stripe webhook events for GigaForge inventory synchronization.

## Primary Event: checkout.session.completed

**Triggers when**: Customer completes payment on Stripe Checkout page

**Payload Structure**:
```json
{
  "id": "evt_1ABC2D3EFG4H5I6J",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_a1b2c3d4e5f6",
      "amount_total": 4998,
      "currency": "usd",
      "customer_email": "customer@example.com",
      "payment_status": "paid",
      "line_items": {
        "data": [
          {
            "price": {
              "id": "price_ABC123",
              "product": "prod_XYZ789"
            },
            "quantity": 2
          }
        ]
      },
      "metadata": {
        "product_ids": "1,3,5",
        "strapi_ids": "1:2,3:1,5:1"
      }
    }
  }
}
```

## Webhook Handler Implementation

**File**: `app/routes/api.stripe-webhook.ts`

### Step 1: Verify Signature

```typescript
import { Webhook } from "@stripe/stripe-js";

export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      webhookSecret
    );

    // Event verified ✓
  } catch (err) {
    return json({ error: "Invalid signature" }, { status: 400 });
  }
}
```

### Step 2: Handle Event Type

```typescript
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;

  // Extract purchased items
  const lineItems = await stripe.checkout.sessions.listLineItems(
    session.id,
    { limit: 100 }
  );

  // Update inventory
  await updateInventory(lineItems.data);
}

return json({ received: true });
```

### Step 3: Update Strapi Inventory

```typescript
async function updateInventory(lineItems) {
  for (const item of lineItems) {
    const productId = item.price.product;
    const quantity = item.quantity;

    // Find product in Strapi by stripeProductId
    const strapiProduct = await fetch(
      `${STRAPI_API_URL}/api/products?filters[stripeProductId][$eq]=${productId}`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    ).then(r => r.json());

    if (strapiProduct.data.length > 0) {
      const product = strapiProduct.data[0];
      const currentInventory = product.attributes.inventory;
      const newInventory = Math.max(0, currentInventory - quantity);

      // Update inventory
      await fetch(
        `${STRAPI_API_URL}/api/products/${product.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_API_TOKEN}`
          },
          body: JSON.stringify({
            data: {
              inventory: newInventory
            }
          })
        }
      );

      console.log(`Updated product ${product.id}: ${currentInventory} → ${newInventory}`);
    }
  }
}
```

## Testing Webhooks Locally

### 1. Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe

# Linux
# Download from https://stripe.com/docs/stripe-cli
```

### 2. Authenticate

```bash
stripe login
```

### 3. Forward Webhooks

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

**Output**:
```
> Ready! Your webhook signing secret is whsec_ABC123XYZ789
> Forwarding to localhost:3000/api/stripe-webhook
```

### 4. Copy Webhook Secret

Add to `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_ABC123XYZ789
```

### 5. Trigger Test Event

```bash
stripe trigger checkout.session.completed
```

**Expected Response**:
```
✓ Webhook received
✓ Signature verified
✓ Inventory updated: Product #1 (15 → 13)
```

## Production Webhook Configuration

### 1. Create Endpoint in Stripe Dashboard

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://gigaforge.xyz/api/stripe-webhook`
4. Events to send: `checkout.session.completed`
5. Copy webhook signing secret

### 2. Add Secret to Vercel

1. Go to Vercel project settings
2. Environment Variables
3. Add: `STRIPE_WEBHOOK_SECRET=whsec_...`
4. Deploy to apply

### 3. Test Production Webhook

1. Complete a real purchase (or use test mode)
2. Check webhook logs in Stripe Dashboard
3. Verify inventory updated in Strapi

## Error Handling

### Invalid Signature

**Error**: `Webhook signature verification failed`

**Causes**:
- Wrong STRIPE_WEBHOOK_SECRET
- Body parsing modified payload
- Clock skew

**Solution**:
```typescript
// Use raw body, not parsed JSON
const payload = await request.text();  // ✓ Correct
// NOT: const payload = await request.json();  // ❌ Wrong
```

### Inventory Update Fails

**Error**: Strapi API returns 401/403

**Causes**:
- STRAPI_API_TOKEN invalid
- Token lacks permissions

**Solution**:
- Generate new token in Strapi admin
- Ensure token has "update" permission for products

### Product Not Found

**Error**: No Strapi product matches Stripe product ID

**Causes**:
- stripeProductId not set in Strapi
- Product ID mismatch

**Solution**:
- Verify stripeProductId field populated
- Check Stripe Dashboard for correct product ID

## Best Practices

1. **Always verify signature** - Prevents malicious webhook calls
2. **Use raw body** - Signature verification requires exact payload
3. **Handle idempotency** - Stripe may send duplicate events
4. **Return 200 quickly** - Strapi update can be async
5. **Log everything** - Debug production issues easily

## Testing Checklist

- [ ] Webhook endpoint returns 200
- [ ] Signature verification works
- [ ] Inventory decrements correctly
- [ ] Multiple items handled
- [ ] Out-of-stock handled (inventory >= 0)
- [ ] Logs show successful updates
- [ ] Stripe Dashboard shows successful delivery

## Common Test Scenarios

**Scenario 1: Single item purchase**
- Cart: 1x Articulated Dragon ($29.99)
- Expected: Inventory 15 → 14

**Scenario 2: Multiple items**
- Cart: 2x Dragon, 1x Box
- Expected: Dragon 15 → 13, Box 8 → 7

**Scenario 3: Last item**
- Cart: 1x Product (inventory: 1)
- Expected: Inventory 1 → 0 (out of stock)

**Scenario 4: Out of stock purchase attempt**
- Cart: 1x Product (inventory: 0)
- Expected: Checkout prevented (frontend validation)
