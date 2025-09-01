# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **general camera store** e-commerce platform consisting of:
- **Backend**: Built with **MedusaJS v2** (2.8.8) - a headless e-commerce framework using TypeScript, PostgreSQL with MikroORM, and Jest for testing
- **Frontend**: Built with Next.js 15 and React 19, integrated with Medusa v2, using TypeScript and Tailwind CSS with daisyUI components

## Development Commands

### Backend (MedusaJS) - Nx Commands
**Core Development:**
- `nx serve backend` - Start development server
- `nx run backend:build` - Build the application for production
- `nx run backend:start` - Start production server

**Database Operations:**
- `npx medusa db:generate <module>` - Generate migrations for specific module (run from apps/backend)
- `nx run backend:migrate` - Run database migrations
- `nx run backend:seed` - Seed database with demo data (runs `src/scripts/seed.ts`)
- `nx run backend:reset-database` - **Complete database reset**: drops database, recreates, runs migrations, creates admin user, and seeds demo data with consistent publishable API key (`pk_camera_store_dev_static_key_123456789`)

**Testing:**
- `nx run backend:test` - Run all tests (unit + integration HTTP + integration modules)

**Custom Scripts:**
- `npx medusa exec ./src/scripts/<script-name>.ts` - Execute custom CLI scripts (run from apps/backend)

### Frontend (Next.js)
```bash
# Start development server (uses Turbopack, runs on port 8000)
yarn dev

# Build production application
yarn build

# Start production server (runs on port 8000)
yarn start

# Run ESLint linting
yarn lint

# Analyze bundle size with webpack-bundle-analyzer
yarn analyze
```

## Architecture Overview

### Backend - MedusaJS Framework Structure

**Core Configuration:**
- `medusa-config.ts` - Main Medusa configuration with database, CORS, and JWT settings
- `package.json` - Uses Yarn package manager with Node.js >=20 requirement

**Modular Architecture Directories:**

- **`apps/backend/src/api/`** - Custom REST API routes using file-based routing
  - `store/` - Storefront API endpoints
  - `admin/` - Admin dashboard API endpoints
  - Routes defined in `route.ts` files with HTTP method exports (GET, POST, etc.)

- **`apps/backend/src/admin/`** - Admin dashboard extensions and widgets
  - Custom React components for extending admin interface
  - Widget configuration with zone-based injection

- **`apps/backend/src/modules/`** - Custom business logic modules
  - Self-contained modules with models, services, and configurations
  - Must export module definition with service registration

- **`apps/backend/src/workflows/`** - Business process orchestration
  - Multi-step workflows using createStep and createWorkflow
  - Handles complex business operations with rollback capabilities

- **`apps/backend/src/jobs/`** - Scheduled background tasks
  - Cron-based job execution with configurable schedules
  - Access to Medusa container for service resolution

- **`apps/backend/src/subscribers/`** - Event-driven handlers
  - React to system events (e.g., product.created, order.updated)
  - Asynchronous event processing with container access

- **`apps/backend/src/links/`** - Module data relationships
  - Define associations between different module data models
  - Maintains module isolation while enabling data connections

- **`apps/backend/src/scripts/`** - Custom CLI utilities
  - Executable scripts via `npx medusa exec`
  - Access to Medusa container for administrative tasks

### Frontend - Next.js Technology Stack
- **Framework**: Next.js 15 with App Router and React 19
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS + daisyUI component library
- **Backend**: Medusa v2 e-commerce platform
- **State Management**: React Server Components (RSC) prioritized
- **Payment**: Stripe integration
- **UI Components**: @medusajs/ui + custom daisyUI components

### Frontend Project Structure
```
apps/frontend/src/
├── app/                    # Next.js 15 App Router pages
│   ├── (main)/            # Main storefront layout group
│   │   ├── account/       # User account management
│   │   ├── cart/          # Shopping cart
│   │   ├── categories/    # Product categories
│   │   ├── checkout/      # Checkout process
│   │   ├── collections/   # Product collections
│   │   ├── products/      # Product detail pages
│   │   └── store/         # Product listing/search
├── lib/
│   ├── config.ts          # Medusa SDK configuration
│   ├── data/              # Server-side data fetching functions
│   ├── hooks/             # Custom React hooks
│   └── util/              # Utility functions
├── modules/               # Feature-based component modules
│   ├── account/           # Account management components
│   ├── cart/              # Cart functionality
│   ├── checkout/          # Checkout process
│   ├── common/            # Shared components
│   ├── home/              # Homepage components
│   ├── layout/            # Layout components (nav, footer)
│   ├── products/          # Product-related components
│   └── store/             # Store/catalog components
├── styles/
│   └── globals.css        # Global styles and Tailwind imports
└── types/                 # TypeScript type definitions
```

### Database & Testing

**Database Setup:**
- PostgreSQL with MikroORM as the data layer
- Migration system integrated with Medusa CLI
- Environment-based configuration via DATABASE_URL

**Test Configuration:**
- Jest with SWC transformer for TypeScript
- Three test types: unit, HTTP integration, module integration
- Test environment variables: TEST_TYPE determines test suite
- Setup file: `apps/backend/integration-tests/setup.js`

### Key Technical Details

**Module Resolution:**
- Services resolved via `req.scope.resolve("serviceName")` in API routes
- Container-based dependency injection throughout the application
- Built-in Medusa modules: Use `Modules.PRODUCT`, `Modules.ORDER`, `Modules.CUSTOMER`, etc.
- Custom modules: Use exported constants like `PRODUCT_ATTRIBUTES_MODULE = "productAttributes"`
- Pass `req.scope` container to services that need access to other modules to avoid resolution errors

**Database Querying with Relations & Pricing:**
- Use `query.graph()` for complex queries with relations and calculated data
- For products with pricing: Always pass `QueryContext` with `region_id` and `currency_code`
- Extract pricing context from request headers: `req.headers["region_id"]` and `req.headers["currency_code"]`
- Example pattern for products with calculated prices:
  ```typescript
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const result = await query.graph({
    entity: "product",
    fields: ["*", "variants.*", "variants.calculated_price.*"],
    filters: { categories: { id: categoryId } },
    context: {
      variants: {
        calculated_price: QueryContext({
          region_id: region_id,      // From request headers
          currency_code: currency_code, // From request headers
        }),
      },
    },
  });
  ```
- **Critical**: `calculated_price` will be `null` without proper `region_id` and `currency_code` context
- Always validate that pricing headers are present before querying products for price-sensitive operations

**File-based Routing:**
- API routes created by file structure under `/apps/backend/src/api/`
- Dynamic parameters using `[param]` directory naming
- Middleware support via `middlewares.ts` configuration

**Seeding System:**
- Comprehensive seed script creates demo store with products, categories, regions
- Includes sample Medusa merchandise (t-shirts, sweatshirts, etc.)
- Pre-configured European warehouse, shipping options, and payment providers

## Environment Requirements

### Backend Environment Variables
- Node.js >=20
- PostgreSQL database
- Required environment variables:
  - `DATABASE_URL`
  - `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`
  - `JWT_SECRET`, `COOKIE_SECRET`

### Frontend Environment Variables
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` - Publishable key for Medusa backend authentication
- `MEDUSA_BACKEND_URL` (optional) - Defaults to http://localhost:9000

### Prerequisites
- Medusa backend server running on port 9000
- Node.js with Yarn package manager
- Environment variables configured in `.env.local`

## Key Features

### Frontend Features
- **Server Components First**: Leverages RSC for optimal performance
- **E-commerce Complete**: Cart, checkout, user accounts, order management
- **Multi-theme Support**: Light/dark theme variants with daisyUI
- **Payment Integration**: Stripe payment processing
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **SEO Optimized**: Proper metadata and static generation

## Component Architecture

### Layout System
- `apps/frontend/src/app/layout.tsx` - Root layout with minimal wrapper
- `apps/frontend/src/app/(main)/layout.tsx` - Main storefront layout with navigation/footer
- Uses daisyUI theme system with `data-theme="light"` as default

### Data Fetching Patterns
- **Server Actions**: Located in `apps/frontend/src/lib/data/` for backend integration
- **Medusa SDK**: Configured in `apps/frontend/src/lib/config.ts` with debug mode
- **Caching Strategy**: Leverages Next.js cache with `force-cache` for products
- **Error Handling**: Graceful fallbacks for missing backend data

### Styling Guidelines
- **Primary**: daisyUI components (`btn`, `card`, `navbar`, etc.)
- **Secondary**: Tailwind utilities for custom styling
- **Theme Colors**: Use semantic color classes (`btn-primary`, `text-base-content`)
- **Theme System**: Uses daisyUI's built-in light and dark themes

### Icon System - Heroicons Integration
- **Library**: `@heroicons/react` for consistent SVG icons
- **Usage**: Import icons directly for better tree-shaking
- **Common E-commerce Icons**:
  ```tsx
  import { ShoppingCartIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline'
  import { StarIcon } from '@heroicons/react/24/solid' // For filled variants
  
  // Use with daisyUI classes
  <button className="btn btn-primary">
    <ShoppingCartIcon className="w-5 h-5" />
    Add to Cart
  </button>
  
  // Icon-only buttons
  <button className="btn btn-ghost btn-square">
    <HeartIcon className="w-5 h-5" />
  </button>
  ```
- **Size Guidelines**: Use `w-4 h-4` (sm), `w-5 h-5` (md), `w-6 h-6` (lg), `w-8 h-8` (xl)
- **Theme Integration**: Icons inherit theme colors via semantic classes

## Development Guidelines

### TypeScript Configuration
- **Strict Mode**: Enabled with comprehensive type checking
- **Base URL**: `./src` for clean imports
- **Path Aliases**: 
  - `@lib/*` → `src/lib/*`
  - `@modules/*` → `src/modules/*`
  - `@pages/*` → `src/pages/*`
- **Usage**: `import { sdk } from "@lib/config"`
- **Target**: ES5 with modern DOM/ESNext libs
- **JSX**: Preserve mode for Next.js optimization

### Component Conventions
- **Server Components First**: Default to Server Components (no 'use client' unless needed)
- **Client Components**: Only for interactivity (forms, modals, state management, event handlers)
- **Export Style**: Named exports preferred over default exports
- **Props**: TypeScript interfaces defined inline or in separate types
- **File Naming**: PascalCase for components, kebab-case for utilities
- **Import Order**: External packages → Internal modules → Relative imports

### File Structure Patterns
- **Feature Modules**: `apps/frontend/src/modules/` - organized by business domain
- **Shared Utilities**: `apps/frontend/src/lib/util/` - reusable helper functions
- **Data Layer**: `apps/frontend/src/lib/data/` - server actions and API integration
- **Pages**: `apps/frontend/src/app/` - Next.js App Router with route groups
- **Components**: Each module contains `components/` and `templates/`
- **Hooks**: Custom hooks in `apps/frontend/src/lib/hooks/` or module-specific locations

### Code Style Guidelines
- **No Comments**: DO NOT add code comments unless explicitly requested
- **Error Handling**: Graceful fallbacks with user-friendly messages
- **Security**: Never expose secrets, use environment variables
- **Performance**: Prefer Server Components, minimize client-side JavaScript
- **Accessibility**: Use semantic HTML and ARIA attributes with daisyUI
- **Responsive**: Mobile-first design with Tailwind breakpoints

### Backend Code Quality Standards
- **TypeScript**: Use proper types instead of `any` - create interfaces for complex objects
- **Logging**: Use `container.resolve(ContainerRegistrationKeys.LOGGER)` instead of `console.*`
- **Input Validation**: Validate and sanitize all user inputs (trim, length limits, type checking)
- **Error Handling**: Wrap operations in try-catch with proper error typing
- **Headers**: Extract required headers early and validate presence before processing
- **Pricing Context**: Always pass `region_id` and `currency_code` for price-sensitive operations
- **Container Injection**: Pass container/scope through service method chains for proper DI

## daisyUI Integration

The project uses daisyUI v5.0.50 with built-in themes:

### Theme Usage
```tsx
// Apply theme at layout level
<div data-theme="light">
  {/* Components inherit theme */}
</div>
```

### Component Examples
```tsx
// Buttons with variants
<button className="btn btn-primary">Primary Action</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-outline">Outline</button>
<button className="btn btn-ghost">Ghost</button>

// E-commerce specific buttons
<button className="btn btn-primary btn-sm">Add to Cart</button>
<button className="btn btn-outline btn-square">
  <HeartIcon className="w-4 h-4" />
</button>

// Product cards
<div className="card bg-base-100 shadow-xl">
  <figure>
    <Image src="/product.jpg" alt="Product" width={300} height={300} />
  </figure>
  <div className="card-body">
    <h2 className="card-title">Product Name</h2>
    <p className="text-base-content/70">Description</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>

// Navigation with cart
<div className="navbar bg-base-100">
  <div className="navbar-start">
    <Link href="/" className="btn btn-ghost text-xl">Store</Link>
  </div>
  <div className="navbar-end">
    <button className="btn btn-ghost btn-circle">
      <ShoppingCartIcon className="w-6 h-6" />
    </button>
  </div>
</div>

// Form elements
<div className="form-control w-full max-w-xs">
  <label className="label">
    <span className="label-text">Email</span>
  </label>
  <input 
    type="email" 
    placeholder="Enter email"
    className="input input-bordered w-full max-w-xs" 
  />
</div>

// Loading states
<button className="btn btn-primary loading">Loading</button>
<div className="skeleton h-32 w-full"></div>
```

### Testing daisyUI Components

## Backend Integration

### Medusa Connection
- **Backend URL**: `http://localhost:9000` (configurable via `MEDUSA_BACKEND_URL`)
- **Authentication**: Publishable key via `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- **SDK Configuration**: Located in `apps/frontend/src/lib/config.ts` with debug mode
- **Environment validation**: Automatic startup validation with helpful error messages

### API Patterns & Data Fetching
- **Products**: 
  - Fetched with calculated prices and inventory levels
  - Cached with `force-cache` for performance
  - Located in `apps/frontend/src/lib/data/products.ts`
- **Collections**: 
  - Dynamic category/collection routing
  - SEO-friendly URLs with handle-based navigation
- **Cart**: 
  - Persistent cart state with server actions
  - Real-time updates with optimistic UI
  - Located in `apps/frontend/src/lib/data/cart.ts`
- **Authentication**: 
  - Session-based user management
  - Customer profiles and order history
  - Located in `apps/frontend/src/lib/data/customer.ts`
- **Orders**: 
  - Complete checkout flow with Stripe integration
  - Order confirmation and tracking

## Static Assets

- Backend static files served from `apps/backend/static/` directory
- Frontend images optimized through Next.js Image component
- Example: Camera product images (e.g., `1753805150027-x100vi-bac.webp`)

## Deployment

### GitHub Actions CI/CD Pipeline
- **Location**: `.github/workflows/deploy.yml`
- **Purpose**: Automated deployment to Railway on main branch pushes
- **Strategy**: Nx-powered affected project detection with quality gates

### Deployment Workflow

**1. Setup & Affected Detection:**
- Detects which projects (backend/frontend) are affected by changes
- Uses Nx to analyze changed files and their dependencies
- Outputs affected status for conditional deployment

**2. Quality Checks:**
- Runs ESLint and TypeScript checks on affected projects
- Must pass before deployment proceeds
- Uses `yarn nx affected -t lint` and `yarn nx affected -t type-check`

**3. Backend Deployment:**
- Triggers when backend is affected or manually forced
- Builds backend with `yarn nx build backend`
- Deploys to Railway using `bervProject/railway-deploy@main`
- Uses `RAILWAY_BACKEND_SERVICE_NAME` variable for service targeting

**4. Frontend Deployment:**
- Triggers when frontend is affected
- Builds frontend with `yarn nx build frontend`
- Deploys to Railway using same deployment action
- Uses `RAILWAY_FRONTEND_SERVICE_NAME` variable for service targeting

**5. Deployment Status:**
- Reports deployment results for both services
- Shows affected project status and deployment outcomes

### Required Secrets & Variables

**GitHub Secrets:**
- `RAILWAY_TOKEN` - Railway API token for deployments
- `DATABASE_URL` - PostgreSQL connection string for backend builds
- `MEDUSA_PUBLISHABLE_KEY` - Frontend environment variable

**GitHub Variables:**
- `RAILWAY_BACKEND_SERVICE_NAME` - Railway service name for backend
- `RAILWAY_FRONTEND_SERVICE_NAME` - Railway service name for frontend

### Environment Configuration
- **Environment**: `staging` - GitHub environment for deployment protection
- **Node.js**: Version 20 with Corepack enabled
- **Package Manager**: Yarn with caching optimization
- **Build Strategy**: Nx affected builds to minimize unnecessary deployments

## Testing and Validation

### Environment Validation
- **Automatic Checks**: Startup validation for required environment variables
- **Error Messages**: Clear, actionable error messages with documentation links
- **Graceful Failures**: Process exits with helpful instructions if critical variables missing
- **Debug Mode**: Medusa SDK configured with debug logging in development

### Error Boundaries & Fallbacks
- **Product Listing**: Graceful fallbacks when backend unavailable
- **Connection Issues**: Informative error messages for missing Medusa connection
- **Development Errors**: Detailed error reporting with stack traces
- **User-Friendly**: Production errors show user-friendly messages

## Development Notes

- Implement the code only and let the user manually test it.
- NEVER add code comments unless explicitly requested by the user
- Always follow security best practices and never expose secrets
- Prefer editing existing files over creating new ones
- Use the monorepo structure with separate backend and frontend apps

## Debugging & Troubleshooting

### Common Issues
- **Backend Not Running**: Ensure Medusa backend is running on port 9000
- **Environment Variables**: Check `.env.local` has required Medusa keys
- **Port Conflicts**: Development server uses port 8000, ensure it's available
- **TypeScript Errors**: Run `nx run backend:build` or `nx build frontend` to see full type checking results

### Debug Tools
- **Medusa SDK Debug**: Enable debug mode in `apps/frontend/src/lib/config.ts`
- **Network Tab**: Monitor API calls to Medusa backend
- **React DevTools**: Inspect component state and props
- **Next.js DevTools**: Available in development mode

### Performance Monitoring
- **Bundle Analyzer**: Use `nx run frontend:analyze` to inspect bundle size
- **Server Components**: Verify RSC usage to minimize client JavaScript
- **Image Optimization**: Ensure Next.js Image component is used
- **Caching**: Monitor cache hit rates for product data
- Do not run yarn dev to verify after changes. Let's me verify it myself
- Do not start development servers (nx serve backend, yarn dev) to verify changes - user manages server instances
- Do not commit & push the code until I told you to do it
- do not commit & push changes if I do not told you