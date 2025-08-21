# Implementation Guide: Category Page V2

**Version**: 2.0  
**Date**: August 21, 2025  
**Status**: Revised  
**Author**: Gemini

---

## 1. Introduction

This document is a technical companion to `PRD-Category-Page-Redesign-V2.md`. It provides a detailed, step-by-step guide for a junior developer to implement the new category page, reflecting the necessary **custom API strategy**.

**Project Tech Stack:**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, daisyUI
- **State Management**: Zustand (for client-side UI state), React Query (for data fetching & caching)
- **API Client**: The existing `api-client` in `libs/api-client`.

---

## 2. Architecture: Server-Rendered Foundation with Client-Side Data Fetching

To balance SEO, performance, and a dynamic user experience, we will use a hybrid approach.

1.  **Initial Load (SSR/ISR):** The main page component (`app/categories/[handle]/page.tsx`) will be a **Server Component**.
    -   It will fetch the initial, unfiltered list of products and facets using the custom API. This ensures the page is fully rendered on the server for fast initial loads and excellent SEO.
    -   We will use **Incremental Static Regeneration (ISR)** with a revalidation period (e.g., 5 minutes) to keep the data fresh without constant database hits.

2.  **Interactivity & Data Updates (Client Components):**
    -   The core interactive elements—the filter sidebar and the product list display—will be wrapped in a single high-level **Client Component** (e.g., `CategoryPageClient.tsx`). This component will be responsible for all client-side logic.
    -   **Zustand's Role**: Manages the UI state of the filters (what's checked, the price range, etc.). It holds the *state* of the filters, not the data itself.
    -   **React Query's Role**: Manages all data fetching. It will call our custom `POST` API endpoints, handle caching, and provide loading/error states.

3.  **The Update Cycle:**
    -   User clicks a filter (e.g., checks the "Sony" box).
    -   The filter component updates the **Zustand store**.
    -   A `useEffect` hook in `CategoryPageClient.tsx` listens for changes in the Zustand store.
    -   When the store changes, the hook triggers a **refetch** via **React Query**, sending the new filter state in the body of the `POST` request to the `/store/category-products` and `/store/category-facets` endpoints.
    -   React Query receives the new data, and the components re-render with the updated product list and facet counts.
    -   The URL is updated via `router.push` to reflect the new state for bookmarking and sharing.

---

## 3. Core Task Breakdown

### Task 3.1: State and Data Fetching Setup

**1. Setup Zustand Store:**
The store holds the UI state that will be used to build the API request body.

```typescript
// apps/frontend/src/modules/products/store/category-filter-store.ts
import { create } from 'zustand';

// This defines the structure of the 'filters' object in our API request
interface ApiFilters {
  tags?: string[];
  availability?: string[];
  price?: { min?: number; max?: number };
  metadata?: Record<string, string[]>;
}

type CategoryFilterState = {
  filters: ApiFilters;
  sortBy: string;
  page: number;
  // ... other UI state like viewMode

  // Actions
  setFilters: (newFilters: ApiFilters) => void;
  // ... other setters
  // Action to sync URL changes back to the store
  initStateFromUrl: (searchParams: URLSearchParams) => void;
};

// ... Zustand store implementation ...
```

**2. Setup React Query:**
Configure React Query in your `app/layout.tsx` or a provider component. Create hooks for interacting with the new API endpoints.

```typescript
// apps/frontend/src/lib/hooks/useCategoryData.ts
import { useQuery } from '@tanstack/react-query';
import { cameraStoreApi } from '@lib/config'; // Use the specific client for our custom APIs
import { ApiFilters } from '...'; // Import from store

export const useCategoryProducts = (categoryId: string, filters: ApiFilters, page: number, sortBy: string) => {
  return useQuery({
    queryKey: ['categoryProducts', categoryId, filters, page, sortBy],
    queryFn: async () => {
      // The api-client is just a thin wrapper around fetch, 
      // so we can call our custom POST endpoint directly.
      const response = await cameraStoreApi.post('/store/category-products', {
        category_id: categoryId,
        filters,
        page,
        sort_by: sortBy,
      });
      return response.data;
    },
  });
};

export const useCategoryFacets = (categoryId: string, filters: ApiFilters) => {
  return useQuery({
    queryKey: ['categoryFacets', categoryId, filters],
    queryFn: async () => {
      const response = await cameraStoreApi.post('/store/category-facets', {
        category_id: categoryId,
        filters,
      });
      return response.data;
    },
  });
};
```

### Task 3.2: Building the Main Client Component

Create `CategoryPageClient.tsx`. This component will be the orchestrator.

- It receives the initial, server-fetched data as props.
- It uses the Zustand store to manage filter state.
- It uses the React Query hooks (`useCategoryProducts`, `useCategoryFacets`) to fetch new data when the filter state changes.
- It passes the fetched data down to the `FilterSidebar` and `ProductList` components.

### Task 3.3: API Interaction Flow

1.  **Initial Page Load**:
    - `app/categories/[handle]/page.tsx` (Server Component) fetches initial products and facets and passes them to `CategoryPageClient.tsx`.
    - `CategoryPageClient.tsx` initializes the Zustand store and React Query with this server-fetched data.

2.  **User Applies a Filter**:
    - A component (e.g., `CheckboxFilter`) calls an action in the Zustand store (e.g., `setFilters`).
    - The `CategoryPageClient.tsx` component's `useEffect` hook detects the state change.
    - The hook triggers the `refetch` functions from the `useCategoryProducts` and `useCategoryFacets` hooks.
    - React Query makes the `POST` requests with the updated filter body.
    - While fetching, the `isLoading` state from the hooks can be used to show loading skeletons.
    - Once the data is returned, the components re-render with the new information.
    - A separate `useEffect` updates the URL query string to match the store state.

---

## 4. Detailed Implementation Plan

### Phase 1: Backend API (Week 1)
- **Task 1.1**: **Crucial**: Implement the custom Medusa backend routes: `POST /store/category-products` and `POST /store/category-facets`. These must be fully functional before frontend work can be completed.

### Phase 2: Frontend Foundation (Week 2)
- **Task 2.1**: Set up Zustand store and React Query hooks as described above.
- **Task 2.2**: Create the main page component (`page.tsx`) and the orchestrating client component (`CategoryPageClient.tsx`). Implement the initial server-side data fetch.
- **Task 2.3**: Implement the URL synchronization logic within `CategoryPageClient.tsx`.

### Phase 3: Connecting Filters & Display (Week 3)
- **Task 3.1**: Build the `FilterSidebar.tsx` and its children. They should receive facet data as props and use Zustand actions to update the filter state.
- **Task 3.2**: Build the `ProductList.tsx` and its children. They should receive product data as props.
- **Task 3.3**: Wire everything together in `CategoryPageClient.tsx`. Ensure that changing a filter in the sidebar triggers the React Query refetch and updates the product list.

### Phase 4 & 5: Advanced Features & Polish (Weeks 4-5)
- *(Tasks remain largely the same, but are now built on top of the new client-side data fetching architecture.)*
- **Task 4.1**: Implement sorting, view toggle, active filters display.
- **Task 5.1**: Write E2E tests for the client-side filtering flow.
- **Task 5.2**: Implement loading skeletons using React Query's `isLoading` state.
- **Task 5.3**: Final review and polish.
