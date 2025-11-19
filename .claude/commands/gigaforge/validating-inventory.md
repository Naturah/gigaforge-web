---
description: Validate Stripe product inventory matches Strapi
argument-hint: [--fix-drift]
allowed-tools: [Bash, Read]
---

# Validating Inventory

## Purpose

Compare product inventory between Stripe and Strapi to detect drift. Reports mismatches and optionally syncs inventory from Strapi to Stripe (authoritative source).

**When to use**: Phase 4+ (after webhook implementation), periodically to verify sync, before major sales.

## Usage

```bash
/gigaforge:validating-inventory
/gigaforge:validating-inventory --fix-drift
```

## Arguments

- `--fix-drift` (optional) - Automatically sync mismatched inventory from Strapi → Stripe

## Implementation Steps

### 1. Fetch Strapi Products

```python
strapi_products = fetch_strapi_products()
```

### 2. Fetch Stripe Products

```python
stripe_products = fetch_stripe_products()
```

### 3. Compare Inventory

```python
for product in strapi_products:
    stripe_product = find_stripe_product(product.stripeProductId)

    if stripe_product.inventory != product.inventory:
        report_drift(product, stripe_product)
```

### 4. Display Drift Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 INVENTORY VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Product: Articulated Dragon
  Strapi: 15 units
  Stripe: 12 units
  Drift: -3 units ⚠️

Product: Hex Storage Box
  Strapi: 8 units
  Stripe: 8 units
  Drift: 0 units ✓

Summary:
  Total Products: 4
  Matched: 3
  Drifted: 1

Run with --fix-drift to sync
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Script Integration

**Script**: `scripts/custom-scripts/validate_inventory.py`

## Related Commands

- `/gigaforge:syncing-strapi-products` - Sync Strapi products
- `/gigaforge:testing-stripe-checkout` - Test checkout flow

---

**Version**: 1.0.0
**Category**: GigaForge E-Commerce
**Created**: 2025-11-18
**Migration Phase**: Phase 4+ (webhook inventory sync)
