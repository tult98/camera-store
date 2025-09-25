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
├── app/         # Next.js App Router (server-side data fetching only)
├── lib/         # SDK config, data fetching, hooks, utils
├── modules/     # Feature components and business logic
├── styles/      # Global CSS
└── types/       # TypeScript definitions
```

### Module Structure
Each module follows this organization:
```
modules/[module-name]/
├── apiCalls/    # API call functions (client-side)
├── components/  # React components
│   ├── simple-component.tsx           # Simple component (single file)
│   └── complex-component/             # Component with children
│       ├── index.tsx                  # Main component
│       └── child-component.tsx        # Child components
├── hooks/       # Custom React hooks (optional)
├── store/       # State management (optional)
└── types/       # Shared business logic types only (optional)
```

#### Component Architecture Guidelines
- **Component Props**: Keep interface definitions with their components, not in types/
- **Shared Types**: Only put shared business logic types in types/ directory
- **Simple Components**: Single .tsx files for components without children
- **Complex Components**: Use directories only for components with multiple child components
- **Naming**: Use kebab-case for component files and directories

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
- **App Router**: Server components for data fetching, minimal logic
- **Modules**: Client components with React Query for data management
- Use `'use client'` for interactivity and data fetching
- daisyUI components for UI consistency
- Heroicons for icons

### Data Fetching Architecture
- **Server Components** (app/): Server-side data fetching only
- **Client Components** (modules/): React Query for all data operations
- **API Calls**: Located in `modules/[name]/apiCalls/` directory
- **State Management**: React Query cache + local state only
- **NO Server Actions**: Use React Query mutations instead
- **NO mixing**: Server-side fetching only in app/, client-side only in modules/

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

### Client Component Pattern
```tsx
// modules/checkout/components/checkout-form.tsx
"use client"
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCartData, updateCartItem } from "../apiCalls/cart";

const CheckoutForm = () => {
  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCartData
  });
  
  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    }
  });
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{/* content */}</div>;
};
```

### API Calls Pattern
```tsx
// modules/checkout/apiCalls/cart.ts
import { medusaClient } from "@lib/config";

export const fetchCartData = async () => {
  return await medusaClient.store.cart.retrieve();
};

export const updateCartItem = async (data: CartUpdateData) => {
  return await medusaClient.store.cart.lineItems.update(data);
};
```

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
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (default: http://localhost:9000)

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