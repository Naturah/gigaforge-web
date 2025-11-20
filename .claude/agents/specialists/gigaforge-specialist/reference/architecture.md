# GigaForge Architecture & Domain Logic

Complete architecture reference for the gigaforge-web e-commerce platform.

---

## Project Overview

**GigaForge** is a modern e-commerce platform for selling 3D printed collectibles with headless CMS architecture.

**Repository**: https://github.com/Naturah/gigaforge-web
**Production**: gigaforge.xyz
**Current Branch**: v2-pivot

---

## Tech Stack

### Frontend
- **Framework**: Remix v2.12.0 (React meta-framework)
- **Build Tool**: Vite v5.1.0
- **Language**: TypeScript 5.1.6
- **Styling**: Tailwind CSS 3.4.4
- **Hosting**: Vercel

### Backend/CMS
- **CMS**: Strapi (headless) on Railway
- **Database**: PostgreSQL (Railway managed)
- **API**: RESTful JSON

### Payments & Infrastructure
- **Payments**: Stripe Checkout + Webhooks
- **State**: React hooks + localStorage (cart)
- **Node**: v20.0.0

---

## Architecture Diagram

```
┌─────────────────┐
│   Vercel        │
│  (Frontend)     │
│   Remix App     │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│   Railway       │  │     Stripe      │
│   Strapi CMS    │  │   Payments      │
│  + PostgreSQL   │  │   + Webhooks    │
└─────────────────┘  └─────────────────┘
         │                  │
         └──────────┬───────┘
                    │
                    ▼
            Inventory Sync
```

---

## Migration Phases (6-Phase Plan)

### Phase 1: Remove Clerk Authentication ✅ Priority
**Goal**: Prepare for guest checkout by removing all Clerk dependencies

**Tasks**:
1. Delete 7 auth route files
2. Remove ClerkApp wrapper from root.tsx
3. Clean nav.tsx (remove UserButton, auth conditionals)
4. Remove @clerk/remix from package.json
5. Run npm install
6. Test guest checkout flow

**Verification**:
- No Clerk imports in codebase
- Stripe checkout works without auth
- No console errors

**Smart Check**:
```bash
# Clerk still present?
grep -c "@clerk/remix" package.json
# Returns 1 if present, 0 if removed
```

---

### Phase 2: Deploy Strapi CMS on Railway
**Goal**: Set up headless CMS for product management

**Tasks**:
1. Create Railway project
2. Deploy Strapi with PostgreSQL
3. Create content types (Category, Product, Forge)
4. Configure permissions (public read, admin write)
5. Seed initial products
6. Generate API token

**Verification**:
- Strapi admin accessible
- API endpoints return data: `GET /api/products`
- Content types created with proper relations

**Environment Variables Required**:
```bash
STRAPI_API_URL=https://your-strapi.railway.app
STRAPI_API_TOKEN=your_api_token
```

---

### Phase 3: Integrate Strapi API with Remix
**Goal**: Replace hardcoded data with Strapi CMS

**Tasks**:
1. Create `app/services/strapi.server.ts`
2. Update product routes to fetch from Strapi
3. Update category routes
4. Update forges routes
5. Update homepage (featured products)
6. Modify Stripe checkout to use Strapi data

**Verification**:
- All pages render with Strapi data
- Product images display
- Cart functionality preserved
- No hardcoded content remains

**Smart Check**:
```bash
# Strapi service exists?
[ -f app/services/strapi.server.ts ] && echo "Phase 3 complete" || echo "Not started"
```

---

### Phase 4: Stripe Webhook for Inventory Management
**Goal**: Auto-decrement inventory when orders complete

**Tasks**:
1. Create `app/routes/api.stripe-webhook.ts`
2. Verify webhook signature
3. Handle `checkout.session.completed` event
4. Update Strapi inventory via API
5. Add low stock indicators
6. Prevent checkout if inventory = 0

**Verification**:
- Webhook receives events
- Inventory decrements correctly
- Logs show successful updates
- Out of stock prevention works

**Smart Check**:
```bash
# Webhook handler exists?
[ -f app/routes/api.stripe-webhook.ts ] && echo "Phase 4 in progress" || echo "Not started"
```

---

### Phase 5: Documentation (CLAUDE.md)
**Goal**: Comprehensive project documentation

**Tasks**:
1. Architecture overview
2. Tech stack documentation
3. Content type schemas
4. Environment variables
5. Deployment instructions
6. Troubleshooting guide

**Verification**:
- New developer can set up from docs alone
- All services documented
- Deployment steps clear

**Smart Check**:
```bash
# CLAUDE.md comprehensive?
[ -f CLAUDE.md ] && wc -l CLAUDE.md | awk '{if ($1 > 300) print "Phase 5 complete"; else print "Needs expansion"}'
```

---

### Phase 6: Testing & Production Deployment
**Goal**: End-to-end testing and production release

**Tasks**:
1. Local testing (cart, checkout, webhook, inventory)
2. Production deployment (Vercel + Railway)
3. Production testing (live checkout, webhook)
4. Monitoring setup

**Verification**:
- All tests pass
- Live site functional
- Webhook processing works in production
- No critical errors

---

## Content Types (Strapi Schema)

### Category
```typescript
{
  name: string;           // e.g., "Technology"
  slug: string;           // "technology"
  description: RichText;
  image: Media;
}
```

### Product
```typescript
{
  name: string;
  slug: string;
  description: RichText;
  price: number;             // Decimal (USD)
  images: Media[];           // Multiple
  features: JSON;            // ["Feature 1", "Feature 2"]
  inventory: number;         // Stock count
  stripeProductId: string;
  stripePriceId: string;
  category: Relation;        // belongs to Category
  featured: boolean;
}
```

### Forge
```typescript
{
  title: string;
  slug: string;
  description: RichText;
  difficulty: Enum;          // Beginner | Intermediate | Advanced
  printCount: number;
  estimatedTime: string;     // "2-3 hours"
  image: Media;
  category: Relation;
  steps: Component[];        // {title, description, image}
}
```

---

## Workflows

### Workflow 1: Migration Task Execution

**When to Use**: Executing any of the 6 migration phases

**Procedure**:
1. **Load Context**:
   - Read CLAUDE.md (architecture, current status)
   - Check package.json (dependencies, current state)
   - Identify current phase

2. **Execute Phase Tasks**:
   - Use Write/Edit tools for code changes
   - Use Bash for npm commands, git operations
   - Use Glob/Grep for file discovery

3. **Verify Completion**:
   - Run typecheck: `npm run typecheck`
   - Run build: `npm run build` (if applicable)
   - Test affected functionality

4. **Return Progress**:
   - Files modified
   - Commands executed
   - Tests passed
   - Next phase recommendation

**Example**: Phase 1 (Remove Clerk)
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
      "... (5 more auth routes)"
    ],
    "files_modified": [
      "app/root.tsx",
      "app/components/nav.tsx",
      "package.json"
    ],
    "commands_executed": [
      "npm install",
      "npm run typecheck"
    ],
    "tests_passed": true
  },
  "metadata": {
    "execution_time": 245,
    "migration_progress": "Phase 1 of 6 (17% complete)",
    "next_recommended_task": "Phase 2: Deploy Strapi on Railway",
    "blockers": []
  },
  "errors": []
}
```

---

### Workflow 2: Strapi Integration

**When to Use**: Implementing Strapi API integration (Phase 3)

**Procedure**:
1. **Prerequisites Check**:
   - Verify `STRAPI_API_URL` in environment
   - Test connectivity: `/gigaforge:checking-api-health`
   - Confirm Strapi has products

2. **Create Service Layer**:
   - Write `app/services/strapi.server.ts`
   - Implement typed API client
   - Add methods: getProducts(), getProductBySlug(), etc.

3. **Update Routes**:
   - Modify loaders to fetch from Strapi
   - Remove hardcoded data
   - Map Strapi response to component props

4. **Test Integration**:
   - Run dev server: `npm run dev`
   - Browse products
   - Verify cart still works

5. **Return Status**:
   - Service file created
   - Routes updated
   - Integration tested

---

### Workflow 3: Deployment

**When to Use**: Deploying to Vercel (Phase 6 or ad-hoc)

**Procedure**:
1. **Pre-Deployment Checks**:
   - Run typecheck: `npm run typecheck`
   - Run build: `npm run build`
   - Check environment variables in Vercel

2. **Deploy**:
   - Push to GitHub
   - Wait for Vercel auto-deploy
   - Check build logs

3. **Post-Deployment**:
   - Run `/gigaforge:deploying-to-vercel` (smoke tests)
   - Test critical paths (/, /products, /checkout)
   - Verify no console errors

4. **Return Status**:
   - Deployment URL
   - Build status
   - Smoke test results

---

## Output Format Standardization

All gigaforge-specialist outputs follow this structure:

```json
{
  "specialist": "gigaforge-specialist",
  "status": "success|partial|failed",
  "task": "Brief task description",
  "data": {
    "phase": "Phase identifier (if applicable)",
    "files_modified": ["array of files"],
    "commands_executed": ["array of commands"],
    "tests_passed": true|false,
    "deployment_status": "deployed|pending|failed|n/a"
  },
  "metadata": {
    "execution_time": 0,
    "migration_progress": "Phase X of 6 (Y% complete)",
    "next_recommended_task": "What to do next",
    "blockers": ["Any blockers encountered"]
  },
  "errors": []
}
```

---

## Environment Variables Reference

### Development (.env.local)
```bash
# Strapi CMS (Phase 2+)
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token

# Stripe (Phase 1+)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Phase 4+

# App
BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Production (Vercel)
```bash
# Strapi CMS (Railway)
STRAPI_API_URL=https://your-strapi.railway.app
STRAPI_API_TOKEN=production_token

# Stripe (Live Mode)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
BASE_URL=https://gigaforge.xyz
NODE_ENV=production
```

---

## Smart Phase Detection

The specialist can automatically detect current phase:

```bash
# Phase 1: Clerk still present?
grep "@clerk/remix" package.json > /dev/null && echo "Phase 1 incomplete"

# Phase 2: Strapi deployed?
[ -n "$STRAPI_API_URL" ] && echo "Phase 2 complete or in progress"

# Phase 3: Strapi service exists?
[ -f app/services/strapi.server.ts ] && echo "Phase 3 complete or in progress"

# Phase 4: Webhook handler exists?
[ -f app/routes/api.stripe-webhook.ts ] && echo "Phase 4 in progress"

# Phase 5: CLAUDE.md comprehensive?
[ -f CLAUDE.md ] && wc -l CLAUDE.md | awk '{if ($1 > 300) print "Phase 5 complete"}'

# Phase 6: Deployed to production?
curl -s https://gigaforge.xyz > /dev/null && echo "Phase 6 complete"
```

---

**Document Version**: 1.0.0
**Last Updated**: 2025-11-18
**Part of**: gigaforge-specialist agent
