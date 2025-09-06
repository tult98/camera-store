# CLAUDE.md

This file provides guidance to Claude Code when working with this camera store e-commerce platform.

## Project Overview
- **Backend**: MedusaJS v2 (2.8.8) - TypeScript, PostgreSQL/MikroORM, Jest
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS + daisyUI

## Quick Commands

### Backend (Nx)
```bash
nx serve backend          # Development server
nx run backend:build      # Production build
nx run backend:migrate    # Run migrations
nx run backend:seed       # Seed demo data
nx run backend:test       # Run tests
# ⚠️ NEVER RUN: nx run backend:reset-database
```

### Frontend
```bash
yarn dev      # Development (port 8000)
yarn build    # Production build
yarn start    # Production server
yarn lint     # ESLint
yarn analyze  # Bundle analyzer
```

## Architecture

### Backend Structure
```
apps/backend/src/
├── api/         # REST endpoints (file-based routing)
├── admin/       # Admin UI extensions (React Query)
├── modules/     # Business logic modules
├── workflows/   # Multi-step processes
├── jobs/        # Scheduled tasks
├── subscribers/ # Event handlers
├── links/       # Module relationships
└── scripts/     # CLI utilities
```

### Frontend Structure
```
apps/frontend/src/
├── app/         # Next.js App Router
├── lib/         # SDK config, data fetching, hooks, utils
├── modules/     # Feature components
├── styles/      # Global CSS
└── types/       # TypeScript definitions
```

## Key Patterns

### Database Queries
```typescript
// Always include pricing context for products
const result = await query.graph({
  entity: "product",
  fields: ["*", "variants.*", "variants.calculated_price.*"],
  filters: { categories: { id: categoryId } },
  context: {
    variants: {
      calculated_price: QueryContext({
        region_id: req.headers["region_id"],
        currency_code: req.headers["currency_code"]
      })
    }
  }
});
```

### Price Handling
- Backend: Store/query in cents
- Frontend: Display in dollars
- Conversion: `cents / 100`

### Module Resolution
- Built-in: `Modules.PRODUCT`, `Modules.ORDER`
- Custom: Export constants like `PRODUCT_ATTRIBUTES_MODULE`
- Always pass `req.scope` for container access

### Component Guidelines
- Default to Server Components
- Use `'use client'` only for interactivity
- daisyUI components for UI consistency
- Heroicons for icons

### Code Quality

#### TypeScript
- No `any` types - create proper interfaces
- Use type guards for runtime checking
- Path aliases: `@lib/*`, `@modules/*`

#### Error Handling
- Standardized patterns across components
- Never expose internal errors to users
- Graceful fallbacks for failures

#### Performance
- Memoize event handlers with `useCallback`
- Debounce high-frequency updates
- Use placeholder data for smooth filtering
- Limit queries to 10K records max

#### Security
- Sanitize all inputs: `replace(/[^a-zA-Z0-9_-]/g, '')`
- Length limits on strings (100 chars)
- Never log raw user input
- Validate before database queries

#### Backend Logging
```typescript
// Use container logger, single argument only
const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
logger.debug(`Found ${count} items: ${JSON.stringify(data)}`);
```

#### Frontend Logging
```typescript
// Avoid console.log/error in production code
// Use structured error boundaries and proper error handling
// For development debugging, use // eslint-disable-next-line
```

## UI/UX Standards

### daisyUI Components
```tsx
// Buttons
<button className="btn btn-primary">Add to Cart</button>

// Icon buttons require aria-label
<button className="btn btn-ghost btn-circle" aria-label="Search">
  <MagnifyingGlassIcon className="w-5 h-5" />
</button>

// Cards
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Title</h2>
  </div>
</div>

// Search input (storefront only)
<input className="input input-primary" placeholder="Search..." />

// Form inputs (no borders in v5)
<input className="input" type="email" />
```

### Design Verification
After frontend changes:
1. Navigate to affected pages
2. Check against `/context/design-principles.md`
3. Take screenshots for evidence
4. Check console for errors

## Specialized Patterns

### Facet Aggregation
- Dual-query architecture: base products + filtered counts
- Cache strategy: 5min products, 1hr configs
- Show all facet values even with 0 count

### Search Implementation
- Title-only search for performance
- 500ms debounce on input
- Sanitize: remove `<>"'&`, limit 100 chars
- Sync with URL parameters

### Category Hierarchies
- Include child categories recursively
- Max 10 levels depth, 1000 categories
- Use `getAllCategoryIds()` utility

### Admin Widgets
```tsx
import { withQueryClientProvider } from "../utils/query-client";
import { useQuery } from "@tanstack/react-query";

const Widget = () => {
  const { data } = useQuery({
    queryKey: ["my-data"],
    queryFn: fetchData
  });
  return <div>{/* content */}</div>;
};

export default withQueryClientProvider(Widget);
```

### Service Layer Architecture
```typescript
// Filter Pipeline Pattern for complex data processing
const pipeline = new FilterPipeline(products)
  .applySearch(search_query)
  .applyPriceFilter(filters.price)
  .applyAttributeFilters(filters)
  .applySorting(order_by)
  .getResults();

// Validation Layer with dedicated validators
const validator = new CategoryProductsValidator(req.query);
const validatedParams = validator.validate();
```

## Environment Variables

### Backend
- `DATABASE_URL`
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`
- `JWT_SECRET`, `COOKIE_SECRET`

### Frontend
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `MEDUSA_BACKEND_URL` (default: http://localhost:9000)

## Deployment (GitHub Actions → Railway)
1. Nx detects affected projects
2. Runs quality checks (lint, type-check)
3. Builds affected projects
4. Deploys to Railway services

Required secrets: `RAILWAY_TOKEN`, `DATABASE_URL`, `MEDUSA_PUBLISHABLE_KEY`

## Important Rules
- NO code comments unless requested
- NO proactive documentation creation
- Prefer editing over creating files
- Never expose secrets or internal errors
- Don't run dev servers for verification
- Don't commit unless explicitly asked
- Use TodoWrite for task planning