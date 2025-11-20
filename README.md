# GigaForge - 3D Collectibles E-Commerce

> Modern e-commerce platform for selling 3D printed collectibles with headless CMS architecture.

**Live Site:** [gigaforge.xyz](https://gigaforge.xyz)
**Status:** 🚧 Phase 2 of 6 - Migrating to Strapi CMS + Guest Checkout

---

## Features

- **Headless CMS** - Content managed via Strapi (Railway)
- **Guest Checkout** - Seamless purchasing with Stripe (no account required)
- **Real-Time Inventory** - Automatic updates via Stripe webhooks
- **Server-Side Rendering** - Fast page loads with Remix
- **Modern UI** - Tailwind CSS responsive design
- **Cloud-First Development** - Vercel-GitHub automated deployment pipeline

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Remix + React + TypeScript |
| **Styling** | Tailwind CSS |
| **CMS** | Strapi (Railway) |
| **Database** | PostgreSQL (Railway) |
| **Payments** | Stripe Checkout + Webhooks |
| **Hosting** | Vercel (frontend) + Railway (backend) |
| **Build** | Vite |

---

## Quick Start

### Prerequisites
- Node.js v20.0.0+
- Railway Strapi instance
- Stripe account (test mode)
- Vercel account (for deployment)

### Local Development

```bash
# Clone repository
git clone https://github.com/Naturah/gigaforge-web.git
cd gigaforge-web

# Install dependencies
npm install

# Configure environment variables in Vercel Dashboard
# (See CLAUDE.md for cloud-only development approach)

# Start development server
npm run dev
```

**Note:** GigaForge uses a cloud-first development approach. Environment variables are configured in Vercel Dashboard rather than local `.env` files. See [CLAUDE.md](./CLAUDE.md#development-philosophy) for details.

---

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete developer guide
  - Architecture overview
  - 6-phase migration plan
  - Tech stack details
  - Environment variable setup
  - Deployment instructions
  - Development workflows

- **[.claude/](./.claude/)** - Dojo workflow automation
  - Custom slash commands (`/gigaforge:*`, `/utilities:*`)
  - Specialist agents (Strapi, Stripe, deployment)
  - Session management tools

---

## Current Migration Status

**Phase 1: ✅ COMPLETE** - Remove Clerk authentication
**Phase 2: 🔄 IN PROGRESS** - Deploy Strapi CMS to Railway
**Phase 3: ⏳ PENDING** - Integrate Strapi API with Remix
**Phase 4: ⏳ PENDING** - Implement Stripe webhook inventory
**Phase 5: ⏳ PENDING** - Update documentation
**Phase 6: ⏳ PENDING** - End-to-end testing & production deployment

See [GitHub Issues](https://github.com/Naturah/gigaforge-web/issues) for detailed progress tracking.

---

## Contributing

This project uses The Dojo workflow for development:

```bash
# Start session (loads context + GitHub issues)
/starting-session

# Work on phase tasks...

# End session (commits + updates GitHub issues)
/saving-session
```

See [CLAUDE.md - Dojo Workflow](./CLAUDE.md#dojo-workflow) for complete workflow documentation.

---

## Project Vision

GigaForge is building a modern e-commerce platform for 3D printed collectibles with:

- **Curated Product Catalog** - Quality 3D prints and practical items
- **Educational Content** - "Forges" showcasing 3D printing journeys
- **Guest Checkout First** - Low barrier to purchase (no account needed)
- **Community Features** - Future: user submissions, gallery, contests

See [CLAUDE.md - Vision & Go-to-Market Strategy](./CLAUDE.md#vision--go-to-market-strategy) for full roadmap.

---

## Commands

### Development
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
```

### GigaForge Custom Commands
```bash
/gigaforge:checking-api-health              # Verify Strapi + Stripe connectivity
/gigaforge:testing-stripe-checkout          # Test Stripe integration
/gigaforge:syncing-strapi-products          # Fetch products from Strapi
/gigaforge:validating-inventory             # Compare Strapi vs Stripe inventory
/gigaforge:running-dev-stack                # Start complete dev environment
/gigaforge:deploying-to-vercel              # Deploy and verify
```

See [.claude/commands/gigaforge/](./.claude/commands/gigaforge/) for command documentation.

---

## Environment Variables

Configured in **Vercel Dashboard** (Settings → Environment Variables):

```bash
# Strapi CMS (Railway)
STRAPI_API_URL=https://your-strapi.up.railway.app
STRAPI_API_TOKEN=your_api_token

# Stripe (Test Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
BASE_URL=https://gigaforge.xyz
```

**Security:** Never commit `.env` files. Configure separately for Production/Preview/Development environments. See [CLAUDE.md - Environment Variable Security](./CLAUDE.md#environment-variable-security-best-practices).

---

## Deployment

GigaForge uses automated deployment via Vercel-GitHub integration:

1. **Push to feature branch** → Preview deployment created
2. **Create PR** → Preview URL attached to PR
3. **Merge to v2-pivot** → Pre-production deployment
4. **Merge to main** → Production deployment (gigaforge.xyz)

See [CLAUDE.md - Deployment](./CLAUDE.md#deployment) for detailed instructions.

---

## Support & Feedback

- **Issues:** [GitHub Issues](https://github.com/Naturah/gigaforge-web/issues)
- **Documentation:** [CLAUDE.md](./CLAUDE.md)
- **Developer Guide:** See detailed architecture, setup, and workflow in CLAUDE.md

---

## License

Private project - © 2025 GigaForge

---

**For Contributors:** Start with [CLAUDE.md](./CLAUDE.md) for comprehensive setup instructions, architecture details, and development workflows.
