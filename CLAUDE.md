# GigaForge - 3D Collectibles E-Commerce Platform

## Project Overview

GigaForge is a modern e-commerce platform for selling 3D printed collectibles, featuring a headless CMS architecture with Strapi, Stripe payment processing, and automated inventory management.

**Live URLs:**
- Production: gigaforge.xyz (main branch)
- Development: gigaforge.xyz (feature-clerk-auth-ui branch)

## Vision & Go-to-Market Strategy

### Primary Goal
Launch a functioning 3D collectibles store with:
- Product catalog managed via Strapi CMS
- Guest checkout flow (no user accounts required initially)
- Real-time inventory tracking via Stripe webhooks
- Fast, responsive shopping experience

### Secondary Features (Future)
- "Forges" - Educational content about 3D printing journeys
- Articles and guides to drive organic traffic
- Community features for makers and collectors
- Optional user accounts for order history

### Market Positioning
- Curated 3D printed collectibles and practical items
- Focus on quality and unique designs
- Educational content to build community
- Low barrier to purchase (guest checkout)

## Architecture

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

### Flow
1. **Content Management**: Admin creates/updates products in Strapi (Railway)
2. **Product Display**: Remix app fetches product data from Strapi API
3. **Shopping Cart**: Client-side cart using localStorage
4. **Checkout**: Stripe Checkout for payment processing
5. **Inventory Update**: Stripe webhook notifies backend → updates Strapi inventory

## Tech Stack

### Frontend
- **Framework**: Remix v2.12.0 (React meta-framework)
- **Build Tool**: Vite v5.1.0 with HMR
- **Language**: TypeScript 5.1.6
- **Styling**: Tailwind CSS 3.4.4
- **Fonts**: Lato, Anton, Space Grotesk, Orbitron, Inter

### Backend/CMS
- **CMS**: Strapi (headless CMS) on Railway
- **Database**: PostgreSQL (Railway managed)
- **API**: RESTful JSON API

### Payments & Infrastructure
- **Payments**: Stripe Checkout + Webhooks
- **Hosting**: Vercel (frontend), Railway (Strapi)
- **State Management**: React hooks + localStorage for cart

### Development Tools
- ESLint with TypeScript, React, JSX-a11y
- PostCSS & Autoprefixer
- Node v20.0.0

## Project Structure

```
gigaforge-web/
├── app/
│   ├── components/
│   │   ├── logo.tsx              # Brand logo component
│   │   ├── nav.tsx               # Main navigation
│   │   └── pagetitle.tsx         # Page title component
│   ├── functions/
│   │   └── useLocalStorage.ts    # Cart state management hook
│   ├── routes/
│   │   ├── _index.tsx            # Homepage
│   │   ├── about.tsx             # About page
│   │   ├── api.create-checkout-session.ts  # Stripe checkout API
│   │   ├── api.stripe-webhook.ts # Stripe webhook handler (future)
│   │   ├── categories.$categoryId.tsx      # Category pages
│   │   ├── checkout.cancel.tsx   # Checkout cancelled
│   │   ├── checkout.success.tsx  # Order confirmation
│   │   ├── forges._index.tsx     # All forges
│   │   ├── forges.$forgeId.tsx   # Individual forge
│   │   └── products.$productId.tsx # Product detail page
│   ├── services/
│   │   └── strapi.server.ts      # Strapi API client (future)
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── root.tsx                  # App root layout
│   └── tailwind.css
├── public/
│   ├── logo-dark.png
│   ├── logo-light.png
│   └── favicon.ico
├── package.json
├── vite.config.ts
├── remix.config.js
├── tailwind.config.ts
└── CLAUDE.md (this file)
```

## Content Types (Strapi)

### Category
```typescript
{
  name: string;           // e.g., "Technology", "Home Improvement"
  slug: string;           // URL-friendly identifier
  description: RichText;  // Category description
  image: Media;           // Category thumbnail
}
```

### Product
```typescript
{
  name: string;              // Product name
  slug: string;              // URL-friendly identifier
  description: RichText;     // Product description
  price: number;             // Price in USD (decimal)
  images: Media[];           // Product images (multiple)
  features: JSON;            // Array of feature strings
  inventory: number;         // Stock quantity
  stripeProductId: string;   // Stripe product ID
  stripePriceId: string;     // Stripe price ID
  category: Relation;        // Belongs to Category
  featured: boolean;         // Show on homepage
}
```

### Forge
```typescript
{
  title: string;             // Forge title
  slug: string;              // URL-friendly identifier
  description: RichText;     // Forge description
  difficulty: Enum;          // Beginner | Intermediate | Advanced
  printCount: number;        // Number of prints in journey
  estimatedTime: string;     // e.g., "2-3 hours"
  image: Media;              // Forge thumbnail
  category: Relation;        // Belongs to Category
  steps: Component[];        // Repeatable: {title, description, image}
}
```

## Environment Variables

### Development (.env.local)
```bash
# Strapi CMS
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token

# Stripe (Test Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

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

## Development Setup

### Prerequisites
- Node.js v20.0.0+
- npm or yarn
- Strapi instance running (local or Railway)
- Stripe account (test mode)

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/Naturah/gigaforge-web.git
   cd gigaforge-web
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Opens at http://localhost:3000

4. **Verify Strapi Connection**
   - Ensure Strapi is running and accessible
   - Test API endpoints: `GET ${STRAPI_API_URL}/api/products`

### Local Strapi Setup (Optional)

If running Strapi locally instead of Railway:

```bash
npx create-strapi-app@latest strapi-backend
cd strapi-backend
npm run develop
```

Access admin: http://localhost:1337/admin

## Deployment

### Strapi on Railway

1. **Create Railway Project**
   - Go to railway.app
   - New Project → Deploy Strapi
   - Automatically provisions PostgreSQL database

2. **Configure Strapi**
   - Set admin credentials
   - Create API token (Settings → API Tokens)
   - Configure CORS to allow Vercel domain

3. **Create Content Types**
   - Build Category, Product, Forge types (see Content Types section)
   - Set permissions: Public read, Admin write

4. **Add Content**
   - Upload product images to media library
   - Create categories and products
   - Publish content

### Frontend on Vercel

1. **Connect Repository**
   - Import gigaforge-web from GitHub
   - Branch: `feature-clerk-auth-ui` (development) or `main` (production)

2. **Configure Environment Variables**
   - Add all production env vars (see Environment Variables section)

3. **Deploy**
   - Vercel auto-deploys on push to branch
   - Check build logs for errors

4. **Configure Custom Domain**
   - Add gigaforge.xyz in Vercel settings
   - Update DNS records

## Stripe Integration

### Checkout Flow

1. User adds products to cart (stored in localStorage)
2. Clicks "Checkout" button
3. Frontend calls `/api/create-checkout-session`
4. Server creates Stripe Checkout session with:
   - Product line items
   - Success/cancel URLs
   - Metadata (product IDs for inventory update)
5. User redirected to Stripe Checkout
6. On success → `/checkout/success`
7. On cancel → `/checkout/cancel`

### Webhook Inventory Management

**Endpoint**: `/api/stripe-webhook`

**Flow**:
1. Stripe sends `checkout.session.completed` event
2. Server verifies webhook signature
3. Extracts product IDs from session metadata
4. Calls Strapi API to decrement inventory
5. Returns 200 OK to Stripe

**Setup**:
1. Install Stripe CLI: `stripe login`
2. Forward webhooks locally: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
3. Copy webhook secret to `.env.local`
4. Test with: `stripe trigger checkout.session.completed`
5. For production: Add Railway/Vercel URL in Stripe dashboard

### Testing

```bash
# Test mode cards
4242 4242 4242 4242  # Success
4000 0000 0000 9995  # Decline

# Use any future expiry date and CVC
```

## Current Migration Status

### ✅ Completed
- Remix + Vite + TypeScript setup
- Tailwind CSS styling
- Product catalog (currently hardcoded)
- Shopping cart (localStorage)
- Stripe checkout integration
- Success/cancel pages
- Forges content system

### 🚧 In Progress (See GitHub Issues)
- **Phase 1**: Remove Clerk authentication
- **Phase 2**: Deploy Strapi on Railway
- **Phase 3**: Integrate Strapi API with frontend
- **Phase 4**: Implement Stripe webhook inventory
- **Phase 5**: Complete documentation
- **Phase 6**: End-to-end testing and deployment

### 📋 GitHub Project
Track progress: https://github.com/Naturah/gigaforge-web/issues

## Future Enhancements

### Phase 1 (Post-MVP)
- Email order confirmations (SendGrid/Resend)
- Low stock alerts for admin
- Product variants (size, color)
- Related products recommendations
- Customer reviews

### Phase 2 (Growth)
- Optional user accounts (order history)
- Wishlist functionality
- Newsletter integration
- SEO optimization
- Analytics (Plausible/Umami)

### Phase 3 (Community)
- User-submitted forges
- Community gallery
- Design contests
- Affiliate program
- Discord integration

### Technical Improvements
- Image optimization (Next.js Image or Cloudinary)
- 3D model previews (Three.js viewer)
- Progressive Web App (PWA)
- Server-side caching
- Search functionality (Algolia/MeiliSearch)

## Troubleshooting

### Strapi API Not Accessible
- Check Railway logs for errors
- Verify CORS settings allow Vercel domain
- Confirm API token is valid
- Test endpoints with Postman

### Stripe Checkout Fails
- Verify all Stripe env vars are set
- Check Stripe API logs in dashboard
- Ensure test mode keys match (pk_test with sk_test)
- Review browser console for errors

### Webhook Not Firing
- Confirm webhook URL is correct in Stripe dashboard
- Check endpoint returns 200 status
- Verify webhook signature validation
- Review Stripe webhook logs

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors: `npm run typecheck`
- Verify all environment variables are set

### Cart Not Persisting
- Check browser localStorage is enabled
- Clear localStorage and test: `localStorage.clear()`
- Verify useLocalStorage hook is working

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Keep components small and focused
- Use Tailwind utility classes over custom CSS

### Git Workflow
- Main branch: `main` (production)
- Development branch: `feature-clerk-auth-ui`
- Create feature branches from development
- Write descriptive commit messages
- Test before pushing

### Testing Checklist
- [ ] Products load from Strapi
- [ ] Add to cart works
- [ ] Cart persists across page reloads
- [ ] Checkout completes successfully
- [ ] Webhook updates inventory
- [ ] Success page shows order details
- [ ] Mobile responsive
- [ ] No console errors

---

**Last Updated**: 2025-11-18
**Current Phase**: Migration to Strapi CMS + Guest Checkout
**Next Steps**: Execute Phase 1 (Clerk removal)

## Dojo Workflow

GigaForge uses The Dojo infrastructure for streamlined development and deployment workflows.

### Session Management

**Start of Every Session**:
```bash
/starting-session
```

Loads:
- Essential documentation (CLAUDE.md, architecture, migration status)
- GitHub issues (#2-#7) with smart priority detection
- Handoff notes from previous session
- Environment readiness check
- Recommended next task

**End of Every Session**:
```bash
/saving-session
```

Performs:
- Auto-generates structured commit message
- Commits and pushes to GitHub
- Closes/updates GitHub issues with handoff notes
- Prepares context for next session

### Custom Commands

**GigaForge-Specific Commands** (in `.claude/commands/gigaforge/`):

1. **/gigaforge:testing-stripe-checkout** - Test Stripe integration with test cards
   ```bash
   /gigaforge:testing-stripe-checkout
   ```
   - Verifies environment variables
   - Creates checkout session
   - Displays test card information
   - Checks webhook status

2. **/gigaforge:syncing-strapi-products** - Fetch products from Strapi and validate
   ```bash
   /gigaforge:syncing-strapi-products
   /gigaforge:syncing-strapi-products --verify
   /gigaforge:syncing-strapi-products --format json
   ```
   - Tests Strapi connectivity
   - Fetches all products
   - Validates schema compliance
   - Reports data quality issues

3. **/gigaforge:checking-api-health** - Verify Strapi + Stripe connectivity
   ```bash
   /gigaforge:checking-api-health
   ```
   - Pings Strapi API health endpoint
   - Verifies Stripe API credentials
   - Checks webhook endpoint configuration
   - Displays service status dashboard

4. **/gigaforge:validating-inventory** - Compare Strapi vs Stripe inventory
   ```bash
   /gigaforge:validating-inventory
   /gigaforge:validating-inventory --fix-drift
   ```
   - Fetches products from both systems
   - Compares inventory counts
   - Reports drift
   - Optionally syncs mismatches

5. **/gigaforge:running-dev-stack** - Start complete dev environment
   ```bash
   /gigaforge:running-dev-stack
   /gigaforge:running-dev-stack --stripe-listen
   ```
   - Checks environment variables
   - Starts Remix dev server
   - Optionally starts Stripe webhook listener
   - Displays running services

6. **/gigaforge:deploying-to-vercel** - Deploy and verify
   ```bash
   /gigaforge:deploying-to-vercel
   /gigaforge:deploying-to-vercel --branch main
   ```
   - Runs pre-deployment checks (build, typecheck)
   - Pushes to GitHub
   - Waits for Vercel deployment
   - Runs post-deployment smoke tests

### Specialist Agents

**Custom Agents** (in `.claude/agents/`):

1. **strapi-integration-specialist** - Handles all Strapi CMS operations
   - Invoked automatically for: "sync products", "fetch from Strapi", "validate schema"
   - Responsibilities: Product syncing, content type validation, API integration
   - Commands: `/gigaforge:syncing-strapi-products`, `/gigaforge:checking-api-health`

2. **stripe-payment-specialist** - Manages Stripe checkout and webhooks
   - Invoked automatically for: "test checkout", "validate webhook", "test payment"
   - Responsibilities: Checkout testing, webhook validation, inventory sync
   - Commands: `/gigaforge:testing-stripe-checkout`, `/gigaforge:validating-inventory`

3. **deployment-orchestrator** - Coordinates Vercel + Railway deployments
   - Invoked automatically for: "deploy", "push to production", "pre-deployment checks"
   - Responsibilities: Pre-deployment validation, deployment coordination, smoke tests
   - Commands: `/gigaforge:deploying-to-vercel`, spawns other specialists

### Example Workflows

**Workflow 1: Start Development Session**
```bash
# 1. Load context and issues
/starting-session

# 2. Check service health
/gigaforge:checking-api-health

# 3. Start dev stack
/gigaforge:running-dev-stack --stripe-listen

# 4. Work on migration phase...

# 5. Test integrations
/gigaforge:testing-stripe-checkout
/gigaforge:syncing-strapi-products --verify

# 6. Save session
/saving-session
```

**Workflow 2: Deploy to Production**
```bash
# 1. Verify everything works locally
/gigaforge:checking-api-health
/gigaforge:testing-stripe-checkout
/gigaforge:syncing-strapi-products

# 2. Deploy (orchestrator handles everything)
/gigaforge:deploying-to-vercel --branch main

# 3. Save deployment session
/saving-session --message "deploy: Production launch v1.0"
```

**Workflow 3: Debug Inventory Drift**
```bash
# 1. Check inventory sync status
/gigaforge:validating-inventory

# 2. If drift detected, investigate
/gigaforge:syncing-strapi-products --verify

# 3. Test webhook delivery
/gigaforge:testing-stripe-checkout

# 4. Fix drift
/gigaforge:validating-inventory --fix-drift
```

### Builder Utilities

**Universal Meta-Commands** (in `.claude/commands/utilities/`):

- **/slash-command-builder** - Create new slash commands
- **/agent-builder** - Create new specialist agents
- **/testing-all-commands** - Run all command tests

These are copied from The Dojo and work universally for any project.

### Development Best Practices

1. **Always start sessions with `/starting-session`** - Loads GitHub issues and handoff notes
2. **Use custom commands for repetitive tasks** - Faster than manual steps
3. **Let agents handle specialized workflows** - Automatic delegation for Stripe/Strapi tasks
4. **End sessions with `/saving-session`** - Auto-commits with structured messages
5. **Reference GitHub issues in commits** - Automatic tracking with `Close #N` syntax

### File Structure

```
gigaforge-web/
├── .claude/
│   ├── commands/
│   │   ├── gigaforge/                # Custom e-commerce commands
│   │   └── utilities/                # Session management + builders
│   ├── agents/
│   │   ├── specialists/
│   │   │   ├── strapi-integration-specialist/
│   │   │   └── stripe-payment-specialist/
│   │   └── orchestrators/
│   │       └── deployment-orchestrator/
│   └── hooks/
│       └── post-tool-use/
│           └── auto-format.sh        # Auto-format code on file writes
├── scripts/
│   └── custom-scripts/
│       ├── test_stripe_checkout.py   # Stripe checkout test script
│       ├── sync_strapi_products.py   # Strapi product sync script
│       └── check_api_health.py       # API health check script
└── CLAUDE.md                          # This file
```

### Quality Standards

- **Commands**: Clear documentation, argument hints, usage examples
- **Agents**: Progressive disclosure (<200 lines entry point), reference files for details
- **Scripts**: Error handling, clear output, exit codes (0=success, 1=error)
- **Session workflow**: Structured commits, GitHub issue tracking, handoff notes

---

**Dojo Version**: 1.0.0 (GigaForge Custom)
**Infrastructure Complete**: 2025-11-18
**Commands**: 11 (5 utilities + 6 gigaforge)
**Agents**: 3 (2 specialists + 1 orchestrator)
**Scripts**: 3 (Python-based automation)

