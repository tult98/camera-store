# Camera Store Monorepo

A modern e-commerce platform for cameras built with NX monorepo architecture, featuring a Next.js frontend and MedusaJS backend with shared TypeScript types.

## 🏗️ Architecture Overview

```
camera-store/
├── apps/
│   ├── frontend/          # Next.js 15 storefront (port 8000)
│   └── backend/           # MedusaJS v2 API server (port 9000)
├── libs/
│   ├── shared-types/      # Generated API types from OpenAPI
│   └── api-client/        # Frontend API client utilities
├── tools/
│   └── openapi/           # OpenAPI schema and generation scripts
├── nx.json               # NX workspace configuration
├── tsconfig.base.json    # Base TypeScript configuration
└── package.json          # Workspace dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js >=20
- Yarn package manager
- PostgreSQL database for backend
- Environment variables configured (see below)

### Installation

```bash
# Install dependencies
yarn install

# Generate TypeScript types from OpenAPI schema
yarn generate:types
```

### Development

```bash
# Start both frontend and backend in development mode
yarn dev

# Or start applications individually:
yarn dev:frontend  # Next.js on http://localhost:8000
yarn dev:backend   # MedusaJS on http://localhost:9000
```

### Production

```bash
# Build all applications
yarn build

# Start production servers
yarn start
```

## 🎯 Applications

### Frontend (Next.js 15)

- **Location**: `apps/frontend/`
- **Technology**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + daisyUI
- **Port**: 8000

**Key Features:**
- Server Components first architecture
- E-commerce functionality (cart, checkout, user accounts)
- Product catalog with categories
- Responsive design with custom camera theme
- Integration with shared type system

### Backend (MedusaJS v2)

- **Location**: `apps/backend/`
- **Technology**: MedusaJS v2.8.8 + TypeScript
- **Database**: PostgreSQL + MikroORM
- **Port**: 9000

**Key Features:**
- Headless e-commerce platform
- Custom featured categories API
- File-based routing system
- Admin dashboard extensions
- Comprehensive testing suite

## 📚 Libraries

### Shared Types (`libs/shared-types/`)

Contains TypeScript types generated from OpenAPI specifications, ensuring type safety between frontend and backend.

```typescript
import type { FeaturedCategory, Product } from '@camera-store/shared-types';
```

### API Client (`libs/api-client/`)

Provides a type-safe client for consuming backend APIs in the frontend.

```typescript
import { createNextApiClient } from '@camera-store/api-client';

const apiClient = createNextApiClient();
const categories = await apiClient.getFeaturedCategories();
```

## 🔧 Environment Setup

### Frontend Environment Variables

Create `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_publishable_key_here
MEDUSA_BACKEND_URL=http://localhost:9000
```

### Backend Environment Variables

Create `apps/backend/.env`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/camera_store
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:7001,http://localhost:7000
AUTH_CORS=http://localhost:7001,http://localhost:7000
JWT_SECRET=your_jwt_secret_here
COOKIE_SECRET=your_cookie_secret_here
```

## 🛠️ Available Scripts

### Workspace Level

```bash
# Development
yarn dev                 # Start both apps in parallel
yarn dev:frontend        # Start only frontend
yarn dev:backend         # Start only backend

# Building
yarn build              # Build all applications
yarn build:frontend     # Build only frontend
yarn build:backend      # Build only backend

# Production
yarn start              # Start both apps in production mode
yarn start:frontend     # Start only frontend in production
yarn start:backend      # Start only backend in production

# Testing
yarn test               # Run all tests
yarn test:frontend      # Run frontend tests
yarn test:backend       # Run backend tests (unit + integration)

# Quality Assurance
yarn lint               # Lint all projects
yarn type-check         # TypeScript checking across workspace

# Type Generation
yarn generate:types     # Generate TypeScript types from OpenAPI schema

# Utilities
yarn clean              # Clean NX cache
```

### Backend Specific

```bash
# Database operations (run from apps/backend/)
yarn seed               # Seed database with demo data
yarn reset-database     # Reset database to clean state

# Testing (run from apps/backend/)
yarn test:unit                    # Unit tests only
yarn test:integration:http        # HTTP integration tests
yarn test:integration:modules     # Module integration tests
```

## 🌐 API Documentation

The backend provides both store and admin APIs documented via OpenAPI 3.0 specification.

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

Full API documentation is available in `tools/openapi/schema.json`.

## 🔄 Type Generation Workflow

1. **Update API**: Make changes to backend API routes
2. **Update Schema**: Modify `tools/openapi/schema.json` to reflect changes
3. **Generate Types**: Run `yarn generate:types`
4. **Build Libraries**: Types are automatically built and made available
5. **Use in Frontend**: Import updated types in frontend applications

```bash
# Regenerate types after API changes
yarn generate:types
```

## 🧪 Testing

### Frontend Testing
- Uses Next.js built-in testing with Jest
- Component testing with React Testing Library
- E2E testing capabilities

### Backend Testing
- **Unit Tests**: Test individual services and utilities
- **Integration Tests**: Test HTTP endpoints and module interactions
- **Database Tests**: Test database operations with test database

```bash
# Run all tests
yarn test

# Run tests for specific project
nx test frontend
nx test backend
nx test shared-types
nx test api-client
```

## 📊 Development Workflow

### Adding New API Endpoints

1. **Create Route**: Add new route file in `apps/backend/src/api/`
2. **Update OpenAPI**: Add endpoint definition to `tools/openapi/schema.json`
3. **Generate Types**: Run `yarn generate:types`
4. **Update API Client**: Add client method to `libs/api-client/`
5. **Use in Frontend**: Import and use the new types and client methods

### Adding New Frontend Pages

1. **Create Page**: Add page in `apps/frontend/src/app/`
2. **Use Types**: Import types from `@camera-store/shared-types`
3. **Use API Client**: Import client from `@camera-store/api-client`
4. **Follow Conventions**: Use existing patterns for consistency

## 🚀 Deployment

### Building for Production

```bash
# Build all applications
yarn build

# Or build individually
nx build frontend
nx build backend
```

### Deployment Considerations

- **Frontend**: Can be deployed to Vercel, Netlify, or any static hosting
- **Backend**: Requires Node.js runtime and PostgreSQL database
- **Environment Variables**: Must be configured in production environment
- **Database**: Run migrations before deploying backend

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**: Run `yarn clean` and `yarn install` to clear cache
2. **Type Errors**: Regenerate types with `yarn generate:types`
3. **Port Conflicts**: Check that ports 8000 and 9000 are available
4. **Database Connection**: Verify PostgreSQL is running and DATABASE_URL is correct

### Useful Commands

```bash
# Check project dependencies
nx graph

# List all available tasks
nx list

# Show information about a specific project
nx show project frontend --web

# Run specific target for all projects
nx run-many --target=build --all
```

## 📝 Contributing

1. **Code Style**: Follow existing patterns and conventions
2. **Type Safety**: Always use shared types for API interactions
3. **Testing**: Add tests for new functionality
4. **Documentation**: Update documentation for new features

## 🛡️ Security

- Never commit secrets or API keys
- Use environment variables for configuration
- Follow MedusaJS security best practices
- Keep dependencies updated

## 📄 License

MIT - See LICENSE file for details

---

**Built with ❤️ using NX, Next.js, and MedusaJS**
