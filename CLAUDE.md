# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an **Nx monorepo** for a camera store e-commerce platform.

### Technology Stack
- **Monorepo**: Nx v21.3.11, Yarn v3.2.3, Node.js >= 20
- **Backend**: MedusaJS v2 (2.8.8) - TypeScript, PostgreSQL/MikroORM v6.4.3, Jest
- **Storefront**: Next.js 15, React 18.3.1, TypeScript, Tailwind CSS + daisyUI, React Query v5.85.5
- **Core API**: NestJS v10 - CLI tools, REST APIs, BullMQ workers (port 3001)

### Monorepo Structure
```
camera-store/
├── apps/
│   ├── backend/            # MedusaJS v2 backend (port 9000)
│   ├── storefront/         # Next.js 15 storefront (port 8000)
│   ├── core-api/           # NestJS CLI/API tools (port 3001)
│   └── admin-dashboard/    # Customized MedusaJS admin (port 5173)
└── nx.json                 # Nx workspace configuration
```

## Quick Commands

### Root Level (Parallel Execution)
```bash
yarn dev              # Start storefront + backend in dev mode
yarn build            # Build all projects (⚠️ avoid during active development)
yarn start            # Start all projects in production
yarn test             # Run all tests
yarn lint             # Lint all projects
yarn type-check       # TypeScript check all projects
```

### Backend (MedusaJS)
```bash
nx serve backend          # Development server (port 9000)
nx build backend          # Production build
nx start backend          # Production server
nx migrate backend        # Run database migrations
nx test backend           # All tests

# Granular Testing
yarn test:backend:unit                    # Unit tests only
yarn test:backend:integration:http        # HTTP integration tests
yarn test:backend:integration:modules     # Module integration tests
yarn test:backend:all                     # All backend tests
```

### Storefront (Next.js)
```bash
nx serve storefront     # Dev server (port 8000)
nx build storefront     # Production build
nx start storefront     # Production server
nx lint storefront      # ESLint
nx test storefront      # Jest tests
nx analyze storefront   # Bundle analyzer
```

### Core API (NestJS)
```bash
nx serve core-api     # Dev server (port 3001)
nx build core-api     # Production build
nx start core-api     # Production server
nx dev-cli core-api -- <command>  # Run CLI command
nx lint core-api      # ESLint
nx type-check core-api  # TypeScript check
# Bull Board queue UI: http://localhost:3001/queues
```

### Admin Dashboard
```bash
nx serve admin-dashboard   # Dev server
nx build admin-dashboard   # Production build
```

### Storybook
```bash
nx storybook <project>        # Start Storybook dev server
nx build-storybook <project>  # Build static Storybook
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

### Backend Module Structure
Each backend module follows this pattern:
```
modules/[module-name]/
├── models/           # Data models (MikroORM entities)
├── service.ts        # Service layer (extends MedusaService)
├── migrations/       # Database migrations
├── constants/        # Module constants (e.g., MODULE_ID)
├── types/            # TypeScript definitions
├── utils/            # Utility functions
└── index.ts          # Module export
```

### Storefront Structure
```
apps/storefront/src/
├── app/         # Next.js App Router (server-side data fetching only)
├── lib/         # Shared utilities and configuration
│   ├── data/        # Server-side data fetching functions
│   ├── hooks/       # Custom React hooks
│   ├── util/        # Utility functions
│   ├── context/     # React context providers
│   └── providers/   # React Query and other providers
├── modules/     # Feature components and business logic
├── styles/      # Global CSS and Tailwind config
└── types/       # TypeScript definitions
```

## MedusaJS Reference Documentation

For MedusaJS v2 patterns and best practices, always consult these files before implementing backend features:
- `.claude/context/medusa/api-routes.md` - API route patterns, error handling, validation
- `.claude/context/medusa/workflows.md` - Workflow patterns and best practices
- `.claude/context/medusa/modules.md` - Custom module development
- `.claude/context/medusa/database-patterns.md` - Database queries and patterns
- `.claude/context/medusa/admin-extensions.md` - Admin UI extensions
- `.claude/context/medusa/data-models.md` - Data model definitions
- `.claude/context/medusa/module-links.md` - Module relationship patterns
- `.claude/context/medusa/troubleshooting.md` - Common issues and solutions

These contain project-specific patterns and official MedusaJS v2 approaches.

### Other Reference Documentation
- `.claude/skills/core-api-helper/` - NestJS patterns (endpoints, BullMQ workers, Prisma database)
- `.claude/skills/admin-dashboard-helper/` - Admin dashboard patterns (React Query, Zod forms, core-api integration)

### Storefront Module Structure
Each storefront module follows this organization:
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
- Storefront: Display in dollars
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
- **Path Aliases**:
  - `@lib/*` - Storefront utilities and config (storefront only)
  - `@modules/*` - Storefront feature modules (storefront only)

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

#### Storefront Logging
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
After storefront changes:
1. Navigate to affected pages
2. Take screenshots for evidence
3. Check console for errors

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

## Testing Architecture

### Backend Testing
Tests are controlled by the `TEST_TYPE` environment variable:

```bash
TEST_TYPE=unit                 # Run unit tests
TEST_TYPE=integration:http     # Run HTTP integration tests
TEST_TYPE=integration:modules  # Run module integration tests
```

**Test File Patterns:**
- Unit: `**/__tests__/**/*.unit.spec.[jt]s`
- HTTP Integration: `**/integration-tests/http/*.spec.[jt]s`
- Module Integration: `**/src/modules/*/__tests__/**/*.[jt]s`

**Test Setup:** `integration-tests/setup.js` with Medusa test utilities

## Environment Variables

### Backend
- `DATABASE_URL` (required)
- `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`
- `JWT_SECRET`, `COOKIE_SECRET`
- `TEST_TYPE` (unit | integration:http | integration:modules)

### Storefront
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` (required)
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (default: http://localhost:9000)

## Important Rules
- NO code comments unless requested
- NO proactive documentation creation
- Prefer editing over creating files
- Never expose secrets or internal errors
- Don't run dev servers for verification
- Don't commit unless explicitly asked
- Use TodoWrite for task planning
- **Build Warning**: Avoid running `yarn build` or project-specific build commands during active development as they may interfere with the dev server. Only build when deploying or when explicitly requested.