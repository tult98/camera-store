---
name: admin-dashboard-helper
description: Expert guidance for the admin-dashboard application at apps/admin-dashboard/. Use when working with files in apps/admin-dashboard, building admin dashboard features, or asking about admin dashboard architecture and patterns. Specializes in React Query, Zod forms, and core-api integration within the admin dashboard context.
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Admin Dashboard Helper

Expert guidance for building features in the **admin-dashboard** application at `apps/admin-dashboard/`.

## Technology Stack

- **Framework**: React 18 + Vite (TypeScript)
- **Routing**: React Router v6 (BrowserRouter with `/app` base)
- **State & Data Fetching**: React Query (TanStack Query v5.85.5)
- **Styling**: Tailwind CSS v4 + Headless UI v2
- **Icons**: Heroicons v2
- **API Client**: Axios (configured at `src/modules/shared/api/api-client.ts`)
- **Build Tool**: Vite with Nx executors
- **Dev Server**: Port 3000

## Module Pattern

Every feature follows this structure:

```
modules/[feature-name]/
├── components/          # UI components
│   ├── [feature]-page.tsx
│   ├── [feature]-form.tsx
│   └── [feature]-table.tsx
├── apiCalls/           # API client functions
│   └── [feature].ts
├── types/              # TypeScript interfaces (optional)
│   └── [feature].types.ts
└── hooks/              # Custom React hooks (optional)
    └── use-[feature].ts
```

## Feature Development Workflow

### 1. Define TypeScript Types

Create `types/[feature].types.ts` matching backend DTOs:

```typescript
export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBrandRequest {
  name: string;
  logo_url?: string;
}
```

### 2. Implement API Calls

Choose the appropriate pattern based on complexity:

**Pattern 1: Simple, Single-Use**
Call API directly in component with inline React Query.

**Pattern 2: Reusable Configurations**
Extract query/mutation configs to `apiCalls/[feature].ts`:

```typescript
// apiCalls/brand.ts
import apiClient from '@modules/shared/api/api-client';

export const fetchBrandsQuery = {
  queryKey: ['brands'],
  queryFn: async () => {
    const response = await apiClient.get('/brands');
    return response.data;
  },
};

export const createBrandMutation = {
  mutationFn: async (data: CreateBrandRequest) => {
    const response = await apiClient.post('/brands', data);
    return response.data;
  },
};
```

**Pattern 3: Complex Logic**
Create custom hooks in `hooks/use-[feature].ts` for complex operations.

See [api-integration.md](api-integration.md) for complete React Query patterns.

### 3. Build UI Components

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchBrandsQuery } from '../apiCalls/brand';

export default function BrandListPage() {
  const { data: brands, isLoading, error } = useQuery(fetchBrandsQuery);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading brands</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Brands</h1>
      {/* UI implementation */}
    </div>
  );
}
```

### 4. Build Forms

Forms use React Hook Form + Zod validation + React Query mutations.

**Key Pattern**:

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required').max(255),
  image_url: z.string().url().or(z.literal('')),
});

export const BrandForm = ({ initialData, isEditMode, brandId }) => {
  const { control, handleSubmit, reset, trigger } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: initialData || { name: '', image_url: '' },
  });

  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: (newBrand) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      success('Brand created', `"${newBrand.name}" has been created`);
      reset();
      navigate('/brands');
    },
    onError: (err) => {
      error('Failed to create brand', err.message);
    },
  });

  const handleFormSubmit = async (data) => {
    const isValid = await trigger();
    if (isValid) {
      isEditMode ? updateMutation.mutate(data) : createMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormInput name="name" control={control} label="Name" required />
      <FormImageUpload name="image_url" control={control} label="Logo" />

      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending && <LoadingIcon className="mr-2" />}
        {isEditMode ? 'Update Brand' : 'Create Brand'}
      </button>
    </form>
  );
};
```

See [form-patterns.md](form-patterns.md) for complete form examples and best practices.

### 5. Add Navigation & Routes

Update navigation config:
```typescript
// src/modules/shared/config/navigation-config.ts
{ name: 'Brands', href: '/brands', icon: TagIcon }
```

Update routes:
```typescript
// src/app/routes/protected-routes.tsx
<Route path="/brands" element={<BrandListPage />} />
```

## API Integration Best Practices

1. **Type Safety**: Always define interfaces matching backend DTOs
2. **Error Handling**: Handle errors in `onError` callbacks
3. **Cache Invalidation**: Invalidate queries after mutations
4. **Loading States**: Use `isLoading`, `isPending` for UI feedback
5. **Optimistic Updates**: Use `onMutate` for instant UI updates

```typescript
const updateMutation = useMutation({
  mutationFn: updateBrand,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ['brands'] });
    const previousData = queryClient.getQueryData(['brands']);
    queryClient.setQueryData(['brands'], (old) =>
      old.map(b => b.id === newData.id ? { ...b, ...newData } : b)
    );
    return { previousData };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['brands'], context?.previousData);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  },
});
```

## Form Best Practices

1. Always use Zod schemas for validation
2. Separate mutations for create and update operations
3. Invalidate queries after successful mutations
4. Show loading indicators during submission
5. Disable all inputs during submission
6. Keep button text consistent (don't change to "Creating...")
7. Reset form after successful creation (not after update)
8. Navigate away after successful submission
9. Use toast notifications for feedback
10. Use custom form components from `shared/components/ui`

## Common Patterns

### Loading States
```typescript
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    </div>
  );
}
```

### Empty States
```typescript
if (!data || data.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">No items found</p>
      <button className="mt-4 btn-primary">Add New</button>
    </div>
  );
}
```

## Environment Configuration

```typescript
// .env
VITE_CORE_API_URL=http://localhost:3001  // default
```

Axios client is pre-configured at `src/modules/shared/api/api-client.ts`.

## Development Commands

```bash
# From repository root
nx serve admin-dashboard        # Start dev server (port 3000)
nx build admin-dashboard        # Production build
nx lint admin-dashboard         # Run ESLint
nx type-check admin-dashboard   # TypeScript check
```

## Supporting Documentation

- [architecture.md](architecture.md) - Detailed directory structure and module patterns
- [form-patterns.md](form-patterns.md) - Complete form examples with Zod and React Hook Form
- [api-integration.md](api-integration.md) - React Query patterns and data fetching strategies

## Key Reminders

- Always use TypeScript, never `any` types
- Use React Query for all data fetching and mutations
- Follow the established module pattern
- Keep components focused and composable
- Handle loading and error states properly
- Test changes in the browser (port 3000)
