# Admin Dashboard Architecture

This document details the directory structure, module patterns, and architectural decisions for the admin-dashboard application.

## Directory Structure

```
apps/admin-dashboard/src/
├── app/
│   └── routes/
│       └── protected-routes.tsx          # React Router configuration
├── modules/                               # Feature modules (where you work)
│   ├── [feature]/
│   │   ├── components/                   # React components
│   │   ├── apiCalls/                     # API functions
│   │   ├── types/                        # Shared types (optional)
│   │   └── hooks/                        # Custom hooks (optional)
│   └── shared/
│       ├── api/api-client.ts             # Axios instance
│       ├── components/                   # Reusable UI components
│       ├── config/navigation-config.ts   # Sidebar navigation
│       └── providers/                    # React Query provider
└── main.tsx                               # App entry point
```

## Module Pattern Details

Every feature module follows this consistent structure:

```
modules/[feature-name]/
├── components/          # UI components
│   ├── [feature]-page.tsx              # Main page component
│   ├── [feature]-form.tsx              # Form component
│   └── [feature]-table.tsx             # Data table component
├── apiCalls/           # API client functions
│   └── [feature].ts                     # API calls (CRUD operations)
├── types/              # TypeScript interfaces (optional)
│   └── [feature].types.ts               # Shared business types only
└── hooks/              # Custom React hooks (optional)
    └── use-[feature].ts                 # Feature-specific hooks
```

### Module Naming Conventions

- Use **kebab-case** for directory names: `product-crawler`, `brand-management`
- Use **kebab-case** for file names: `brand-list-page.tsx`, `brand-form.tsx`
- Use **PascalCase** for component names: `BrandListPage`, `BrandForm`
- Use **camelCase** for function names: `fetchBrands`, `createBrand`

### When to Create Each Directory

**components/** - Always required

- Contains all React components for the feature
- Page components, forms, tables, modals, etc.

**apiCalls/** - Required when feature needs API integration

- API call functions and React Query configurations
- Only create when making HTTP requests to core-api

**types/** - Optional, use sparingly

- Only for shared business logic types used across multiple files
- DO NOT put component props here (keep with components)
- Example: DTO types, domain models

**hooks/** - Optional, for complex logic

- Only when you need complex data transformations or side effects
- Simple data fetching should stay in components
- Example: `useBrandManager` for complex brand operations

## Component Organization

### Simple Components (Single File)

For components without children, use a single file:

```
components/
├── brand-badge.tsx
├── status-indicator.tsx
└── loading-spinner.tsx
```

### Complex Components (Directory)

For components with multiple child components:

```
components/
├── brand-list-page/
│   ├── index.tsx              # Main component
│   ├── brand-table.tsx        # Child component
│   ├── brand-filters.tsx      # Child component
│   └── brand-actions.tsx      # Child component
└── brand-form.tsx             # Simple component
```

**Rule**: Only create a directory if the component has child components that are tightly coupled to it.

## API Client Configuration

The Axios client is pre-configured at `src/modules/shared/api/api-client.ts`:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens, etc.
apiClient.interceptors.request.use(/* ... */);

// Response interceptor for error handling
apiClient.interceptors.response.use(/* ... */);

export default apiClient;
```

All API calls should use this client for consistency.

## React Query Provider

The app is wrapped with QueryClientProvider in `src/modules/shared/providers/`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export const Providers = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
```

## Navigation Configuration

Sidebar navigation is configured in `src/modules/shared/config/navigation-config.ts`:

```typescript
import { HomeIcon, TagIcon, CameraIcon } from '@heroicons/react/24/outline';

export const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Brands', href: '/brands', icon: TagIcon },
  { name: 'Products', href: '/products', icon: CameraIcon },
];
```

Add new menu items here when creating features.

## Route Configuration

Routes are defined in `src/app/routes/protected-routes.tsx`:

```typescript
import { Routes, Route } from 'react-router-dom';
import BrandListPage from '@modules/brands/components/brand-list-page';
import BrandFormPage from '@modules/brands/components/brand-form-page';

export const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route path="/brands" element={<BrandListPage />} />
      <Route path="/brands/new" element={<BrandFormPage />} />
      <Route path="/brands/:id/edit" element={<BrandFormPage />} />
    </Routes>
  );
};
```

### Route Patterns

- List view: `/[feature]`
- Create view: `/[feature]/new`
- Edit view: `/[feature]/:id/edit`
- Detail view: `/[feature]/:id` (if needed)

## Shared Components

Reusable UI components are in `src/modules/shared/components/`:

```
shared/components/
├── ui/
│   ├── form-input/
│   │   ├── index.tsx
│   │   ├── form-image-upload.tsx
│   │   └── form-textarea.tsx
│   ├── loading-icon.tsx
│   ├── error-boundary.tsx
│   └── modal.tsx
└── layout/
    ├── navbar.tsx
    ├── sidebar.tsx
    └── layout.tsx
```

### Form Components

Pre-built form components integrate with React Hook Form:

- `FormInput` - Text inputs with validation
- `FormImageUpload` - Image upload with preview
- `FormTextarea` - Textarea with validation
- `FormSelect` - Select dropdowns (if available)

All form components accept:

- `name`: Form field name
- `control`: React Hook Form control object
- `label`: Field label
- `disabled`: Disable state
- `required`: Mark as required

## Type System

### Where to Define Types

**Component Props**: Keep with the component

```typescript
// components/brand-card.tsx
interface BrandCardProps {
  brand: Brand;
  onEdit: (id: string) => void;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand, onEdit }) => {
  // ...
};
```

**Shared Business Types**: Put in types/ directory

```typescript
// types/brand.types.ts
export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
}

export interface CreateBrandRequest {
  name: string;
  logo_url?: string;
}
```

**API Response Types**: Co-locate with API calls

```typescript
// apiCalls/brands.ts
interface BrandsResponse {
  data: Brand[];
  total: number;
}
```

### TypeScript Configuration

The admin-dashboard uses strict TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

Never use `any` - create proper interfaces instead.

## Environment Variables

Admin dashboard uses Vite environment variables:

```bash
# .env
VITE_CORE_API_URL=http://localhost:3001

# Access in code
const apiUrl = import.meta.env.VITE_CORE_API_URL;
```

All environment variables must be prefixed with `VITE_` to be exposed to the client.

## Build Configuration

The app uses Vite with Nx executors:

```json
{
  "targets": {
    "serve": {
      "executor": "@nx/vite:dev-server",
      "options": {
        "port": 3000
      }
    },
    "build": {
      "executor": "@nx/vite:build"
    }
  }
}
```

### React Query Optimization

- Set appropriate `staleTime` for different data types
- Use `placeholderData` for smooth transitions
- Enable `keepPreviousData` for paginated queries

```typescript
const { data } = useQuery({
  queryKey: ['brands', page],
  queryFn: () => fetchBrands(page),
  staleTime: 5 * 60 * 1000, // 5 minutes
  placeholderData: keepPreviousData,
});
```
