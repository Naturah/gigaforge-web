# GigaForge Command Integration Patterns

Custom command invocation patterns for gigaforge-web workflows.

---

## GigaForge Custom Commands

### /gigaforge:testing-stripe-checkout

**Purpose**: Test complete Stripe checkout flow with test cards

**When to Use**:
- Phase 1 complete (testing guest checkout)
- After Strapi integration (Phase 3)
- Before production deployment (Phase 6)

**Command**:
```bash
/gigaforge:testing-stripe-checkout [--mode test|live]
```

**Parameters**:
- `--mode`: Test mode (default) or live mode

**Script**: `scripts/custom-scripts/test_stripe_checkout.py`

**Expected Output**:
```json
{
  "status": "success",
  "checkout_session_created": true,
  "session_id": "cs_test_...",
  "test_card": "4242 4242 4242 4242",
  "success_url": "http://localhost:3000/checkout/success",
  "cancel_url": "http://localhost:3000/checkout/cancel",
  "webhook_listener": "running|not_running"
}
```

**Error Codes**:
- `STRIPE_KEY_MISSING`: STRIPE_SECRET_KEY not in environment
- `API_ERROR`: Stripe API returned error
- `NETWORK_ERROR`: Cannot reach Stripe API

**Integration Pattern**:
```bash
# Invoke command
result = execute("/gigaforge:testing-stripe-checkout")

# Parse output
if result.status == "success":
  log("Stripe checkout configured correctly")
  return pass_test()
else:
  log_error(result.errors)
  return fail_test()
```

---

### /gigaforge:syncing-strapi-products

**Purpose**: Fetch products from Strapi and validate data integrity

**When to Use**:
- Phase 2 complete (Strapi deployed)
- Phase 3 integration (verify products available)
- Debugging data issues

**Command**:
```bash
/gigaforge:syncing-strapi-products [--verify] [--format json|table]
```

**Parameters**:
- `--verify`: Validate schema compliance
- `--format`: Output format (table default, json for programmatic use)

**Script**: `scripts/custom-scripts/sync_strapi_products.py`

**Expected Output** (JSON format):
```json
{
  "status": "success",
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "slug": "product-name",
      "price": 29.99,
      "inventory": 15,
      "stripeProductId": "prod_...",
      "stripePriceId": "price_...",
      "category": "Technology"
    }
  ],
  "total_count": 10,
  "schema_valid": true,
  "warnings": []
}
```

**Error Codes**:
- `STRAPI_UNREACHABLE`: Cannot connect to Strapi API
- `AUTH_FAILED`: STRAPI_API_TOKEN invalid
- `SCHEMA_INVALID`: Product data missing required fields

**Integration Pattern**:
```bash
# Check Strapi connectivity
result = execute("/gigaforge:syncing-strapi-products --verify --format json")

# Validate response
if result.status == "success" and result.schema_valid:
  product_count = result.total_count
  log(f"Strapi has {product_count} products ready")
  return ready_for_integration()
else:
  log_warnings(result.warnings)
  return fix_strapi_data()
```

---

### /gigaforge:checking-api-health

**Purpose**: Health check for Strapi API and Stripe connectivity

**When to Use**:
- Session start (verify external services)
- Before integration work (Phase 3)
- Debugging connectivity issues

**Command**:
```bash
/gigaforge:checking-api-health
```

**Script**: `scripts/custom-scripts/check_api_health.py`

**Expected Output**:
```json
{
  "strapi": {
    "status": "healthy|unhealthy",
    "url": "https://your-strapi.railway.app",
    "health_check": "passed|failed",
    "products_available": 10
  },
  "stripe": {
    "status": "healthy|unhealthy",
    "api_key_valid": true,
    "mode": "test|live"
  },
  "local_server": {
    "status": "running|not_running",
    "port": 3000
  },
  "overall_status": "healthy|degraded|unhealthy"
}
```

**Error Codes**:
- `STRAPI_DOWN`: Strapi health endpoint not responding
- `STRIPE_INVALID_KEY`: Stripe API key rejected
- `ENV_VAR_MISSING`: Required environment variable not set

**Integration Pattern**:
```bash
# Health check before starting work
health = execute("/gigaforge:checking-api-health")

if health.overall_status == "healthy":
  proceed_with_task()
elif health.overall_status == "degraded":
  warn_user("Some services unavailable")
  ask_proceed()
else:
  return error("Cannot proceed: services unhealthy")
```

---

### /gigaforge:validating-inventory

**Purpose**: Compare Stripe product inventory with Strapi

**When to Use**:
- Phase 4 complete (webhook implemented)
- Debugging inventory drift
- Production monitoring

**Command**:
```bash
/gigaforge:validating-inventory [--fix-drift]
```

**Parameters**:
- `--fix-drift`: Automatically sync mismatched inventory (use with caution)

**Expected Output**:
```json
{
  "status": "synced|drift_detected",
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
  "drift_count": 1,
  "action_taken": "reported|auto_synced"
}
```

**Error Codes**:
- `STRIPE_FETCH_FAILED`: Cannot fetch Stripe product data
- `STRAPI_FETCH_FAILED`: Cannot fetch Strapi product data
- `SYNC_FAILED`: Auto-sync encountered error

**Integration Pattern**:
```bash
# Check for drift
result = execute("/gigaforge:validating-inventory")

if result.status == "drift_detected":
  log_warning(f"{result.drift_count} products have inventory drift")
  display_mismatches(result.mismatches)

  if user_approves_sync():
    sync_result = execute("/gigaforge:validating-inventory --fix-drift")
    return sync_result
else:
  log("All inventory synchronized")
```

---

### /gigaforge:running-dev-stack

**Purpose**: Start complete development stack (Remix + Stripe webhooks)

**When to Use**:
- Session start (development)
- Before testing webhook integration (Phase 4)

**Command**:
```bash
/gigaforge:running-dev-stack [--stripe-listen]
```

**Parameters**:
- `--stripe-listen`: Also start Stripe webhook listener

**Expected Output**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 GIGAFORGE DEV STACK STARTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Environment variables loaded
✓ Remix dev server starting...
  → http://localhost:3000

✓ Stripe webhook listener starting... (--stripe-listen)
  → Forwarding to http://localhost:3000/api/stripe-webhook
  → Webhook secret: whsec_...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICES RUNNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Frontend: http://localhost:3000
  Webhooks: stripe listen (active)

Press Ctrl+C to stop all services
```

**Error Codes**:
- `ENV_MISSING`: Required environment variables not set
- `PORT_IN_USE`: Port 3000 already in use
- `STRIPE_CLI_NOT_FOUND`: Stripe CLI not installed

**Integration Pattern**:
```bash
# Start dev stack in background
execute_background("/gigaforge:running-dev-stack --stripe-listen")

# Wait for services to be ready
wait_for_service("http://localhost:3000", timeout=30)

# Proceed with development work
```

---

### /gigaforge:deploying-to-vercel

**Purpose**: Deploy to Vercel with pre/post checks

**When to Use**:
- Phase 6 (production deployment)
- Ad-hoc deployments after major changes

**Command**:
```bash
/gigaforge:deploying-to-vercel [--branch v2-pivot|main]
```

**Parameters**:
- `--branch`: Branch to deploy (default: current branch)

**Expected Output**:
```json
{
  "status": "deployed|failed",
  "pre_checks": {
    "typecheck": "passed",
    "build": "passed"
  },
  "deployment": {
    "url": "https://gigaforge-web-abc123.vercel.app",
    "branch": "v2-pivot",
    "commit": "d22c855"
  },
  "smoke_tests": {
    "homepage": "passed",
    "products": "passed",
    "checkout": "passed"
  },
  "deployment_time": 145
}
```

**Error Codes**:
- `TYPECHECK_FAILED`: TypeScript errors present
- `BUILD_FAILED`: Build command failed
- `DEPLOYMENT_FAILED`: Vercel deployment error
- `SMOKE_TEST_FAILED`: Deployed site not responding

**Integration Pattern**:
```bash
# Deploy to Vercel
result = execute("/gigaforge:deploying-to-vercel --branch v2-pivot")

if result.status == "deployed":
  log(f"Deployed to: {result.deployment.url}")

  if result.smoke_tests.all_passed:
    log("All smoke tests passed ✓")
    return success()
  else:
    warn("Some smoke tests failed")
    return partial_success()
else:
  log_error("Deployment failed")
  return failure()
```

---

## Session Management Commands

### /starting-session

**Purpose**: Load context, sync GitHub issues, show handoff

**When to Use**: Start of every gigaforge-web session

**Command**:
```bash
/starting-session [--labels label1,label2] [--show-closed] [--quick]
```

**Output**:
- Loads CLAUDE.md
- Syncs GitHub issues #2-#7 (6 phases)
- Shows migration progress
- Recommends next task
- Checks environment variables

**Integration**: Use at session start to get full context

---

### /saving-session

**Purpose**: Commit, push, update GitHub issues with handoff

**When to Use**: End of every gigaforge-web session

**Command**:
```bash
/saving-session [--auto] [--progress N] [--message "custom message"]
```

**Parameters**:
- `--progress N`: Update issue #N with progress
- `--auto`: Skip confirmation prompts
- `--message`: Custom commit message

**Output**:
- Structured commit message
- Push to remote
- GitHub issue updated with handoff notes
- Next session recommendations

**Integration**: Use at session end to preserve context

---

## Command Execution Patterns

### Pattern 1: Direct Execution (Preferred)

**Use When**: Command is reliable and fast

```bash
# Execute command directly
result = execute_command("/gigaforge:checking-api-health")

# Validate output
if result.overall_status == "healthy":
  return success()
else:
  return error(result.issues)
```

**Pros**: Fast, simple
**Cons**: No retry logic

---

### Pattern 2: Retry with Validation

**Use When**: Command may fail due to transient errors

```bash
max_attempts = 2
attempt = 1

while attempt <= max_attempts:
  result = execute_command("/gigaforge:syncing-strapi-products")

  if result.status == "success":
    return result

  if attempt < max_attempts and result.error == "NETWORK_ERROR":
    wait(5)
    attempt += 1
  else:
    return error(result.error)
```

**Pros**: Handles transient failures
**Cons**: Slower on errors

---

### Pattern 3: Pre-Check Before Execution

**Use When**: Command has prerequisites

```bash
# Pre-check
health = execute("/gigaforge:checking-api-health")

if health.strapi.status == "unhealthy":
  return error("Strapi unavailable, cannot sync products")

# Proceed if healthy
result = execute("/gigaforge:syncing-strapi-products")
return result
```

**Pros**: Fails fast on missing prerequisites
**Cons**: Extra command invocation

---

## Testing Command Integration

### Test Checklist
- [ ] All commands exist and are executable
- [ ] Error handling covers all error types
- [ ] Output format is consistent (JSON where expected)
- [ ] Performance meets targets (<2 minutes per command)
- [ ] Commands work in both development and production environments

---

**Document Version**: 1.0.0
**Last Updated**: 2025-11-18
**Part of**: gigaforge-specialist agent
