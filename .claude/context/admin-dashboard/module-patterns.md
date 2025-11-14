# Admin Dashboard Module Patterns

## Module Structure

Every feature in the admin dashboard follows a consistent module pattern for maintainability and scalability.

### Standard Module Layout

```
modules/[feature-name]/
├── components/          # React components
│   ├── [feature]-page.tsx              # Main page component
│   ├── [feature]-list.tsx              # List/table view
│   ├── [feature]-form.tsx              # Create/edit form
│   ├── [feature]-card.tsx              # Individual item card
│   └── [feature]-modal.tsx             # Modal dialogs
├── apiCalls/           # API client functions
│   └── [feature].ts                     # API calls (CRUD)
├── types/              # TypeScript definitions (optional)
│   └── [feature].types.ts               # Shared types
└── hooks/              # Custom React hooks (optional)
    └── use-[feature].ts                 # Feature-specific hooks
```

### Example: Brand Management Module

```
modules/brands/
├── components/
│   ├── brand-list-page.tsx
│   ├── brand-form-modal.tsx
│   └── brand-card.tsx
├── apiCalls/
│   └── brand.ts
├── types/
│   └── brand.types.ts
└── hooks/
    └── use-brands.ts
```

## TypeScript Types Pattern

### Location
- `types/[feature].types.ts` - Only for shared business logic types
- Component props - Keep with the component (not in types/)

### Naming Conventions
```typescript
// types/brand.types.ts

// Entity type (matches backend response)
export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

// Request types (matches backend DTOs)
export interface CreateBrandRequest {
  name: string;
  logo_url?: string;
}

export interface UpdateBrandRequest {
  name?: string;
  logo_url?: string;
}

// UI-specific types (if needed)
export interface BrandFormData {
  name: string;
  logoFile?: File;
}
```

### Best Practices
- Match backend DTO property names exactly
- Use optional `?` for nullable fields
- Use `string` for dates from API (convert to Date in components if needed)
- Avoid `any` - create proper interfaces

## API Calls Pattern

### Location
`apiCalls/[feature].ts`

### Structure
```typescript
// apiCalls/brand.ts
import apiClient from '@modules/shared/api/api-client';
import type { Brand, CreateBrandRequest, UpdateBrandRequest } from '../types/brand.types';

// GET all
export const fetchBrands = async (): Promise<Brand[]> => {
  const response = await apiClient.get<Brand[]>('/brands');
  return response.data;
};

// GET by ID
export const fetchBrandById = async (id: string): Promise<Brand> => {
  const response = await apiClient.get<Brand>(`/brands/${id}`);
  return response.data;
};

// POST create
export const createBrand = async (data: CreateBrandRequest): Promise<Brand> => {
  const response = await apiClient.post<Brand>('/brands', data);
  return response.data;
};

// PUT update
export const updateBrand = async (
  id: string,
  data: UpdateBrandRequest
): Promise<Brand> => {
  const response = await apiClient.put<Brand>(`/brands/${id}`, data);
  return response.data;
};

// DELETE
export const deleteBrand = async (id: string): Promise<void> => {
  await apiClient.delete(`/brands/${id}`);
};
```

### Best Practices
- Export named functions (not default export)
- Use async/await (not .then())
- Type the response with TypeScript generics
- Return `response.data` directly
- Handle errors at the component level with React Query

## Component Patterns

### Page Component

Main container component for a feature:

```typescript
// components/brand-list-page.tsx
'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import { fetchBrands } from '../apiCalls/brand';
import BrandCard from './brand-card';
import BrandFormModal from './brand-form-modal';

export default function BrandListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: brands, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading brands. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Brands</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          <PlusIcon className="w-5 h-5" />
          Add Brand
        </button>
      </div>

      {brands && brands.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No brands found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands?.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}

      <BrandFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

### Form Component

Create/Edit form with validation and mutation:

```typescript
// components/brand-form-modal.tsx
'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createBrand } from '../apiCalls/brand';
import type { CreateBrandRequest } from '../types/brand.types';

interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrandFormModal({ isOpen, onClose }: BrandFormModalProps) {
  const [formData, setFormData] = useState<CreateBrandRequest>({
    name: '',
    logo_url: '',
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      onClose();
      setFormData({ name: '', logo_url: '' });
    },
    onError: (error) => {
      console.error('Failed to create brand:', error);
      alert('Failed to create brand. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">
              Add New Brand
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Brand Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Logo URL (optional)
              </label>
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) =>
                  setFormData({ ...formData, logo_url: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {mutation.isPending ? 'Creating...' : 'Create Brand'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
```

### Card Component

Display individual item with actions:

```typescript
// components/brand-card.tsx
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { deleteBrand } from '../apiCalls/brand';
import type { Brand } from '../types/brand.types';

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });

  const handleDelete = () => {
    if (confirm(`Delete brand "${brand.name}"?`)) {
      deleteMutation.mutate(brand.id);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow">
      {brand.logo_url && (
        <img
          src={brand.logo_url}
          alt={brand.name}
          className="w-full h-32 object-contain mb-4"
        />
      )}

      <h3 className="text-lg font-semibold mb-2">{brand.name}</h3>

      <div className="flex justify-end gap-2">
        <button
          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          aria-label="Edit brand"
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
          aria-label="Delete brand"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

## Custom Hooks Pattern

### Purpose
Extract reusable React Query logic and complex state management.

### Example: Custom Hook for Brands

```typescript
// hooks/use-brands.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBrands, createBrand, updateBrand, deleteBrand } from '../apiCalls/brand';
import type { CreateBrandRequest, UpdateBrandRequest } from '../types/brand.types';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandRequest }) =>
      updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
}
```

### Usage in Components

```typescript
// Simplified component using hooks
import { useBrands, useCreateBrand, useDeleteBrand } from '../hooks/use-brands';

export default function BrandListPage() {
  const { data: brands, isLoading, error } = useBrands();
  const createMutation = useCreateBrand();
  const deleteMutation = useDeleteBrand();

  // Component logic...
}
```

## Shared Components

### Location
`modules/shared/components/`

### Examples

#### Loading Spinner
```typescript
// modules/shared/components/loading-spinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
    </div>
  );
}
```

#### Error Message
```typescript
// modules/shared/components/error-message.tsx
interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
      {message || 'An error occurred. Please try again.'}
    </div>
  );
}
```

#### Empty State
```typescript
// modules/shared/components/empty-state.tsx
import { PlusIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          <PlusIcon className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
```

## Module Checklist

When creating a new feature module:

- [ ] Create directory at `modules/[feature-name]/`
- [ ] Define TypeScript types in `types/[feature].types.ts` (matching backend DTOs)
- [ ] Implement API calls in `apiCalls/[feature].ts`
- [ ] Create page component in `components/[feature]-page.tsx`
- [ ] Create additional components (form, card, modal, etc.)
- [ ] Consider custom hooks if logic is complex or reusable
- [ ] Add route to `app/routes/protected-routes.tsx`
- [ ] Add navigation item to `modules/shared/config/navigation-config.ts`
- [ ] Test in browser at `http://localhost:3000/[feature-path]`

## Common Patterns Summary

### Query Pattern
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFunction,
});
```

### Mutation Pattern
```typescript
const mutation = useMutation({
  mutationFn: mutateFunction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['key'] });
  },
});
```

### Form State Pattern
```typescript
const [formData, setFormData] = useState<FormType>(initialState);
const handleChange = (field: keyof FormType, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### Modal Pattern
```typescript
const [isOpen, setIsOpen] = useState(false);
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
```

### Conditional Rendering
```typescript
{isLoading && <LoadingSpinner />}
{error && <ErrorMessage />}
{!data?.length && <EmptyState />}
{data?.map(item => <ItemCard key={item.id} item={item} />)}
```
