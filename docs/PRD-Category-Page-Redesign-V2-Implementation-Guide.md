# Implementation Guide: Category Page V2

**Version**: 1.1  
**Date**: August 21, 2025  
**Status**: Revised  
**Author**: Gemini

---

## 1. Introduction

This document is a technical companion to `PRD-Category-Page-Redesign-V2.md`. It provides a detailed, step-by-step guide for a junior developer to implement the new category page.

**Project Tech Stack:**
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, daisyUI
- **State Management**: Zustand (for client-side UI state)
- **API Client**: The existing `api-client` in `libs/api-client`.

---

## 2. Architecture: Hybrid Rendering for Performance & SEO

To achieve the best results for both users and search engines, we will use a **hybrid rendering model**. This is not a pure Client-Side Rendered (CSR) application.

1.  **Initial Load (SSR/ISR):** The main page component (`app/categories/[handle]/page.tsx`) will be a **Server Component**.
    -   For the initial visit, the server will render the full page HTML. This is great for SEO and fast initial load times.
    -   We should use **Incremental Static Regeneration (ISR)** by setting a `revalidate` time. This means the page is served statically from a CDN for speed and regenerated in the background periodically.
    -   **Example:** `export const revalidate = 300; // Re-generate the page every 5 minutes`

2.  **Interactivity (Client Components):** Components that require user interaction (like the filter sidebar) will be **Client Components** (marked with `'use client'`).
    -   These components are hydrated on the client, becoming interactive.
    -   **Zustand's Role:** Zustand is used here to manage the *UI state* (which filters are checked, what the sort order is, etc.). Its job is to react to user input and then update the URL's query parameters.

3.  **The Update Cycle:**
    -   User clicks a filter.
    -   The Client Component updates the URL via Next.js's `useRouter`.
    -   Next.js detects the URL change and automatically re-fetches the data for the **Server Components** on the page, sending down the updated HTML.
    -   The page updates seamlessly without a full reload.

This model gives us the SEO and performance of a server-rendered page with the smooth, app-like feel of a client-rendered application.

---

## 3. Core Task Breakdown

### Task 2.1: URL-Based State Management with Zustand

The entire state of the category page (filters, sorting, pagination) must be stored in the URL's query parameters. This is crucial for sharing, bookmarking, and browser history.

**1. Setup Zustand Store:**
Create a new store at `apps/frontend/src/modules/products/store/category-filter-store.ts`.

```typescript
// apps/frontend/src/modules/products/store/category-filter-store.ts
import { create } from 'zustand';

type CategoryFilterState = {
  // Example: { brand: ['sony', 'canon'], sensor_size: ['full-frame'] }
  filters: Record<string, string[]>;
  sortBy: string;
  page: number;
  viewMode: 'grid' | 'list';

  // Actions
  setFilters: (newFilters: Record<string, string[]>) => void;
  setSortBy: (newSortBy: string) => void;
  setPage: (newPage: number) => void;
  setViewMode: (newViewMode: 'grid' | 'list') => void;
  // Action to initialize state from URL
  initStateFromUrl: (searchParams: URLSearchParams) => void;
};

export const useCategoryFilterStore = create<CategoryFilterState>((set) => ({
  filters: {},
  sortBy: 'popularity',
  page: 1,
  viewMode: 'grid',

  setFilters: (newFilters) => set({ filters: newFilters, page: 1 }), // Reset to page 1 on filter change
  setSortBy: (newSortBy) => set({ sortBy: newSortBy }),
  setPage: (newPage) => set({ page: newPage }),
  setViewMode: (newViewMode) => set({ viewMode: newViewMode }),
  
  initStateFromUrl: (searchParams) => {
    // Logic to parse searchParams and set initial state
    // ...
  },
}));
```

**2. Synchronize with URL:**
Create a client component that listens to store changes and updates the URL, and vice-versa.

- Use the `useSearchParams` and `useRouter` hooks from `next/navigation`.
- On initial load, call `initStateFromUrl` with the current `searchParams`.
- Use a `useEffect` hook to watch for changes in the Zustand store and push updates to the URL.

**Example URL Structure:**
`http://localhost:8000/categories/cameras?brand=sony,canon&sensor_size=full-frame&sortBy=price_asc&page=2`

---

### Task 2.2: Building the Faceted Navigation Sidebar

This is the main component for filtering. It must be a **Client Component** because it is highly interactive. Add `'use client'` to the top of the file.

**Component Structure:**
```
- `apps/frontend/src/modules/products/components/filters/`
  - `FilterSidebar.tsx` (Client Component - Main container)
  - `FilterGroup.tsx` (Client Component - Renders a single facet like "Brand")
  - `CheckboxFilter.tsx` (Client Component - Renders the list of options for a facet)
  - `PriceRangeSlider.tsx` (Client Component - Renders the price slider)
```

**1. `FilterSidebar.tsx`:**
- This component will be responsible for orchestrating the filter state.
- It will contain all the other filter components.

**2. `FilterGroup.tsx`:**
- Takes a facet object (from the API response) as a prop.
- Renders the facet label (e.g., "Brand").
- Conditionally renders either `CheckboxFilter` or `PriceRangeSlider` based on `facet.type`.

**3. `CheckboxFilter.tsx`:**
- Receives `options` from the `FilterGroup`.
- Renders a list of checkboxes (daisyUI `checkbox` component).
- Each option should display its `label` and `count`.
- When a checkbox is changed, it should call the `setFilters` action in the Zustand store.

**4. `PriceRangeSlider.tsx`:**
- Use the daisyUI `range` component.
- Will likely need two inputs for min/max values.
- On change, update the `price` filter in the Zustand store.

---

### Task 2.3: Building the Product Display Area

This area is a mix of Server and Client components.

**Component Structure:**
```
- `apps/frontend/src/modules/products/components/`
  - `ProductList.tsx` (**Server Component** - Main container for the right side)
  - `ProductGrid.tsx` (**Server Component** - Renders products in a grid)
  - `ProductListItem.tsx` (**Server Component** - Renders a single product in list view)
  - `ProductCard.tsx` (**Server Component** - Renders a single product in grid view)
  - `ViewToggle.tsx` (**Client Component** - The Grid/List toggle buttons)
  - `SortOptions.tsx` (**Client Component** - The dropdown for sorting)
```

**1. `ProductList.tsx` (Server Component):**
- This is the main server component that fetches product data from `GET /api/category/{id}/products` based on the `searchParams`.
- It will render `SortOptions` and `ViewToggle` at the top.
- It conditionally renders either `ProductGrid` or a list of `ProductListItem` components based on the `viewMode` search param.

**2. `ProductCard.tsx` (Server Component):**
- Display `thumbnail`, `title`, `price`.
- Add a section for `key_specs`.
- **Info Tooltips**: Use the daisyUI `tooltip` component. Wrap a small info icon next to a spec label.
  ```html
  <div class="tooltip" data-tip="Definition of Sensor Size">
    <svg>...</svg> <!-- Info Icon -->
  </div>
  ```
- **Quick View**: This should be a button that opens a modal. The modal itself can be a separate Client Component that fetches its content on demand.

**3. `ProductListItem.tsx` (Server Component):**
- This is a wider, horizontal layout.
- It should display the `thumbnail` on the left and product details on the right.
- Display more information than the grid card, including a short description and a more extensive list of `key_specs`.

**4. `ViewToggle.tsx` (Client Component):**
- Add `'use client'`.
- Two buttons: "Grid" and "List".
- On click, it should update the URL with the new view mode preference.
- The user's choice should also be persisted in `localStorage` for a consistent experience across sessions.

---

## 3. API Interaction Flow

1.  **Initial Page Load**:
    - The page component reads the initial `searchParams` from the URL.
    - It calls `initStateFromUrl` in the Zustand store.
    - It fetches products (`/api/category/{id}/products`) and facets (`/api/category/{id}/facets`) in parallel, passing the initial filter parameters.

2.  **User Applies a Filter (e.g., clicks "Sony" brand):**
    - The `CheckboxFilter` component calls the `setFilters` action in the Zustand store.
    - A `useEffect` hook watching the store state detects the change and updates the URL query string using `router.push()`.
    - The page re-renders because the `searchParams` have changed.
    - On re-render, the page fetches **both** products and facets again with the new, updated filters. This ensures the product list is updated and the facet counts (e.g., "Full-Frame (15)") are also refreshed.

---

## 4. Detailed Implementation Plan

### Phase 1: Foundation (Week 1)
- **Task 1.1**: Create the Zustand store file (`category-filter-store.ts`) with the initial state and actions defined.
- **Task 1.2**: Create the main page layout file `apps/frontend/src/app/categories/[handle]/page.tsx`.
- **Task 1.3**: Implement the URL synchronization logic. Create a client component that reads from `useSearchParams` on load and updates the URL on store changes.
- **Task 1.4**: Create placeholder components for `FilterSidebar` and `ProductList`.

### Phase 2: Core Filtering (Week 2)
- **Task 2.1**: Build the `FilterSidebar.tsx` component. It should fetch and display the raw data from the facets API.
- **Task 2.2**: Build the `FilterGroup.tsx` and `CheckboxFilter.tsx` components. Wire them up to the Zustand store so that clicking a checkbox updates the state.
- **Task 2.3**: Build the `PriceRangeSlider.tsx` component and connect it to the store.
- **Task 2.4**: Verify that applying filters correctly updates the URL and triggers API re-fetches.

### Phase 3: Product Display (Week 3)
- **Task 3.1**: Build the `ProductList.tsx` component to fetch and display products.
- **Task 3.2**: Build the `ProductCard.tsx` for the grid view, including key specs and price.
- **Task 3.3**: Implement the `ViewToggle.tsx` component to switch between grid and list views. Persist the state to `localStorage`.
- **Task 3.4**: Build the `ProductListItem.tsx` for the list view.
- **Task 3.5**: Implement the "Quick View" modal.

### Phase 4: Advanced Features (Week 4)
- **Task 4.1**: Implement the `SortOptions.tsx` dropdown and connect it to the store.
- **Task 4.2**: Implement the "Active Filters" display above the product list, allowing users to remove a filter by clicking an "X" icon.
- **Task 4.3**: Begin work on the product comparison feature. Create a new Zustand store to manage the list of products to compare.
- **Task 4.4**: Add an "Add to Compare" checkbox on each product card/list item.

### Phase 5: Testing & Polish (Week 5)
- **Task 5.1**: Write end-to-end tests using Cypress or Playwright for the core user flow: applying a filter, changing the view, sorting, and seeing the results update.
- **Task 5.2**: Polish the UI. Check for responsive design issues on mobile and tablet.
- **Task 5.3**: Add loading skeletons for the product list and filter sidebar to improve perceived performance.
- **Task 5.4**: Final review of accessibility (WCAG 2.1 AA). Use browser tools to check for contrast ratios, keyboard navigation, and screen reader compatibility.
