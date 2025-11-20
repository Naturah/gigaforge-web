# Strapi Content Type Schemas for GigaForge

These schema files define the Category, Product, and Forge content types for your Strapi CMS.

## Files Generated

- `category.json` - Category content type (4 fields)
- `product.json` - Product content type (11 fields)
- `forge.json` - Forge content type (9 fields)
- `step-component.json` - Step component (used in Forge)

## Installation Methods

### Method 1: Railway File Upload (Recommended - Fastest)

1. **Create schema directory in your Strapi project:**
   - In Railway dashboard, navigate to your Strapi service
   - Use the file editor or deploy from a GitHub repo

2. **Upload schema files:**
   ```
   src/api/category/content-types/category/schema.json
   src/api/product/content-types/product/schema.json
   src/api/forge/content-types/forge/schema.json
   src/components/default/step.json
   ```

3. **Restart Strapi:**
   - Railway will auto-restart when files are detected
   - Or manually trigger a redeploy

### Method 2: Connect Railway to GitHub Repo

1. **Create a new GitHub repository** for your Strapi backend:
   ```bash
   gh repo create gigaforge-strapi --private
   ```

2. **Initialize Strapi locally:**
   ```bash
   npx create-strapi-app@latest gigaforge-strapi --quickstart --no-run
   cd gigaforge-strapi
   ```

3. **Copy generated schemas to correct locations:**
   ```bash
   mkdir -p src/api/category/content-types/category
   mkdir -p src/api/product/content-types/product
   mkdir -p src/api/forge/content-types/forge
   mkdir -p src/components/default

   cp strapi-schemas/category.json src/api/category/content-types/category/schema.json
   cp strapi-schemas/product.json src/api/product/content-types/product/schema.json
   cp strapi-schemas/forge.json src/api/forge/content-types/forge/schema.json
   cp strapi-schemas/step-component.json src/components/default/step.json
   ```

4. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: Add GigaForge content types"
   git push origin main
   ```

5. **Connect Railway to your GitHub repo:**
   - Railway dashboard → Strapi service → Settings
   - Connect to GitHub repository
   - Railway will redeploy from your repo

### Method 3: Manual Entry via Strapi API (If Builder is Accessible)

If you manage to enable development mode or unlock the Content-Type Builder:

1. Import these schemas via the Content-Type Builder UI
2. Or use Strapi's CLI: `strapi generate:content-type`

## Verification

After installation, verify content types are available:

```bash
# Check API endpoints
curl https://strapi-development-462a.up.railway.app/api/content-type-builder/content-types

# Should return category, product, and forge in the list
```

## Configure Public Permissions

After schemas are loaded:

1. **In Strapi Admin Panel:**
   - Settings → Users & Permissions → Roles → Public

2. **Enable these permissions:**
   - Category: `find`, `findOne`
   - Product: `find`, `findOne`
   - Forge: `find`, `findOne`
   - Upload: `find`, `findOne`

3. **Save**

## Test API Access

```bash
# Test categories
curl https://strapi-development-462a.up.railway.app/api/categories

# Test products
curl https://strapi-development-462a.up.railway.app/api/products

# Test forges
curl https://strapi-development-462a.up.railway.app/api/forges
```

## Next Steps

1. Create content in Content Manager:
   - Add 2-3 categories
   - Upload product images to Media Library
   - Add 5-10 products with Stripe IDs
   - (Optional) Add forge content

2. Configure Vercel environment variables:
   - `STRAPI_API_URL=https://strapi-development-462a.up.railway.app`
   - `STRAPI_API_TOKEN=<your-token>`

3. Run health check:
   ```bash
   /gigaforge:checking-api-health
   ```

4. Proceed to Phase 3: Strapi integration with Remix frontend

## Troubleshooting

**Content types not appearing?**
- Check file paths are correct (case-sensitive)
- Ensure JSON is valid (no trailing commas)
- Check Railway logs for errors
- Restart Strapi service

**API returns 403 Forbidden?**
- Configure public permissions (see above)
- Verify API token is set in Vercel

**Relations not working?**
- Ensure all three content types are loaded before testing
- Category must load first, then Product and Forge (due to relations)

## Support

See CLAUDE.md for complete GigaForge documentation and deployment guide.
