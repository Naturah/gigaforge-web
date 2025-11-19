# Strapi Content Types

Complete schema documentation for GigaForge Strapi content types.

## Product Content Type

**Collection**: `products`
**API Endpoint**: `/api/products`

### Schema

```typescript
interface Product {
  id: number;
  attributes: {
    name: string;              // Product name
    slug: string;              // URL-friendly identifier
    description: string;       // Rich text description
    price: number;             // Price in USD (decimal: 29.99)
    inventory: number;         // Stock quantity
    stripeProductId: string;   // Stripe product ID (prod_...)
    stripePriceId: string;     // Stripe price ID (price_...)
    featured: boolean;         // Show on homepage
    category: {                // Relation to Category
      data: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        }
      }
    };
    images: {                  // Media files
      data: Array<{
        id: number;
        attributes: {
          name: string;
          url: string;
          formats: {
            thumbnail: { url };
            small: { url };
            medium: { url };
            large: { url };
          }
        }
      }>
    };
    features: Array<string>;   // JSON array of features
    createdAt: string;         // ISO timestamp
    updatedAt: string;         // ISO timestamp
    publishedAt: string;       // ISO timestamp
  }
}
```

### Required Fields

- `name` - Cannot be empty
- `slug` - Must be unique, URL-safe
- `price` - Must be > 0
- `inventory` - Must be >= 0
- `stripeProductId` - Required for checkout
- `stripePriceId` - Required for checkout

### Validation Rules

1. **Price**: Positive decimal (29.99, not 2999)
2. **Inventory**: Non-negative integer
3. **Slug**: Lowercase, hyphens only, unique
4. **Stripe IDs**: Must match `prod_*` and `price_*` patterns

## Category Content Type

**Collection**: `categories`
**API Endpoint**: `/api/categories`

### Schema

```typescript
interface Category {
  id: number;
  attributes: {
    name: string;              // Category name
    slug: string;              // URL-friendly identifier
    description: string;       // Rich text
    image: {                   // Single media file
      data: {
        id: number;
        attributes: {
          name: string;
          url: string;
        }
      }
    };
    products: {                // Relation to Products
      data: Array<{ id: number }>
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
}
```

## Forge Content Type

**Collection**: `forges`
**API Endpoint**: `/api/forges`

### Schema

```typescript
interface Forge {
  id: number;
  attributes: {
    title: string;             // Forge title
    slug: string;              // URL-friendly identifier
    description: string;       // Rich text
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    printCount: number;        // Number of prints
    estimatedTime: string;     // e.g., "2-3 hours"
    image: { data: { ... } };  // Thumbnail
    category: { data: { ... } }; // Relation
    steps: Array<{             // Repeatable component
      title: string;
      description: string;
      image: { data: { ... } };
    }>;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }
}
```

## API Response Format

Strapi returns data in this envelope:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Articulated Dragon",
        "price": 29.99,
        ...
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 4
    }
  }
}
```

## Populating Relations

To include related data, use `populate` parameter:

```bash
GET /api/products?populate=*
GET /api/products?populate[0]=category&populate[1]=images
```

## Filtering

```bash
GET /api/products?filters[featured][$eq]=true
GET /api/products?filters[price][$lte]=30
GET /api/products?filters[inventory][$gt]=0
```

## Common Issues

1. **Empty `data` array**: Products not published in Strapi admin
2. **Missing relations**: Forgot `populate` parameter
3. **Images return null**: Media not uploaded or relation not set
4. **401 Unauthorized**: Public read permission not enabled

## Frontend Transformation

Convert Strapi response to frontend format:

```typescript
function transformProduct(strapiProduct) {
  const attrs = strapiProduct.attributes;

  return {
    id: strapiProduct.id,
    name: attrs.name,
    slug: attrs.slug,
    description: attrs.description,
    price: attrs.price,
    inventory: attrs.inventory,
    stripeProductId: attrs.stripeProductId,
    stripePriceId: attrs.stripePriceId,
    featured: attrs.featured,
    category: {
      id: attrs.category?.data?.id,
      name: attrs.category?.data?.attributes?.name
    },
    images: attrs.images?.data?.map(img => ({
      id: img.id,
      url: `${STRAPI_API_URL}${img.attributes.url}`,
      name: img.attributes.name
    })) || [],
    features: attrs.features || []
  };
}
```
