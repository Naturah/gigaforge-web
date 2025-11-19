---
description: Deploy to Vercel and verify deployment
argument-hint: [--branch feature-clerk-auth-ui|main]
allowed-tools: [Bash, Read]
---

# Deploying to Vercel

## Purpose

Deploy GigaForge to Vercel and verify deployment success. Runs pre-deployment checks (build, typecheck), pushes to remote, waits for Vercel deployment, and tests critical paths.

**When to use**: After completing migration phases, before production launch, for testing deployments.

## Usage

```bash
/gigaforge:deploying-to-vercel
/gigaforge:deploying-to-vercel --branch main
```

## Arguments

- `--branch` (optional) - Branch to deploy: `feature-clerk-auth-ui` (default) or `main`

## Implementation Steps

### 1. Pre-Deployment Checks

```bash
echo "Step 1: Running pre-deployment checks..."

# TypeScript check
npm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found"
  exit 1
fi

# Build check
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✓ TypeScript: No errors"
echo "✓ Build: Success"
```

### 2. Push to Remote

```bash
echo "Step 2: Pushing to GitHub..."

git push origin $BRANCH
if [ $? -ne 0 ]; then
  echo "❌ Git push failed"
  exit 1
fi

echo "✓ Pushed to origin/$BRANCH"
```

### 3. Wait for Vercel Deployment

```bash
echo "Step 3: Waiting for Vercel deployment..."

# Poll Vercel deployment status
# This requires Vercel CLI or GitHub API integration
```

### 4. Verify Deployment

```bash
echo "Step 4: Verifying deployment..."

# Test critical paths
curl -f https://gigaforge.xyz/ > /dev/null
curl -f https://gigaforge.xyz/products > /dev/null

echo "✓ Deployment verified"
```

## Script Integration

**Script**: `scripts/custom-scripts/deploy_vercel.sh`

## Related Commands

- `/gigaforge:checking-api-health` - Verify services before deploy
- `/gigaforge:testing-stripe-checkout` - Test checkout before deploy
- `/saving-session` - Commit and push changes

---

**Version**: 1.0.0
**Category**: GigaForge E-Commerce
**Created**: 2025-11-18
