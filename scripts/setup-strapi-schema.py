#!/usr/bin/env python3
"""
Strapi Content Type Schema Generator for GigaForge

This script generates Strapi v5 schema.json files for Category, Product, and Forge
content types, bypassing the locked Content-Type Builder UI in production mode.

Usage:
    python setup-strapi-schema.py

The script will generate schema files that you can upload to Railway.
"""

import json
import os
from pathlib import Path

# ANSI color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

def print_success(msg):
    print(f"{Colors.GREEN}✓{Colors.END} {msg}")

def print_info(msg):
    print(f"{Colors.BLUE}ℹ{Colors.END} {msg}")

def print_warning(msg):
    print(f"{Colors.YELLOW}⚠{Colors.END} {msg}")

def print_error(msg):
    print(f"{Colors.RED}✗{Colors.END} {msg}")

def print_header(msg):
    print(f"\n{Colors.BOLD}{msg}{Colors.END}")
    print("=" * 60)


# Schema for Category content type
CATEGORY_SCHEMA = {
    "kind": "collectionType",
    "collectionName": "categories",
    "info": {
        "singularName": "category",
        "pluralName": "categories",
        "displayName": "Category",
        "description": "Product and forge categories"
    },
    "options": {
        "draftAndPublish": True
    },
    "pluginOptions": {},
    "attributes": {
        "name": {
            "type": "string",
            "required": True,
            "unique": False
        },
        "slug": {
            "type": "uid",
            "targetField": "name",
            "required": True
        },
        "description": {
            "type": "richtext"
        },
        "image": {
            "type": "media",
            "multiple": False,
            "required": False,
            "allowedTypes": ["images"]
        },
        "products": {
            "type": "relation",
            "relation": "oneToMany",
            "target": "api::product.product",
            "mappedBy": "category"
        },
        "forges": {
            "type": "relation",
            "relation": "oneToMany",
            "target": "api::forge.forge",
            "mappedBy": "category"
        }
    }
}

# Schema for Product content type
PRODUCT_SCHEMA = {
    "kind": "collectionType",
    "collectionName": "products",
    "info": {
        "singularName": "product",
        "pluralName": "products",
        "displayName": "Product",
        "description": "3D printed collectibles and products"
    },
    "options": {
        "draftAndPublish": True
    },
    "pluginOptions": {},
    "attributes": {
        "name": {
            "type": "string",
            "required": True
        },
        "slug": {
            "type": "uid",
            "targetField": "name",
            "required": True
        },
        "description": {
            "type": "richtext"
        },
        "price": {
            "type": "decimal",
            "required": True
        },
        "images": {
            "type": "media",
            "multiple": True,
            "required": False,
            "allowedTypes": ["images"]
        },
        "features": {
            "type": "json",
            "required": False
        },
        "inventory": {
            "type": "integer",
            "required": True,
            "default": 0
        },
        "stripeProductId": {
            "type": "string",
            "required": True
        },
        "stripePriceId": {
            "type": "string",
            "required": True
        },
        "category": {
            "type": "relation",
            "relation": "manyToOne",
            "target": "api::category.category",
            "inversedBy": "products"
        },
        "featured": {
            "type": "boolean",
            "default": False
        }
    }
}

# Schema for Step component (used in Forge)
STEP_COMPONENT_SCHEMA = {
    "collectionName": "components_default_steps",
    "info": {
        "displayName": "Step",
        "description": "Individual step in a forge journey"
    },
    "options": {},
    "attributes": {
        "title": {
            "type": "string",
            "required": True
        },
        "description": {
            "type": "richtext"
        },
        "image": {
            "type": "media",
            "multiple": False,
            "required": False,
            "allowedTypes": ["images"]
        }
    }
}

# Schema for Forge content type
FORGE_SCHEMA = {
    "kind": "collectionType",
    "collectionName": "forges",
    "info": {
        "singularName": "forge",
        "pluralName": "forges",
        "displayName": "Forge",
        "description": "3D printing journey and educational content"
    },
    "options": {
        "draftAndPublish": True
    },
    "pluginOptions": {},
    "attributes": {
        "title": {
            "type": "string",
            "required": True
        },
        "slug": {
            "type": "uid",
            "targetField": "title",
            "required": True
        },
        "description": {
            "type": "richtext"
        },
        "difficulty": {
            "type": "enumeration",
            "enum": ["Beginner", "Intermediate", "Advanced"],
            "required": False
        },
        "printCount": {
            "type": "integer"
        },
        "estimatedTime": {
            "type": "string"
        },
        "image": {
            "type": "media",
            "multiple": False,
            "required": False,
            "allowedTypes": ["images"]
        },
        "category": {
            "type": "relation",
            "relation": "manyToOne",
            "target": "api::category.category",
            "inversedBy": "forges"
        },
        "steps": {
            "type": "component",
            "repeatable": True,
            "component": "default.step"
        }
    }
}


def create_output_directory():
    """Create output directory for schema files."""
    output_dir = Path("strapi-schemas")
    output_dir.mkdir(exist_ok=True)
    return output_dir


def write_schema_file(output_dir, name, schema):
    """Write a schema to a JSON file."""
    file_path = output_dir / f"{name}.json"
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(schema, f, indent=2, ensure_ascii=False)
    print_success(f"Generated {file_path}")
    return file_path


def generate_readme(output_dir):
    """Generate instructions for using the schema files."""
    readme_content = """# Strapi Content Type Schemas for GigaForge

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
"""
    readme_path = output_dir / "README.md"
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print_success(f"Generated {readme_path}")


def main():
    """Main execution function."""
    print_header("🚀 GigaForge Strapi Schema Generator")

    print_info("Generating Strapi v5 content type schemas...")
    print_info("This bypasses the locked Content-Type Builder UI in production mode.\n")

    # Create output directory
    output_dir = create_output_directory()
    print_success(f"Created output directory: {output_dir}\n")

    # Generate schema files
    print_header("📝 Generating Schema Files")

    write_schema_file(output_dir, "category", CATEGORY_SCHEMA)
    write_schema_file(output_dir, "product", PRODUCT_SCHEMA)
    write_schema_file(output_dir, "forge", FORGE_SCHEMA)
    write_schema_file(output_dir, "step-component", STEP_COMPONENT_SCHEMA)

    # Generate README with instructions
    print("\n")
    print_header("📖 Generating Installation Instructions")
    generate_readme(output_dir)

    # Final instructions
    print("\n")
    print_header("✅ Schema Generation Complete!")
    print(f"\n{Colors.BOLD}Files created in:{Colors.END} {output_dir.absolute()}\n")
    print(f"{Colors.BOLD}Next Steps:{Colors.END}")
    print(f"  1. Read {output_dir}/README.md for installation methods")
    print(f"  2. Choose fastest method for your setup (Railway upload or GitHub)")
    print(f"  3. Restart Strapi after uploading schemas")
    print(f"  4. Configure public API permissions in Strapi admin")
    print(f"  5. Create sample content (categories, products)")
    print(f"  6. Run /gigaforge:checking-api-health to verify\n")

    print_warning("Note: These schemas are designed for Strapi v5")
    print_info(f"Your Strapi version: 5.18.1 (from Railway logs)\n")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print_error(f"Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
