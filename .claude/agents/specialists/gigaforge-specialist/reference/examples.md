# GigaForge Workflow Examples

Real-world usage scenarios for gigaforge-specialist execution.

---

## Example 1: Phase 1 - Remove Clerk Authentication (Happy Path)

**Scenario**: Execute complete Clerk removal (Phase 1 of 6)

### Input
```json
{
  "task": "Remove all Clerk authentication from gigaforge-web",
  "phase": 1,
  "verify_guest_checkout": true
}
```

### Execution Flow

**Step 1: Validation**
- Working directory: `C:\Users\andyl\Code\gigaforge-web` ✓
- Branch: `v2-pivot` ✓
- Clerk present in package.json: ✓ (ready to remove)

**Step 2: File Deletions**
```bash
# Delete 7 auth route files
rm app/routes/sign-in.tsx
rm app/routes/sign-up.tsx
rm app/routes/profile.tsx
rm app/routes/onboarding.tsx
rm app/routes/sign-up.$action.tsx
rm app/routes/sign-up.sso-callback.tsx
rm app/routes/sso-callback.tsx
```

**Step 3: Code Modifications**
```bash
# Clean root.tsx (remove ClerkApp wrapper)
Edit: app/root.tsx
  Remove: import { ClerkApp, rootAuthLoader }
  Remove: export loader = rootAuthLoader
  Remove: ClerkApp wrapper

# Clean nav.tsx (remove auth components)
Edit: app/components/nav.tsx
  Remove: import { UserButton, SignedIn, SignedOut }
  Remove: All auth conditionals
  Remove: Sign In/Up links
```

**Step 4: Dependency Cleanup**
```bash
# Remove from package.json
Edit: package.json
  Remove: "@clerk/remix": "^4.5.2"

# Reinstall dependencies
npm install

# Verify typecheck
npm run typecheck
```

**Step 5: Verification**
```bash
# Check Clerk removed
grep -c "@clerk/remix" package.json
# Returns: 0 (success)

# Test guest checkout (use Stripe command)
/gigaforge:testing-stripe-checkout
# Returns: checkout session created successfully
```

### Output
```json
{
  "specialist": "gigaforge-specialist",
  "status": "success",
  "task": "Phase 1: Remove Clerk Authentication",
  "data": {
    "phase": "Phase 1 of 6",
    "files_deleted": [
      "app/routes/sign-in.tsx",
      "app/routes/sign-up.tsx",
      "app/routes/profile.tsx",
      "app/routes/onboarding.tsx",
      "app/routes/sign-up.$action.tsx",
      "app/routes/sign-up.sso-callback.tsx",
      "app/routes/sso-callback.tsx"
    ],
    "files_modified": [
      "app/root.tsx",
      "app/components/nav.tsx",
      "package.json"
    ],
    "commands_executed": [
      "npm install",
      "npm run typecheck",
      "/gigaforge:testing-stripe-checkout"
    ],
    "tests_passed": true,
    "clerk_removed": true,
    "guest_checkout_verified": true
  },
  "metadata": {
    "execution_time": 245,
    "migration_progress": "Phase 1 of 6 (17% complete)",
    "next_recommended_task": "Phase 2: Deploy Strapi CMS on Railway",
    "blockers": []
  },
  "errors": []
}
```

### Performance
- **Execution time**: 245 seconds (~4 minutes)
- **Files modified**: 10 files
- **Status**: Success ✓
- **Ready for**: Phase 2

**Lesson**: Systematic file deletion + dependency cleanup + verification = clean migration

---

## Example 2: Phase 3 - Integrate Strapi API (Multi-Step Workflow)

**Scenario**: Create Strapi service layer and update product routes

### Input
```json
{
  "task": "Integrate Strapi API for products",
  "phase": 3,
  "routes_to_update": ["products", "categories", "homepage"]
}
```

### Execution Flow

**Step 1: Prerequisites Check**
```bash
# Verify Strapi deployed
/gigaforge:checking-api-health
# Returns: strapi.status = "healthy", products_available = 10
```

**Step 2: Create Service Layer**
```typescript
// Create app/services/strapi.server.ts
Write: app/services/strapi.server.ts

import { json } from "@remix-run/node";

const STRAPI_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export async function getProducts() {
  const response = await fetch(`${STRAPI_URL}/api/products?populate=*`, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`
    }
  });

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
}

export async function getProductBySlug(slug: string) {
  const response = await fetch(
    `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` }
    }
  );

  if (!response.ok) throw new Error("Product not found");
  const data = await response.json();
  return data.data[0];
}
// ... more methods
```

**Step 3: Update Product Route**
```typescript
// Update app/routes/products.$productId.tsx
Edit: app/routes/products.$productId.tsx

// OLD (hardcoded):
const products = [
  { id: 1, name: "Product A", price: 29.99 }
];

// NEW (Strapi):
import { getProductBySlug } from "~/services/strapi.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const product = await getProductBySlug(params.productId!);
  return json({ product });
}
```

**Step 4: Test Integration**
```bash
# Start dev server
npm run dev

# Sync products to verify
/gigaforge:syncing-strapi-products --verify
# Returns: 10 products, schema_valid = true

# Manual test: Browse to http://localhost:3000/products/product-slug
# Verify: Product displays with Strapi data
```

### Output
```json
{
  "specialist": "gigaforge-specialist",
  "status": "success",
  "task": "Phase 3: Integrate Strapi API",
  "data": {
    "phase": "Phase 3 of 6",
    "files_created": [
      "app/services/strapi.server.ts"
    ],
    "files_modified": [
      "app/routes/products.$productId.tsx",
      "app/routes/categories.$categoryId.tsx",
      "app/routes/_index.tsx"
    ],
    "commands_executed": [
      "/gigaforge:checking-api-health",
      "/gigaforge:syncing-strapi-products --verify",
      "npm run dev"
    ],
    "tests_passed": true,
    "strapi_products_available": 10,
    "hardcoded_data_removed": true
  },
  "metadata": {
    "execution_time": 425,
    "migration_progress": "Phase 3 of 6 (50% complete)",
    "next_recommended_task": "Phase 4: Implement Stripe Webhook",
    "blockers": []
  },
  "errors": []
}
```

### Performance
- **Execution time**: 425 seconds (~7 minutes)
- **Routes updated**: 3 routes
- **Products synced**: 10 products
- **Status**: Success ✓
- **Ready for**: Phase 4

**Lesson**: Service layer abstraction + route updates + command verification = reliable integration

---

## Example 3: Testing Stripe Checkout (Command Integration)

**Scenario**: Verify Stripe checkout configuration

### Input
```json
{
  "task": "Test Stripe checkout flow",
  "verify_webhook": true
}
```

### Execution Flow

**Step 1: Environment Check**
```bash
# Check API health
/gigaforge:checking-api-health
# Returns:
{
  "stripe": {
    "status": "healthy",
    "api_key_valid": true,
    "mode": "test"
  }
}
```

**Step 2: Test Checkout**
```bash
# Run Stripe checkout test
/gigaforge:testing-stripe-checkout
# Returns:
{
  "status": "success",
  "checkout_session_created": true,
  "session_id": "cs_test_abc123",
  "test_card": "4242 4242 4242 4242",
  "success_url": "http://localhost:3000/checkout/success",
  "cancel_url": "http://localhost:3000/checkout/cancel",
  "webhook_listener": "running"
}
```

**Step 3: Verify Webhook (Manual)**
```bash
# Use Stripe CLI
stripe trigger checkout.session.completed
# Watch logs for webhook processing
```

### Output
```json
{
  "specialist": "gigaforge-specialist",
  "status": "success",
  "task": "Test Stripe Checkout Flow",
  "data": {
    "phase": "Verification",
    "stripe_configured": true,
    "checkout_session_created": true,
    "webhook_listener": "running",
    "test_mode": true,
    "files_modified": [],
    "commands_executed": [
      "/gigaforge:checking-api-health",
      "/gigaforge:testing-stripe-checkout"
    ],
    "tests_passed": true
  },
  "metadata": {
    "execution_time": 45,
    "next_recommended_task": "Proceed with checkout implementation",
    "blockers": []
  },
  "errors": []
}
```

### Performance
- **Execution time**: 45 seconds
- **Commands used**: 2 custom commands
- **Status**: Success ✓

**Lesson**: Custom commands simplify complex testing workflows

---

## Example 4: Deployment to Vercel (Complete Workflow)

**Scenario**: Deploy v2-pivot branch to Vercel with smoke tests

### Input
```json
{
  "task": "Deploy to Vercel",
  "branch": "v2-pivot",
  "run_smoke_tests": true
}
```

### Execution Flow

**Step 1: Pre-Deployment Checks**
```bash
# Typecheck
npm run typecheck
# Returns: ✓ No errors

# Build
npm run build
# Returns: ✓ Build successful
```

**Step 2: Push to GitHub**
```bash
git push origin v2-pivot
# Triggers Vercel auto-deploy
```

**Step 3: Wait for Deployment**
```bash
# Poll Vercel API or check logs
# Wait up to 5 minutes for deployment
```

**Step 4: Smoke Tests**
```bash
# Run deployment command with smoke tests
/gigaforge:deploying-to-vercel --branch v2-pivot
# Returns:
{
  "status": "deployed",
  "deployment": {
    "url": "https://gigaforge-web-abc123.vercel.app"
  },
  "smoke_tests": {
    "homepage": "passed",
    "products": "passed",
    "checkout": "passed"
  }
}
```

### Output
```json
{
  "specialist": "gigaforge-specialist",
  "status": "success",
  "task": "Deploy to Vercel",
  "data": {
    "phase": "Deployment",
    "files_modified": [],
    "commands_executed": [
      "npm run typecheck",
      "npm run build",
      "git push origin v2-pivot",
      "/gigaforge:deploying-to-vercel --branch v2-pivot"
    ],
    "tests_passed": true,
    "deployment_status": "deployed",
    "deployment_url": "https://gigaforge-web-abc123.vercel.app",
    "smoke_tests_passed": true
  },
  "metadata": {
    "execution_time": 245,
    "next_recommended_task": "Monitor deployment, test live checkout",
    "blockers": []
  },
  "errors": []
}
```

### Performance
- **Execution time**: 245 seconds (~4 minutes)
- **Build time**: 45 seconds
- **Deployment time**: 145 seconds
- **Smoke tests**: All passed ✓
- **Status**: Deployed ✓

**Lesson**: Automated pre-checks + smoke tests = confident deployments

---

## Example 5: Health Check Before Work (Transient Error Handling)

**Scenario**: Health check fails on first attempt (Strapi slow to respond), succeeds on retry

### Input
```json
{
  "task": "Verify services before starting integration work"
}
```

### Execution Flow

**Step 1: First Health Check Attempt**
```bash
/gigaforge:checking-api-health
# Error: Strapi timeout after 5 seconds
# Error type: NETWORK_ERROR (transient)
```

**Step 2: Retry Logic**
```bash
# Wait 5 seconds
wait(5)

# Retry health check
/gigaforge:checking-api-health
# Success: Strapi responded (was just slow)
{
  "strapi": {
    "status": "healthy",
    "products_available": 10
  },
  "stripe": {
    "status": "healthy"
  },
  "overall_status": "healthy"
}
```

### Output
```json
{
  "specialist": "gigaforge-specialist",
  "status": "success",
  "task": "Health Check Before Work",
  "data": {
    "phase": "Pre-Work Verification",
    "services_healthy": true,
    "retry_required": true,
    "commands_executed": [
      "/gigaforge:checking-api-health",
      "/gigaforge:checking-api-health (retry)"
    ],
    "tests_passed": true
  },
  "metadata": {
    "execution_time": 67,
    "retry_count": 1,
    "first_attempt_failed": true,
    "next_recommended_task": "Proceed with integration work",
    "blockers": []
  },
  "errors": []
}
```

### Performance
- **Total time**: 67 seconds (includes 5s wait + retry)
- **Retry count**: 1
- **Final status**: Success ✓

**Lesson**: Retry logic handles transient network issues gracefully

---

## Example 6: Inventory Drift Detection (Partial Success)

**Scenario**: Inventory validation detects drift, reports partial mismatch

### Input
```json
{
  "task": "Validate inventory synchronization",
  "auto_fix": false
}
```

### Execution Flow

**Step 1: Fetch Inventory from Both Systems**
```bash
# Stripe inventory
stripe_inventory = fetch_stripe_products()

# Strapi inventory
strapi_inventory = fetch_strapi_products()
```

**Step 2: Compare Inventory**
```bash
mismatches = []
for product in products:
  if stripe[product.id].inventory != strapi[product.id].inventory:
    mismatches.append({
      "product_id": product.id,
      "drift": stripe - strapi
    })
```

**Step 3: Report Findings**
```bash
/gigaforge:validating-inventory
# Returns:
{
  "status": "drift_detected",
  "products_checked": 10,
  "mismatches": [
    {
      "product_id": 1,
      "product_name": "Product A",
      "stripe_inventory": 10,
      "strapi_inventory": 12,
      "drift": -2
    }
  ],
  "drift_count": 1
}
```

### Output
```json
{
  "specialist": "gigaforge-specialist",
  "status": "partial",
  "task": "Validate Inventory Synchronization",
  "data": {
    "phase": "Inventory Validation",
    "products_checked": 10,
    "drift_detected": true,
    "mismatches_found": 1,
    "commands_executed": [
      "/gigaforge:validating-inventory"
    ],
    "auto_fix_applied": false
  },
  "metadata": {
    "execution_time": 78,
    "completeness": 0.90,
    "warning": "1 product has inventory drift",
    "next_recommended_task": "Review drift and run with --fix-drift if appropriate",
    "blockers": []
  },
  "errors": []
}
```

### Performance
- **Products checked**: 10
- **Drift detected**: 1 product
- **Status**: Partial (issue detected but not critical) ⚠️
- **Actionable**: Yes (user can decide to fix)

**Lesson**: Partial status allows reporting issues without blocking workflow

---

## Testing Checklist

Use these examples to validate gigaforge-specialist implementation:

- [ ] **Example 1**: Phase 1 migration completes successfully
- [ ] **Example 2**: Strapi integration creates service layer and updates routes
- [ ] **Example 3**: Stripe checkout testing uses custom commands correctly
- [ ] **Example 4**: Deployment workflow includes all pre/post checks
- [ ] **Example 5**: Retry logic handles transient errors
- [ ] **Example 6**: Partial status reports issues without failing

**Target**: All 6 examples should execute as documented

---

**Document Version**: 1.0.0
**Last Updated**: 2025-11-18
**Part of**: gigaforge-specialist agent
