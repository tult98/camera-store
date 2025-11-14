# Admin Dashboard Architecture

## Overview

The admin dashboard is a React/Vite application providing a custom admin interface for the camera store. It's built independently from the MedusaJS admin and connects to the core-api for additional functionality like product crawling.

## Technology Stack

### Core Framework
- **React 18**: UI library with hooks and concurrent features
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe JavaScript

### Routing & Navigation
- **React Router v6**: Client-side routing with BrowserRouter
- **Base Path**: `/app` (configured in router)
- **Navigation Config**: Centralized at `src/modules/shared/config/navigation-config.ts`

### State Management & Data Fetching
- **React Query v5.85.5** (TanStack Query): Server state management
  - Query caching and automatic refetching
  - Optimistic updates
  - Background synchronization
  - Polling for real-time updates
- **Local State**: useState, useReducer for UI state
- **NO global state**: No Redux, Zustand, or similar

### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework
- **Headless UI v2**: Unstyled, accessible components
- **Heroicons v2**: SVG icon library
- **Custom Components**: Reusable UI at `src/modules/shared/components/`

### API Communication
- **Axios**: HTTP client
- **Configuration**: `src/modules/shared/api/api-client.ts`
- **Target**: Core API at `VITE_CORE_API_URL` (default: http://localhost:3001)

### Build & Development
- **Nx**: Monorepo task runner
- **Port**: 3000 (dev server)
- **HMR**: Hot module replacement enabled
- **Path Aliases**:
  - `@/` → `src/`
  - `@modules/` → `src/modules/`
  - `@app/` → `src/app/`

## Project Structure

```
apps/admin-dashboard/
├── public/                          # Static assets
├── src/
│   ├── app/                         # Application setup
│   │   └── routes/
│   │       └── protected-routes.tsx # Route definitions
│   │
│   ├── modules/                     # Feature modules
│   │   ├── auth/                    # Authentication
│   │   ├── dashboard/               # Main dashboard
│   │   ├── products/                # Product management
│   │   ├── product-crawler/         # Product crawler UI
│   │   ├── brands/                  # Brand management
│   │   ├── categories/              # Category management
│   │   ├── attribute-templates/     # Attribute templates
│   │   ├── settings/                # Settings (banners, regions)
│   │   └── shared/                  # Shared utilities
│   │       ├── api/
│   │       │   └── api-client.ts    # Axios instance
│   │       ├── components/          # Reusable UI components
│   │       ├── config/
│   │       │   └── navigation-config.ts
│   │       ├── providers/           # React Query, Toast providers
│   │       └── utils/               # Helper functions
│   │
│   ├── styles/                      # Global CSS
│   │   └── index.css                # Tailwind directives
│   │
│   └── main.tsx                     # Application entry point
│
├── index.html                       # HTML template
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
└── project.json                     # Nx project configuration
```

## Application Entry Point

### main.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@modules/shared/providers/query-client';
import App from './app/App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/app">
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
```

## Routing Architecture

### Route Definition
Routes are defined in `src/app/routes/protected-routes.tsx`:

```typescript
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '@modules/dashboard/components/dashboard-page';
import ProductsPage from '@modules/products/components/products-page';
import ProductCrawlerPage from '@modules/product-crawler/components/product-crawler-page';

export default function ProtectedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/crawler" element={<ProductCrawlerPage />} />
      {/* ... more routes */}
    </Routes>
  );
}
```

### Navigation Configuration
Sidebar navigation is centralized at `src/modules/shared/config/navigation-config.ts`:

```typescript
import { HomeIcon, CubeIcon, TagIcon } from '@heroicons/react/24/outline';

export const navigationItems = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: CubeIcon },
  { name: 'Product Crawler', href: '/crawler', icon: TagIcon },
  // ... more items
];
```

## React Query Setup

### Query Client Configuration
```typescript
// src/modules/shared/providers/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      cacheTime: 1000 * 60 * 30,      // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
});
```

### Usage Pattern
```typescript
// In components
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBrands, createBrand } from '../apiCalls/brand';

const { data, isLoading, error } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
});

const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: createBrand,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  },
});
```

## API Client Setup

### Axios Configuration
```typescript
// src/modules/shared/api/api-client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_CORE_API_URL || 'http://localhost:3001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Environment Variables

### .env Configuration
```bash
# Core API endpoint
VITE_CORE_API_URL=http://localhost:3001

# MedusaJS backend (if needed)
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
```

### Usage
```typescript
const apiUrl = import.meta.env.VITE_CORE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
```

## Path Aliases

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@modules/*": ["./src/modules/*"],
      "@app/*": ["./src/app/*"]
    }
  }
}
```

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@app': path.resolve(__dirname, './src/app'),
    },
  },
});
```

## Build & Development

### Development Server
```bash
nx serve admin-dashboard
# Runs on http://localhost:3000
```

### Production Build
```bash
nx build admin-dashboard
# Output: apps/admin-dashboard/dist/
```

### Type Checking
```bash
nx type-check admin-dashboard
```

### Linting
```bash
nx lint admin-dashboard
```

## Performance Considerations

### Code Splitting
- React.lazy() for route-based code splitting
- Dynamic imports for heavy components

### React Query Optimization
- Stale time: 5 minutes (reduce unnecessary refetches)
- Cache time: 30 minutes (keep data in memory)
- Selective invalidation (invalidate only what changed)

### Bundle Optimization
- Vite's automatic code splitting
- Tree shaking enabled by default
- Dynamic imports for large libraries

## Security

### Authentication
- Token stored in localStorage (consider httpOnly cookies for production)
- Axios interceptor adds token to requests
- 401 responses trigger logout/redirect

### Input Validation
- Client-side validation for UX (instant feedback)
- Never trust client-side validation alone
- Backend always validates (defense in depth)

### Error Handling
- Never expose internal errors to users
- Generic error messages for security
- Detailed logs for debugging (dev only)

## Integration Points

### Core API (Primary)
- Base URL: `http://localhost:3001`
- Purpose: Product crawling, background jobs, additional features
- Communication: Axios HTTP client

### MedusaJS Backend (Secondary)
- Base URL: `http://localhost:9000`
- Purpose: E-commerce operations (if needed)
- Communication: MedusaJS SDK or direct HTTP

## Key Design Decisions

### Why React Query?
- Eliminates boilerplate for loading/error states
- Built-in caching reduces API calls
- Optimistic updates for better UX
- Background refetching keeps data fresh

### Why No Global State Management?
- React Query handles server state
- Local component state sufficient for UI state
- Reduces complexity and bundle size
- Props and context for rare shared state

### Why Vite?
- Extremely fast dev server (instant HMR)
- Optimized production builds
- Native ESM support
- Better DX than webpack

### Why Separate from MedusaJS Admin?
- Custom branding and UX
- Integration with core-api features
- Independent deployment
- Flexibility in technology choices

## Common Patterns

### Loading States
```typescript
if (isLoading) return <LoadingSpinner />;
```

### Error States
```typescript
if (error) return <ErrorMessage error={error} />;
```

### Empty States
```typescript
if (!data || data.length === 0) return <EmptyState />;
```

### Forms
```typescript
const mutation = useMutation({ mutationFn: createBrand });
const onSubmit = (data) => mutation.mutate(data);
```

### Lists
```typescript
{data?.map(item => <ItemCard key={item.id} item={item} />)}
```

## Development Workflow

1. **Create feature module** at `src/modules/[feature]/`
2. **Define TypeScript types** matching backend DTOs
3. **Implement API calls** in `apiCalls/`
4. **Build UI components** in `components/`
5. **Add route** to `protected-routes.tsx`
6. **Add navigation** to `navigation-config.ts`
7. **Test in browser** at `http://localhost:3000`

## Debugging

### React DevTools
- Inspect component tree
- Check props and state
- Profile performance

### React Query DevTools
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

### Network Tab
- Inspect API requests
- Check request/response payloads
- Monitor loading times

### Console
- Use `console.log` sparingly
- Remove before committing
- Use React DevTools instead when possible
