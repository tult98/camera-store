# API Integration with React Query

This guide covers React Query patterns for data fetching and mutations in the admin dashboard.

## Three Patterns for API Integration

Choose the appropriate pattern based on complexity and reusability:

### Pattern 1: Simple, Single-Use API Calls

**When to use**: The API call is simple and used in only one component.

Call the API directly in the component with inline React Query:

```typescript
// components/brand-list-page.tsx
import { useQuery } from '@tanstack/react-query';
import apiClient from '@modules/shared/api/api-client';

export default function BrandListPage() {
  const {
    data: brands,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await apiClient.get('/brands');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading brands</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Brands</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="card">
            <h3>{brand.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Pros**: Simple, everything in one place
**Cons**: Can't reuse the API call, inline logic clutters component

### Pattern 2: Reusable Query/Mutation Configurations

**When to use**: The same API call is used in multiple components.

Extract the **configuration object** to `apiCalls/[feature].ts`, components still call `useQuery`/`useMutation`:

```typescript
// apiCalls/brand.ts
import apiClient from '@modules/shared/api/api-client';
import type { Brand, CreateBrandRequest, UpdateBrandRequest } from '../types/brand.types';

// Query configurations (for useQuery)
export const fetchBrandsQuery = {
  queryKey: ['brands'],
  queryFn: async () => {
    const response = await apiClient.get<Brand[]>('/brands');
    return response.data;
  },
};

export const fetchBrandByIdQuery = (id: string) => ({
  queryKey: ['brands', id],
  queryFn: async () => {
    const response = await apiClient.get<Brand>(`/brands/${id}`);
    return response.data;
  },
});

// Mutation configurations (for useMutation)
export const createBrandMutation = {
  mutationFn: async (data: CreateBrandRequest) => {
    const response = await apiClient.post<Brand>('/brands', data);
    return response.data;
  },
};

export const updateBrandMutation = {
  mutationFn: async ({ id, data }: { id: string; data: UpdateBrandRequest }) => {
    const response = await apiClient.put<Brand>(`/brands/${id}`, data);
    return response.data;
  },
};

export const deleteBrandMutation = {
  mutationFn: async (id: string) => {
    await apiClient.delete(`/brands/${id}`);
  },
};
```

Use in components:

```typescript
// components/brand-list-page.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBrandsQuery, createBrandMutation, deleteBrandMutation } from '../apiCalls/brand';

export default function BrandListPage() {
  const queryClient = useQueryClient();

  // Use the query configuration
  const { data: brands, isLoading } = useQuery(fetchBrandsQuery);

  // Use the mutation configuration with custom onSuccess
  const deleteBrand = useMutation({
    ...deleteBrandMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  return (
    <div>
      {brands?.map((brand) => (
        <div key={brand.id}>
          <h3>{brand.name}</h3>
          <button onClick={() => deleteBrand.mutate(brand.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

**Pros**: Reusable, clean separation, easy to test
**Cons**: Still need to write query/mutation hooks in components

### Pattern 3: Complex Logic with Custom Hooks

**When to use**: You need to perform complex operations with the API response data or coordinate multiple queries/mutations.

Create a custom hook in `hooks/use-[feature].ts`:

```typescript
// hooks/use-brand-manager.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBrandsQuery, createBrandMutation, updateBrandMutation, deleteBrandMutation } from '../apiCalls/brand';
import { useToast } from '@modules/shared/hooks/use-toast';

export const useBrandManager = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // Fetch all brands
  const { data: brands, isLoading, error: fetchError } = useQuery(fetchBrandsQuery);

  // Complex derived state
  const activeBrands = brands?.filter((b) => b.is_active) ?? [];
  const brandsByCategory = brands?.reduce((acc, brand) => {
    acc[brand.category] = acc[brand.category] || [];
    acc[brand.category].push(brand);
    return acc;
  }, {} as Record<string, Brand[]>);

  // Create brand with side effects
  const createBrand = useMutation({
    ...createBrandMutation,
    onSuccess: (newBrand) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      success('Brand created', `"${newBrand.name}" has been created successfully`);
      // Additional complex logic...
    },
    onError: (err: Error) => {
      error('Failed to create brand', err.message);
    },
  });

  // Update brand with side effects
  const updateBrand = useMutation({
    ...updateBrandMutation,
    onSuccess: (updatedBrand) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brand', updatedBrand.id] });
      success('Brand updated', `"${updatedBrand.name}" has been updated`);
    },
    onError: (err: Error) => {
      error('Failed to update brand', err.message);
    },
  });

  // Delete brand with side effects
  const deleteBrand = useMutation({
    ...deleteBrandMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      success('Brand deleted', 'Brand has been deleted successfully');
    },
    onError: (err: Error) => {
      error('Failed to delete brand', err.message);
    },
  });

  return {
    // Data
    brands,
    activeBrands,
    brandsByCategory,
    isLoading,
    fetchError,

    // Actions
    createBrand: createBrand.mutate,
    updateBrand: updateBrand.mutate,
    deleteBrand: deleteBrand.mutate,

    // Mutation states
    isCreating: createBrand.isPending,
    isUpdating: updateBrand.isPending,
    isDeleting: deleteBrand.isPending,
  };
};
```

Use in components:

```typescript
// components/brand-list-page.tsx
import { useBrandManager } from '../hooks/use-brand-manager';

export default function BrandListPage() {
  const { brands, activeBrands, brandsByCategory, isLoading, deleteBrand, isDeleting } = useBrandManager();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>All Brands ({brands?.length})</h2>
      <h2>Active Brands ({activeBrands.length})</h2>

      {Object.entries(brandsByCategory).map(([category, brands]) => (
        <div key={category}>
          <h3>{category}</h3>
          {brands.map((brand) => (
            <div key={brand.id}>
              <h4>{brand.name}</h4>
              <button onClick={() => deleteBrand(brand.id)} disabled={isDeleting}>
                Delete
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

**Pros**: Clean components, reusable complex logic, easy to test hooks
**Cons**: More files, might be overkill for simple cases

## Query Patterns

### Basic Query

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
});
```

### Query with Parameters

```typescript
const { data: brand } = useQuery({
  queryKey: ['brand', brandId],
  queryFn: () => fetchBrandById(brandId),
  enabled: !!brandId, // Only run if brandId exists
});
```

### Query with Dependent Data

```typescript
// First query
const { data: brand } = useQuery({
  queryKey: ['brand', brandId],
  queryFn: () => fetchBrandById(brandId),
});

// Second query depends on first
const { data: products } = useQuery({
  queryKey: ['products', 'brand', brand?.id],
  queryFn: () => fetchProductsByBrand(brand.id),
  enabled: !!brand, // Only run if brand is loaded
});
```

### Paginated Query

```typescript
const [page, setPage] = useState(1);

const { data, isLoading } = useQuery({
  queryKey: ['brands', page],
  queryFn: () => fetchBrands({ page, limit: 10 }),
  placeholderData: keepPreviousData, // Keep old data while loading new page
});
```

### Query with Polling (Auto-refresh)

```typescript
const { data } = useQuery({
  queryKey: ['jobs', jobId],
  queryFn: () => fetchJobStatus(jobId),
  refetchInterval: 2000, // Refetch every 2 seconds
  refetchIntervalInBackground: false, // Stop when tab is not active
});
```

### Query with Retry Logic

```typescript
const { data } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
  retry: 3, // Retry 3 times on failure
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
});
```

### Query with Cache Configuration

```typescript
const { data } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
  staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  refetchOnWindowFocus: false, // Don't refetch on window focus
  refetchOnReconnect: true, // Refetch on network reconnect
});
```

## Mutation Patterns

### Basic Mutation

```typescript
const mutation = useMutation({
  mutationFn: createBrand,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  },
});

// Use it
mutation.mutate({ name: 'Canon', logo_url: '...' });
```

### Mutation with Optimistic Updates

Update UI immediately before server responds:

```typescript
const updateMutation = useMutation({
  mutationFn: updateBrand,
  // Before the mutation runs
  onMutate: async (newData) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries({ queryKey: ['brands'] });

    // Snapshot current data
    const previousBrands = queryClient.getQueryData(['brands']);

    // Optimistically update the cache
    queryClient.setQueryData(['brands'], (old: Brand[]) => old.map((b) => (b.id === newData.id ? { ...b, ...newData } : b)));

    // Return context for rollback
    return { previousBrands };
  },
  // On error, rollback
  onError: (err, variables, context) => {
    queryClient.setQueryData(['brands'], context?.previousBrands);
  },
  // Always refetch after error or success
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  },
});
```

### Mutation with Loading State

```typescript
const createMutation = useMutation({
  mutationFn: createBrand,
});

// In component
{
  createMutation.isPending && <LoadingIcon />;
}
<button onClick={() => createMutation.mutate(data)} disabled={createMutation.isPending}>
  Create Brand
</button>;
```

### Mutation with Success Callback

```typescript
const createMutation = useMutation({
  mutationFn: createBrand,
  onSuccess: (newBrand, variables, context) => {
    // newBrand: returned data from server
    // variables: data passed to mutate()
    // context: returned from onMutate

    queryClient.invalidateQueries({ queryKey: ['brands'] });
    showToast(`Created ${newBrand.name}`);
    navigate('/brands');
  },
});
```

### Mutation with Error Handling

```typescript
const createMutation = useMutation({
  mutationFn: createBrand,
  onError: (error: Error, variables, context) => {
    // Show error to user
    showToast('Failed to create brand: ' + error.message);

    // Log for debugging
    console.error('Create brand failed:', error);

    // Rollback optimistic update if any
    if (context?.previousBrands) {
      queryClient.setQueryData(['brands'], context.previousBrands);
    }
  },
});
```

### Sequential Mutations

Run mutations one after another:

```typescript
const createBrand = useMutation({ mutationFn: createBrandApi });
const createProduct = useMutation({ mutationFn: createProductApi });

const handleCreateBrandAndProduct = async () => {
  try {
    const brand = await createBrand.mutateAsync({ name: 'Canon' });
    await createProduct.mutateAsync({ name: 'EOS R5', brandId: brand.id });
    showToast('Brand and product created!');
  } catch (error) {
    showToast('Failed to create');
  }
};
```

### Parallel Mutations

Run multiple mutations at once:

```typescript
const deleteBrand = useMutation({ mutationFn: deleteBrandApi });

const handleDeleteMultiple = async (brandIds: string[]) => {
  try {
    await Promise.all(brandIds.map((id) => deleteBrand.mutateAsync(id)));
    queryClient.invalidateQueries({ queryKey: ['brands'] });
    showToast('All brands deleted');
  } catch (error) {
    showToast('Failed to delete some brands');
  }
};
```

## Cache Management

### Invalidate Queries

Mark queries as stale and trigger refetch:

```typescript
// Invalidate all brands queries
queryClient.invalidateQueries({ queryKey: ['brands'] });

// Invalidate specific brand
queryClient.invalidateQueries({ queryKey: ['brand', brandId] });

// Invalidate all queries starting with 'brands'
queryClient.invalidateQueries({ queryKey: ['brands'] });
```

### Update Query Data Manually

```typescript
// Update entire dataset
queryClient.setQueryData(['brands'], newBrands);

// Update specific item in list
queryClient.setQueryData(['brands'], (old: Brand[]) => old.map((b) => (b.id === updatedBrand.id ? updatedBrand : b)));

// Add item to list
queryClient.setQueryData(['brands'], (old: Brand[]) => [...old, newBrand]);

// Remove item from list
queryClient.setQueryData(['brands'], (old: Brand[]) => old.filter((b) => b.id !== deletedId));
```

### Prefetch Data

Load data before it's needed:

```typescript
// Prefetch on hover
const handleMouseEnter = (brandId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['brand', brandId],
    queryFn: () => fetchBrandById(brandId),
  });
};

<div onMouseEnter={() => handleMouseEnter(brand.id)}>{brand.name}</div>;
```

### Get Cached Data

Access cache without triggering a fetch:

```typescript
const cachedBrand = queryClient.getQueryData(['brand', brandId]);

if (cachedBrand) {
  // Use cached data
} else {
  // Fetch new data
}
```

## Error Handling

### Query Error Handling

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
  onError: (error: Error) => {
    console.error('Failed to fetch brands:', error);
    showToast('Failed to load brands');
  },
});

if (isError) {
  return <ErrorMessage error={error} />;
}
```

### Global Error Handling

Set default error handler in QueryClient:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error: Error) => {
        console.error('Query error:', error);
      },
    },
    mutations: {
      onError: (error: Error) => {
        console.error('Mutation error:', error);
        showToast('An error occurred');
      },
    },
  },
});
```

### Axios Error Handling

Handle different error types from axios:

```typescript
import { AxiosError } from 'axios';

const mutation = useMutation({
  mutationFn: createBrand,
  onError: (error: Error) => {
    if (error instanceof AxiosError) {
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.message;

        if (status === 400) {
          showToast('Invalid data: ' + message);
        } else if (status === 401) {
          showToast('Unauthorized. Please log in.');
          navigate('/login');
        } else if (status === 404) {
          showToast('Resource not found');
        } else if (status >= 500) {
          showToast('Server error. Please try again later.');
        }
      } else if (error.request) {
        // Request made but no response
        showToast('Network error. Please check your connection.');
      } else {
        // Error in request setup
        showToast('Request failed: ' + error.message);
      }
    } else {
      // Non-axios error
      showToast('An unexpected error occurred');
    }
  },
});
```

## Loading States

### Query Loading States

```typescript
const { data, isLoading, isFetching, isRefetching } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
});

// isLoading: first time loading (no cached data)
// isFetching: any fetch (including refetch)
// isRefetching: refetch after initial load

if (isLoading) {
  return <FullPageLoader />;
}

return (
  <div>
    {isFetching && <LoadingIcon />}
    {/* Data display */}
  </div>
);
```

### Mutation Loading States

```typescript
const mutation = useMutation({ mutationFn: createBrand });

// mutation.isPending: mutation is running
// mutation.isSuccess: mutation succeeded
// mutation.isError: mutation failed
// mutation.isIdle: mutation hasn't run yet

<button disabled={mutation.isPending}>
  {mutation.isPending && <LoadingIcon />}
  Create Brand
</button>;
```

## Best Practices

### 1. Query Keys

Use descriptive, hierarchical query keys:

```typescript
// Good
['brands'][('brands', brandId)][('brands', brandId, 'products')][('products', { categoryId, search, page })][
  // Bad
  'data'
]['brand-123']['getBrands'];
```

### 2. Type Safety

Always type your queries and mutations:

```typescript
interface Brand {
  id: string;
  name: string;
}

const { data } = useQuery<Brand[]>({
  queryKey: ['brands'],
  queryFn: fetchBrands,
});

const mutation = useMutation<Brand, Error, CreateBrandRequest>({
  mutationFn: createBrand,
});
```

### 3. Separate API Calls from Logic

Keep API calls in `apiCalls/`, logic in components or hooks:

```typescript
// apiCalls/brands.ts - pure API calls
export const fetchBrands = async () => {
  const response = await apiClient.get('/brands');
  return response.data;
};

// components/brand-list-page.tsx - logic
const { data: brands } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
});
```

### 4. Use Optimistic Updates for Better UX

For actions that usually succeed (delete, update), use optimistic updates:

```typescript
const deleteMutation = useMutation({
  mutationFn: deleteBrand,
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ['brands'] });
    const previous = queryClient.getQueryData(['brands']);
    queryClient.setQueryData(['brands'], (old: Brand[]) => old.filter((b) => b.id !== id));
    return { previous };
  },
  onError: (err, id, context) => {
    queryClient.setQueryData(['brands'], context?.previous);
  },
});
```

### 5. Handle Loading and Error States

Always handle loading and error states:

```typescript
const { data, isLoading, error } = useQuery({
  /* ... */
});

if (isLoading) return <Loader />;
if (error) return <ErrorMessage />;
if (!data) return <EmptyState />;

return <DataDisplay data={data} />;
```

### 6. Invalidate Related Queries

After mutations, invalidate all related queries:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['brands'] }); // List
  queryClient.invalidateQueries({ queryKey: ['brand', brandId] }); // Detail
  queryClient.invalidateQueries({ queryKey: ['products'] }); // Related
};
```

### 7. Use Placeholder Data for Smooth UX

For paginated or filtered data:

```typescript
const { data } = useQuery({
  queryKey: ['brands', page],
  queryFn: () => fetchBrands(page),
  placeholderData: keepPreviousData, // Show old data while loading new
});
```

### 8. Don't Overuse Refetching

Configure appropriate refetch behavior:

```typescript
const { data } = useQuery({
  queryKey: ['brands'],
  queryFn: fetchBrands,
  refetchOnWindowFocus: false, // Usually don't need
  refetchOnMount: true, // Usually good to have
  staleTime: 5 * 60 * 1000, // 5 minutes - adjust based on data volatility
});
```

### 9. Use Query Client Methods Wisely

Don't overuse `setQueryData` - prefer invalidation:

```typescript
// Good - let React Query refetch
queryClient.invalidateQueries({ queryKey: ['brands'] });

// Use only when you have the exact new data
queryClient.setQueryData(['brands'], newBrands);
```
