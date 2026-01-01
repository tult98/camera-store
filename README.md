# Camera Store - E-commerce Platform

<p align="center">
  <a href="https://www.medusajs.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
      <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>

A modern e-commerce platform for cameras built with **MedusaJS v2**, **Next.js 15**, and **NestJS**, featuring a complete camera store with advanced features and customizations.

## Architecture Overview

```
camera-store/
├── apps/
│   ├── storefront/        # Next.js 15 storefront (port 8000)
│   ├── backend/           # MedusaJS v2 API server (port 9000)
│   ├── core-api/          # NestJS CLI/API tools (port 3001)
│   └── admin-dashboard/   # Customized MedusaJS admin (port 5173)
├── libs/                  # Shared libraries
├── nx.json                # Nx workspace configuration
├── tsconfig.base.json     # Base TypeScript configuration
└── package.json           # Workspace dependencies and scripts
```

## Quick Start

### Prerequisites

- Node.js >= 20
- Yarn v3.2.3
- PostgreSQL database for backend
- Environment variables configured (see below)

### Installation

```bash
# Install dependencies
yarn install
```

### Development

```bash
# Start storefront + backend in development mode
yarn dev

# Or start applications individually:
nx serve storefront        # Next.js on http://localhost:8000
nx serve backend           # MedusaJS on http://localhost:9000
nx serve core-api          # NestJS on http://localhost:3001
nx serve admin-dashboard   # Admin UI on http://localhost:5173
```

### Production

```bash
# Build all applications
yarn build

# Or build individually:
nx build storefront
nx build backend
nx build core-api
nx build admin-dashboard

# Start production servers
yarn start

# Or start individually:
nx start storefront
nx start backend
nx start core-api
```

## Applications

### Storefront (Next.js 15)

**Location**: `apps/storefront/`
**Technology**: Next.js 15 + React 18.3.1 + TypeScript
**Styling**: Tailwind CSS + daisyUI
**Data Fetching**: React Query v5.85.5
**Port**: 8000

**Key Features:**
- Server Components first architecture
- Full e-commerce functionality (cart, checkout, user accounts)
- Product catalog with categories and collections
- Responsive design with custom camera theme
- Stripe payment integration
- SEO optimized with metadata and static generation

### Backend (MedusaJS v2)

**Location**: `apps/backend/`
**Technology**: MedusaJS v2.8.8 + TypeScript
**Database**: PostgreSQL + MikroORM v6.4.3
**Port**: 9000

**Key Features:**
- Headless e-commerce platform
- Custom featured categories API
- File-based routing system
- Admin dashboard extensions
- Comprehensive testing suite (unit + integration)
- Custom modules, workflows, and jobs

### Core API (NestJS)

**Location**: `apps/core-api/`
**Technology**: NestJS v10 + TypeScript
**Database**: PostgreSQL + Prisma
**Queue**: BullMQ
**Port**: 3001

**Key Features:**
- CLI tools for automation
- REST APIs for extended functionality
- BullMQ workers for background jobs
- Bull Board queue UI at http://localhost:3001/queues

### Admin Dashboard

**Location**: `apps/admin-dashboard/`
**Technology**: React + TypeScript + Vite
**Port**: 5173

**Key Features:**
- Customized MedusaJS admin interface
- React Query for data management
- Zod forms for validation
- Integration with Core API

## Environment Setup

### Storefront Environment Variables

Create `apps/storefront/.env.local`:

```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_key_here
```

### Backend Environment Variables

Create `apps/backend/.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/camera_store
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:5173
AUTH_CORS=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
COOKIE_SECRET=your_cookie_secret_here
```

### Core API Environment Variables

Create `apps/core-api/.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/camera_store
REDIS_URL=redis://localhost:6379
```

## Available Scripts

### Workspace Level

```bash
# Development
yarn dev                 # Start storefront + backend in parallel
nx serve storefront      # Start only storefront
nx serve backend         # Start only backend
nx serve core-api        # Start only core-api
nx serve admin-dashboard # Start only admin-dashboard

# Building
yarn build              # Build all applications
nx build storefront     # Build only storefront
nx build backend        # Build only backend
nx build core-api       # Build only core-api
nx build admin-dashboard # Build only admin-dashboard

# Production
yarn start              # Start all apps in production mode
nx start storefront     # Start only storefront in production
nx start backend        # Start only backend in production
nx start core-api       # Start only core-api in production

# Testing
yarn test               # Run all tests
nx test storefront      # Run storefront tests
nx test backend         # Run backend tests (unit + integration)

# Quality Assurance
yarn lint               # Lint all projects
yarn type-check         # TypeScript check all projects
nx lint storefront      # Lint storefront project
nx lint backend         # Lint backend project
nx lint core-api        # Lint core-api project

# Utilities
nx reset                # Clean Nx cache
nx graph                # Visualize project dependencies
```

### Backend Specific Commands

```bash
# Database operations
nx migrate backend                # Run database migrations
npx medusa db:generate <module>   # Generate migrations for module (run from apps/backend/)

# Granular Testing
yarn test:backend:unit                    # Unit tests only
yarn test:backend:integration:http        # HTTP integration tests
yarn test:backend:integration:modules     # Module integration tests
yarn test:backend:all                     # All backend tests

# Custom scripts
npx medusa exec ./src/scripts/<script-name>.ts  # Execute custom CLI scripts (run from apps/backend/)
```

### Core API Specific Commands

```bash
nx serve core-api               # Dev server (port 3001)
nx dev-cli core-api -- <command> # Run CLI command
nx lint core-api                # ESLint
nx type-check core-api          # TypeScript check
```

### Storybook

```bash
nx storybook <project>        # Start Storybook dev server
nx build-storybook <project>  # Build static Storybook
```

## Backend Architecture & Customizations

### API Routes (`apps/backend/src/api/`)

Custom REST API endpoints using file-based routing. Routes are created in `route.ts` files.

**Example**: Create `GET /store/hello-world`:

```ts
// src/api/store/hello-world/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({
    message: "Hello world!",
  });
}
```

**Supported HTTP Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD

**Parameters**: Use `[param]` directory naming for dynamic routes
- `/api/products/[productId]/route.ts` → `/products/:productId`

**Container Access**: Use `req.scope.resolve("serviceName")` to access modules

### Admin Extensions (`apps/backend/src/admin/`)

Extend the Medusa Admin with custom widgets and pages.

**Example Widget**:

```tsx
// src/admin/widgets/product-widget.tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"

const ProductWidget = () => {
  return (
    <div>
      <h2>Product Widget</h2>
    </div>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductWidget
```

### Custom Modules (`apps/backend/src/modules/`)

Create reusable business logic modules with models, services, and configurations.

**Module Structure**:

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

**Example Module**:

```ts
// 1. Create model: src/modules/blog/models/post.ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
})

export default Post

// 2. Create service: src/modules/blog/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import Post from "./models/post"

class BlogModuleService extends MedusaService({
  Post,
}){}

export default BlogModuleService

// 3. Export module: src/modules/blog/index.ts
import BlogModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const BLOG_MODULE = "blog"

export default Module(BLOG_MODULE, {
  service: BlogModuleService,
})
```

### Workflows (`apps/backend/src/workflows/`)

Multi-step business processes with rollback capabilities.

```ts
import {
  createStep,
  createWorkflow,
  WorkflowResponse,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

const step1 = createStep("step-1", async () => {
  return new StepResponse(`Hello from step one!`)
})

const helloWorldWorkflow = createWorkflow(
  "hello-world",
  (input: { name: string }) => {
    const greeting = step1()

    return new WorkflowResponse({
      message: greeting,
    })
  }
)

export default helloWorldWorkflow
```

### Scheduled Jobs (`apps/backend/src/jobs/`)

Background tasks executed at specified intervals.

```ts
import { MedusaContainer } from "@medusajs/framework/types";

export default async function dailyReport(container: MedusaContainer) {
  const productService = container.resolve("product")
  const products = await productService.listAndCountProducts();
  // Process products...
}

export const config = {
  name: "daily-product-report",
  schedule: "0 0 * * *", // Every day at midnight
};
```

### Event Subscribers (`apps/backend/src/subscribers/`)

Handle events emitted in the Medusa application.

```ts
import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"

export default async function productCreateHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const productId = data.id
  const productModuleService = container.resolve("product")
  const product = await productModuleService.retrieveProduct(productId)
  console.log(`The product ${product.title} was created`)
}

export const config: SubscriberConfig = {
  event: "product.created",
}
```

### Module Links (`apps/backend/src/links/`)

Create associations between data models of different modules.

```ts
import BlogModule from "../modules/blog"
import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  BlogModule.linkable.post
)
```

### Custom CLI Scripts (`apps/backend/src/scripts/`)

Custom tooling executable through Medusa's CLI.

```ts
// src/scripts/my-script.ts
import { ExecArgs } from "@medusajs/framework/types"

export default async function myScript({ container, args }: ExecArgs) {
  const productModuleService = container.resolve("product")
  const [, count] = await productModuleService.listAndCountProducts()
  console.log(`You have ${count} product(s)`)
}
```

**Execute with**: `npx medusa exec ./src/scripts/my-script.ts`

## API Documentation

### Featured Categories API

**Public Endpoint:**
```http
GET /store/featured-categories
Headers: x-publishable-api-key: YOUR_PUBLISHABLE_KEY
```

**Admin Endpoints:**
```http
PUT /admin/categories/{id}/featured
GET /admin/categories/{id}/featured
```

## Testing

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

**Integration Test Example**:

```ts
import { medusaIntegrationTestRunner } from "medusa-test-utils"

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Custom endpoints", () => {
      describe("GET /store/custom", () => {
        it("returns correct message", async () => {
          const response = await api.get(`/store/custom`)
          expect(response.status).toEqual(200)
          expect(response.data.message).toEqual("Hello, World!")
        })
      })
    })
  }
})
```

### Storefront Testing

- Jest for unit and integration tests
- React Testing Library for component testing
- E2E testing capabilities

## Storefront Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router and React 18.3.1
- **Language**: TypeScript with strict configuration
- **Styling**: Tailwind CSS + daisyUI component library
- **Data Fetching**: React Query v5.85.5
- **Payment**: Stripe integration
- **UI Components**: @medusajs/ui + custom daisyUI components

### Project Structure

```
apps/storefront/src/
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
│   ├── context/           # React context providers
│   ├── providers/         # React Query and other providers
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

### Storefront Module Structure

```
modules/[module-name]/
├── apiCalls/    # API call functions (client-side)
├── components/  # React components
├── hooks/       # Custom React hooks (optional)
├── store/       # State management (optional)
└── types/       # Shared business logic types only (optional)
```

## Deployment

### Building for Production

```bash
# Build all applications
yarn build

# Or build individually
nx build storefront
nx build backend
nx build core-api
nx build admin-dashboard
```

### Deployment Considerations

- **Storefront**: Deploy to Vercel, Netlify, or any static hosting
- **Backend**: Requires Node.js runtime and PostgreSQL database
- **Core API**: Requires Node.js runtime, PostgreSQL, and Redis
- **Admin Dashboard**: Static files, can be deployed anywhere
- **Environment Variables**: Configure in production environment
- **Database**: Run migrations before deploying backend

## Troubleshooting

### Common Issues

1. **Build Errors**: Run `yarn clean` and `yarn install` to clear cache
2. **Port Conflicts**: Check that ports 8000, 9000, 3001, and 5173 are available
3. **Database Connection**: Verify PostgreSQL is running and DATABASE_URL is correct
4. **Redis Connection**: For Core API, ensure Redis is running

### Useful Commands

```bash
# Check project dependencies
nx graph

# List all available tasks
nx list

# Show information about a specific project
nx show project storefront --web

# Run specific target for all projects
nx run-many --target=build --all

# Run tests for all projects
nx run-many --target=test --all

# Lint all projects
nx run-many --target=lint --all

# TypeScript check all projects
nx run-many --target=type-check --all
```

## Contributing

1. **Code Style**: Follow existing patterns and conventions
2. **Type Safety**: Always use proper TypeScript types
3. **Testing**: Add tests for new functionality
4. **Documentation**: Update documentation for new features

## Security

- Never commit secrets or API keys
- Use environment variables for configuration
- Follow MedusaJS security best practices
- Keep dependencies updated

## License

MIT - See LICENSE file for details

---

**Built with Nx, Next.js 15, MedusaJS v2, and NestJS**

## Resources

### Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

### Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)

### Learn more about NestJS

- [Website](https://nestjs.com/)
- [GitHub](https://github.com/nestjs/nest)
- [Documentation](https://docs.nestjs.com/)

### Community & Support

- [GitHub Discussions](https://github.com/medusajs/medusa/discussions)
- [Discord server](https://discord.com/invite/medusajs)
- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)
