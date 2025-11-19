# GigaForge Sub-Agents

**Project-Specific AI Assistants** for gigaforge-web development

---

## Overview

GigaForge uses specialized AI agents with dedicated context windows to handle e-commerce specific workflows. This enables:

1. **Context Management**: Offload gigaforge work to dedicated agent, preserve main context
2. **Phase Awareness**: Agent understands 6-phase migration and current status
3. **Command Integration**: Seamless integration with custom /gigaforge:* commands
4. **Structured Output**: JSON progress reports for tracking

---

## Available Agents

### gigaforge-specialist

**Purpose**: Execute GigaForge-specific workflows (migration, integration, deployment)

**When to Use**:
- 6-phase migration tasks (Clerk removal → Strapi → Integration → Webhooks → Docs → Testing)
- Strapi CMS operations (product syncing, content validation, API integration)
- Stripe integration (checkout testing, webhook implementation, inventory sync)
- Deployment workflows (Vercel + Railway coordination, smoke testing)

**Invocation**:
```bash
# Natural language (auto-triggers)
"Integrate Strapi API for products"
"Deploy to Vercel with smoke tests"
"Test Stripe checkout flow"

# Explicit
"Use gigaforge-specialist to execute Phase 1"
```

**Output**:
```json
{
  "specialist": "gigaforge-specialist",
  "status": "success|partial|failed",
  "task": "Brief description",
  "data": {
    "phase": "Phase X of 6",
    "files_modified": ["list"],
    "commands_executed": ["list"],
    "tests_passed": true
  },
  "metadata": {
    "migration_progress": "Phase 2 of 6 (33% complete)",
    "next_recommended_task": "..."
  }
}
```

**Competencies**:
- ✅ 6-phase migration execution with smart phase detection
- ✅ Strapi CMS integration (Railway deployment, content types, API)
- ✅ Stripe payment processing (checkout, webhooks, inventory)
- ✅ Vercel + Railway deployment coordination
- ✅ Custom command integration (/gigaforge:* commands)
- ✅ Environment validation and health checks

**Documentation**:
- [AGENT.md](specialists/gigaforge-specialist/AGENT.md) - Agent overview and procedures
- [reference/architecture.md](specialists/gigaforge-specialist/reference/architecture.md) - GigaForge architecture and migration phases
- [reference/commands.md](specialists/gigaforge-specialist/reference/commands.md) - Command integration patterns
- [reference/examples.md](specialists/gigaforge-specialist/reference/examples.md) - Real-world workflow examples

---

## Architecture

### Progressive Disclosure Pattern

Agents use a **progressive disclosure architecture** for token efficiency:

```
AGENT.md (<200 lines)
  └─ Entry point, quick start procedure
  └─ References detailed docs (loaded as needed)
      ├─ reference/architecture.md (GigaForge tech stack, migration phases)
      ├─ reference/commands.md (Command patterns)
      └─ reference/examples.md (Workflow examples)
```

**Token Efficiency**:
- Entry point: ~500 tokens (always loaded)
- Reference files: ~2k tokens each (loaded when needed)
- **Total savings**: 60-70% vs monolithic agent

---

## Usage Patterns

### Pattern 1: Migration Task
```bash
User: "Use gigaforge-specialist to remove Clerk authentication"

Agent:
1. Loads gigaforge-web context
2. Validates Phase 1 prerequisites
3. Deletes 7 auth routes
4. Cleans root.tsx, nav.tsx, package.json
5. Runs npm install, typecheck
6. Returns: Phase 1 complete, recommend Phase 2
```

### Pattern 2: Integration Task
```bash
User: "Integrate Strapi API for products route"

Agent:
1. Checks Strapi deployed (STRAPI_API_URL)
2. Creates app/services/strapi.server.ts
3. Updates app/routes/products.$productId.tsx
4. Runs /gigaforge:checking-api-health
5. Returns: Integration complete, files modified
```

### Pattern 3: Deployment Task
```bash
User: "Deploy to Vercel"

Agent:
1. Runs npm run typecheck, build
2. Pushes to GitHub
3. Runs /gigaforge:deploying-to-vercel
4. Runs smoke tests
5. Returns: Deployment URL, test results
```

---

## Integration with Commands

The gigaforge-specialist seamlessly integrates with custom commands:

**Custom Commands** (defined in `.claude/commands/gigaforge/`):
- `/gigaforge:testing-stripe-checkout` - Test payment flows
- `/gigaforge:syncing-strapi-products` - Fetch/validate products
- `/gigaforge:checking-api-health` - Service health dashboard
- `/gigaforge:validating-inventory` - Stripe/Strapi inventory drift
- `/gigaforge:running-dev-stack` - Start dev server + webhooks
- `/gigaforge:deploying-to-vercel` - Deploy with smoke tests

**Integration Pattern**:
```
User Request → gigaforge-specialist → Executes Command → Parses Output → Returns Result
```

---

## Migration Phase Awareness

The gigaforge-specialist understands the 6-phase migration:

1. **Phase 1**: Remove Clerk Authentication (30 min)
2. **Phase 2**: Deploy Strapi on Railway (1.5-2 hrs)
3. **Phase 3**: Integrate Strapi with Remix (3-4 hrs)
4. **Phase 4**: Stripe Webhook Inventory (2-3 hrs)
5. **Phase 5**: Documentation (30-45 min)
6. **Phase 6**: Testing & Deployment (1-1.5 hrs)

**Smart Detection**:
```bash
# Phase 1: Clerk still present?
grep "@clerk/remix" package.json → Detects phase 1 incomplete

# Phase 3: Strapi service exists?
[ -f app/services/strapi.server.ts ] → Detects phase 3 progress

# Phase 4: Webhook handler exists?
[ -f app/routes/api.stripe-webhook.ts ] → Detects phase 4 progress
```

---

## Benefits

**vs Manual Development**:
- ✅ **Context preservation**: Offload work without cluttering main context
- ✅ **Phase awareness**: Agent knows current migration state
- ✅ **Command automation**: Executes commands and parses results
- ✅ **Structured output**: JSON progress reports for tracking

**vs Monolithic Agent**:
- ✅ **Token efficiency**: 60-70% reduction via progressive disclosure
- ✅ **Faster loading**: Entry point <200 lines
- ✅ **Maintainable**: Separate concerns (architecture, commands, examples)

---

## Best Practices

1. **Use natural language**: Agent auto-triggers on gigaforge keywords
2. **Specify phase**: "Execute Phase 3" is clearer than "do integration"
3. **Check output**: Review JSON response for next steps
4. **Session workflow**: Use `/starting-session` and `/saving-session` for full context

---

**Version**: 1.0.0
**Created**: 2025-11-18
**Repository**: Naturah/gigaforge-web
**Dojo Integration**: The Dojo v3.0
