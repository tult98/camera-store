# Admin Dashboard API Integration

## Overview

The admin dashboard integrates with the core-api backend using Axios and React Query for type-safe, efficient API communication.

## API Client Configuration

### Axios Instance

Located at `src/modules/shared/api/api-client.ts`:

```typescript
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
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Environment Configuration

```bash
# .env
VITE_CORE_API_URL=http://localhost:3001
```

## React Query Setup

### Query Client

Located at `src/modules/shared/providers/query-client.ts`:

```typescript
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

### Provider Setup

```typescript
// main.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@modules/shared/providers/query-client';

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

## API Contract Consistency

### Matching Backend DTOs

**CRITICAL**: Always ensure frontend types match backend DTOs exactly.

**Backend DTO (core-api)**:
```typescript
// apps/core-api/src/modules/brand/dto/brand-response.dto.ts
export class BrandResponseDto {
  id: string;
  name: string;
  logo_url?: string;
  created_at: Date;
  updated_at: Date;
}
```

**Frontend Type (admin-dashboard)**:
```typescript
// apps/admin-dashboard/src/modules/brands/types/brand.types.ts
export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;  // Note: API returns string, not Date
  updated_at: string;
}
```

### Workflow for API Integration

1. **Consult @core-api-expert** for endpoint specification
2. **Create matching TypeScript interfaces** in `types/`
3. **Implement API calls** in `apiCalls/`
4. **Use React Query** in components
5. **Handle errors** gracefully

## Query Patterns

### Basic Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchBrands } from '../apiCalls/brand';

const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
});
```

### Query with Parameters

```typescript
const { data } = useQuery({
  queryKey: ['brand', brandId],
  queryFn: () => fetchBrandById(brandId),
  enabled: !!brandId,  // Only fetch if brandId exists
});
```

### Dependent Queries

```typescript
// First query
const { data: user } = useQuery({
  queryKey: ['user'],
  queryFn: fetchUser,
});

// Second query depends on first
const { data: settings } = useQuery({
  queryKey: ['settings', user?.id],
  queryFn: () => fetchUserSettings(user!.id),
  enabled: !!user,  // Only fetch when user is loaded
});
```

### Polling Pattern

For background jobs:

```typescript
const { data: jobStatus } = useQuery({
  queryKey: ['job', jobId],
  queryFn: () => getJobStatus(jobId),
  refetchInterval: (data) => {
    // Stop polling if job is completed or failed
    if (data?.state === 'completed' || data?.state === 'failed') {
      return false;
    }
    return 2000;  // Poll every 2 seconds
  },
  enabled: !!jobId,
});
```

### Pagination

```typescript
const [page, setPage] = useState(1);

const { data } = useQuery({
  queryKey: ['brands', page],
  queryFn: () => fetchBrands({ page, limit: 20 }),
  keepPreviousData: true,  // Show old data while fetching new page
});
```

## Mutation Patterns

### Basic Mutation

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBrand } from '../apiCalls/brand';

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: createBrand,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  },
  onError: (error) => {
    console.error('Failed to create brand:', error);
  },
});

// Usage
mutation.mutate({ name: 'Canon', logo_url: '...' });
```

### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateBrand,
  onMutate: async (newBrand) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['brands'] });

    // Snapshot previous value
    const previousBrands = queryClient.getQueryData(['brands']);

    // Optimistically update cache
    queryClient.setQueryData(['brands'], (old: Brand[]) =>
      old.map(b => b.id === newBrand.id ? { ...b, ...newBrand } : b)
    );

    return { previousBrands };
  },
  onError: (err, newBrand, context) => {
    // Rollback on error
    queryClient.setQueryData(['brands'], context?.previousBrands);
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  },
});
```

### Delete Mutation

```typescript
const deleteMutation = useMutation({
  mutationFn: deleteBrand,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  },
});

// Usage with confirmation
const handleDelete = (brandId: string) => {
  if (confirm('Are you sure?')) {
    deleteMutation.mutate(brandId);
  }
};
```

### Multiple Mutations

```typescript
const createMutation = useCreateBrand();
const updateMutation = useUpdateBrand();
const deleteMutation = useDeleteBrand();

const handleSubmit = (data: BrandFormData, editingId?: string) => {
  if (editingId) {
    updateMutation.mutate({ id: editingId, data });
  } else {
    createMutation.mutate(data);
  }
};
```

## Error Handling

### Component-Level Error Handling

```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
  onError: (error) => {
    console.error('Query failed:', error);
  },
});

if (error) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
      Failed to load brands. Please try again.
    </div>
  );
}
```

### Global Error Handling

```typescript
// In query client configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        console.error('Global query error:', error);
        // Show toast notification
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Global mutation error:', error);
        // Show toast notification
      },
    },
  },
});
```

### Axios Error Handling

```typescript
import { AxiosError } from 'axios';

const mutation = useMutation({
  mutationFn: createBrand,
  onError: (error) => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        alert('Invalid data. Please check your input.');
      } else if (error.response?.status === 409) {
        alert('Brand already exists.');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  },
});
```

## Loading States

### Query Loading

```typescript
const { data, isLoading, isFetching } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
});

if (isLoading) {
  return <LoadingSpinner />;  // Initial load
}

return (
  <div>
    {isFetching && <div>Refreshing...</div>}  // Background refetch
    {/* Content */}
  </div>
);
```

### Mutation Loading

```typescript
const mutation = useMutation({ mutationFn: createBrand });

<button
  onClick={() => mutation.mutate(data)}
  disabled={mutation.isPending}
>
  {mutation.isPending ? 'Creating...' : 'Create Brand'}
</button>
```

## Cache Management

### Manual Cache Updates

```typescript
const queryClient = useQueryClient();

// Update cache after mutation
mutation.onSuccess((newBrand) => {
  queryClient.setQueryData(['brands'], (old: Brand[]) => [...old, newBrand]);
});
```

### Cache Invalidation

```typescript
// Invalidate specific query
queryClient.invalidateQueries({ queryKey: ['brands'] });

// Invalidate multiple queries
queryClient.invalidateQueries({ queryKey: ['brands'] });
queryClient.invalidateQueries({ queryKey: ['categories'] });

// Invalidate all queries
queryClient.invalidateQueries();
```

### Prefetching

```typescript
// Prefetch data before navigation
const handleMouseEnter = (brandId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['brand', brandId],
    queryFn: () => fetchBrandById(brandId),
  });
};

<Link
  to={`/brands/${brand.id}`}
  onMouseEnter={() => handleMouseEnter(brand.id)}
>
  {brand.name}
</Link>
```

## Real-Time Updates

### Polling for Job Status

Pattern for background jobs (like product crawling):

```typescript
// apiCalls/crawler.ts
export interface JobStatus {
  id: string;
  state: 'active' | 'completed' | 'failed' | 'waiting';
  progress: number;
  returnvalue?: any;
  failedReason?: string;
}

export const getJobStatus = async (jobId: string): Promise<JobStatus> => {
  const response = await apiClient.get<JobStatus>(`/jobs/${jobId}`);
  return response.data;
};

// components/crawler-status.tsx
const { data: jobStatus } = useQuery({
  queryKey: ['job', jobId],
  queryFn: () => getJobStatus(jobId),
  refetchInterval: (data) => {
    if (!data || data.state === 'completed' || data.state === 'failed') {
      return false;  // Stop polling
    }
    return 2000;  // Poll every 2 seconds
  },
  enabled: !!jobId,
});

{jobStatus?.state === 'active' && (
  <div>
    <p>Processing... {jobStatus.progress}%</p>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${jobStatus.progress}%` }}
      />
    </div>
  </div>
)}

{jobStatus?.state === 'completed' && <p>Completed!</p>}
{jobStatus?.state === 'failed' && <p>Failed: {jobStatus.failedReason}</p>}
```

## TypeScript Best Practices

### Type-Safe API Calls

```typescript
// apiCalls/brand.ts with full type safety
import type { AxiosResponse } from 'axios';
import apiClient from '@modules/shared/api/api-client';
import type { Brand, CreateBrandRequest } from '../types/brand.types';

export const fetchBrands = async (): Promise<Brand[]> => {
  const response: AxiosResponse<Brand[]> = await apiClient.get('/brands');
  return response.data;
};

export const createBrand = async (data: CreateBrandRequest): Promise<Brand> => {
  const response: AxiosResponse<Brand> = await apiClient.post('/brands', data);
  return response.data;
};
```

### Generic API Call Helper

```typescript
// utils/api-helpers.ts
import type { AxiosResponse } from 'axios';
import apiClient from '@modules/shared/api/api-client';

export async function get<T>(url: string): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.get(url);
  return response.data;
}

export async function post<T, D = any>(url: string, data: D): Promise<T> {
  const response: AxiosResponse<T> = await apiClient.post(url, data);
  return response.data;
}

// Usage
export const fetchBrands = () => get<Brand[]>('/brands');
export const createBrand = (data: CreateBrandRequest) =>
  post<Brand, CreateBrandRequest>('/brands', data);
```

## Testing API Integration

### Mocking API Calls

```typescript
// __tests__/brand-list.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import BrandListPage from '../components/brand-list-page';
import * as brandApi from '../apiCalls/brand';

vi.mock('../apiCalls/brand');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

test('displays brands', async () => {
  const mockBrands = [
    { id: '1', name: 'Canon', created_at: '2024-01-01', updated_at: '2024-01-01' },
  ];

  vi.mocked(brandApi.fetchBrands).mockResolvedValue(mockBrands);

  render(<BrandListPage />, { wrapper });

  await waitFor(() => {
    expect(screen.getByText('Canon')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Debouncing Inputs

```typescript
import { useState, useEffect } from 'react';

const [search, setSearch] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 500);

  return () => clearTimeout(timer);
}, [search]);

const { data } = useQuery({
  queryKey: ['brands', debouncedSearch],
  queryFn: () => fetchBrands({ search: debouncedSearch }),
});
```

### Selective Refetching

```typescript
// Only refetch specific queries instead of all
queryClient.invalidateQueries({
  queryKey: ['brands'],
  exact: true,  // Only this exact key, not ['brands', 'xyz']
});
```

## Common Pitfalls

### ❌ Don't: Fetch in useEffect

```typescript
// Bad
const [data, setData] = useState([]);
useEffect(() => {
  fetchBrands().then(setData);
}, []);
```

### ✅ Do: Use React Query

```typescript
// Good
const { data } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
});
```

### ❌ Don't: Store Server State in useState

```typescript
// Bad
const [brands, setBrands] = useState([]);
const loadBrands = async () => {
  const data = await fetchBrands();
  setBrands(data);
};
```

### ✅ Do: Let React Query Manage It

```typescript
// Good
const { data: brands } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
});
```

### ❌ Don't: Forget to Invalidate After Mutation

```typescript
// Bad
const mutation = useMutation({
  mutationFn: createBrand,
  // Missing onSuccess!
});
```

### ✅ Do: Invalidate Queries on Success

```typescript
// Good
const mutation = useMutation({
  mutationFn: createBrand,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  },
});
```

## Summary

- Use **Axios** for HTTP requests
- Use **React Query** for server state management
- **Match TypeScript types** with backend DTOs exactly
- **Consult @core-api-expert** before implementing API integration
- Handle **loading and error states** properly
- **Invalidate queries** after mutations
- Use **polling** for background job status
- **Never** store server state in useState
- Test API integration with mocked responses
