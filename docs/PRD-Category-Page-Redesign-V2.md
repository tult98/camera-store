# Product Requirements Document: Category Page V2

**Version**: 2.0  
**Date**: August 21, 2025  
**Status**: Draft  
**Author**: Gemini Solution Architect

---

## 1. Executive Summary

### 1.1. Project Overview
This document outlines the requirements for a comprehensive redesign of the camera store's category page. The goal is to evolve from a simple product listing to a sophisticated, user-centric shopping experience. This initiative will empower customers to navigate our extensive and technical product catalog with confidence, catering to users from beginners to seasoned professionals.

### 1.2. Objectives
- **Enhance Decision-Making**: Implement advanced tools and educational content to reduce user friction and decision fatigue.
- **Improve User Experience**: Create a highly intuitive, responsive, and performant interface for discovering and evaluating complex products.
- **Increase Conversion & Engagement**: Boost key performance metrics through a superior shopping experience.
- **Establish Technical Foundation**: Build a scalable, accessible, and maintainable platform for future growth.

### 1.3. Key Changes from V1
- **Faceted Navigation**: Introducing a more intelligent, dynamic, and interdependent filtering system.
- **Guided Selling**: Adding thematic filters and buying guides to assist non-expert users.
- **Enhanced Comparison**: Improving the product comparison tool for more effective analysis.
- **Defined API Contracts**: Specifying data structures to streamline backend and frontend development.

---

## 2. Market Research & Best Practices

### 2.1. Industry Insights (2025 E-commerce Landscape)
- **Faceted Search is Standard**: For complex catalogs, faceted search is no longer optional. It requires dynamic result counts and interdependent filters to prevent users from hitting "zero result" dead ends.
- **Guided Selling Boosts Confidence**: For high-consideration products, users respond well to "guided selling" through thematic filters (e.g., "Good for Travel"), interactive quizzes, and buying guides.
- **Information Hierarchy is Key**: Users need the ability to switch between a visual **Grid View** for browsing and a data-rich **List View** for detailed comparison.

### 2.2. Competitive Analysis (B&H Photo, Adorama)
- **Granular, Technical Filters**: Competitors offer highly specific filters for technical attributes like sensor size, lens mount, video resolution, and frame rates.
- **Availability & Deal Filters**: Filtering by "In Stock," "Used," and "Pre-Order" is a standard feature that caters to different purchasing intentions.
- **Educational Content**: Category pages are supported by buying guides and articles that help users make informed decisions.
- **Clear SEO & Navigation**: Prominent, descriptive headers and breadcrumbs are used to orient users and improve search engine ranking.

---

## 3. User Requirements

### 3.1. User Personas
*(Personas from V1 remain relevant)*

### 3.2. User Stories
- **As a professional photographer,** I want to filter by lens mount, sensor size, and video specifications simultaneously, so I can quickly find a camera body that fits my exact workflow.
- **As a photography enthusiast,** I want to compare the key specifications of 3-4 mirrorless cameras side-by-side, so I can make a confident decision on my upgrade.
- **As a beginner filmmaker,** I want to see cameras tagged as "Good for Vlogging" or "Cinematic Look" under $1500, so I can choose a suitable camera without needing to be a technical expert.
- **As a gift buyer,** I want to use a simple quiz or buying guide to understand the options, so I can purchase a camera that meets the recipient's needs.

---

## 4. Technical Requirements

### 4.1. Performance & Accessibility
*(Requirements from V1 remain, including WCAG 2.1 AA, Core Web Vitals, etc.)*

### 4.2. API & Data Contracts
To ensure smooth development, the frontend will consume a set of well-defined API endpoints. Research indicates that Medusa's default Storefront API does not support the required advanced filtering (by price, metadata, availability) or dynamic facet counts out-of-the-box.

Therefore, the following endpoints must be created as **custom Medusa API routes**.

- **`POST /api/store/category-products`**: Fetches products for a category, accepting a rich filter object in the request body for advanced filtering. Using POST allows for a more complex filter structure than GET query parameters.
- **`POST /api/store/category-facets`**: Fetches available filters (facets) for a category, including dynamic result counts based on the currently applied filters sent in the request body.

See **Appendix A.2** for detailed request/response structures.

### 4.3. State Management
- The application state (selected filters, view mode, current page) must be synchronized with the URL query string to ensure shareability and browser history integration.
- A robust client-side state management solution (e.g., Zustand, Jotai, or React Context with hooks) should be used to manage filter state and API data.

---

## 5. Feature Specifications

### 5.1. Faceted Navigation & Filtering System
This replaces the "Advanced Filtering System" from V1.

#### 5.1.1. Core Functionality
- **Dynamic Facets**: The list of available filter options and their product counts must update dynamically as the user applies other filters.
- **Multi-Select**: Users can select multiple options within a single facet (e.g., Brand: Sony, Canon).
- **Result Counts**: Each filter option must display the number of matching products (e.g., "Full-Frame (32)").
- **URL Synchronization**: All active filters must be serialized into the URL for bookmarking and sharing.

#### 5.1.2. Filter Types
- **Technical Filters**:
    - **Camera-Specific**: Brand, Sensor Size, Megapixels, Video Resolution (4K@60, 8K@30), Mount Type, etc. These will be stored in product `metadata`.
    - **Lens-Specific**: Focal Length, Aperture, Lens Type, Mount Compatibility, Image Stabilization. These will be stored in product `metadata`.
- **Thematic & Guided Filters**:
    - **Use Case**: "Good for Vlogging," "Good for Sports," "Good for Portraits." These are curated and stored as product `tags`.
- **Operational Filters**:
    - **Price Range**: A slider with input fields.
    - **Availability**: "In Stock," "Pre-Order," "Used."
    - **Deals**: "On Sale."

### 5.2. Product Display System

#### 5.2.1. Layout & Views
- **Grid View**: Visual-first layout with 3-4 columns on desktop.
- **List View**: Data-first, single-column layout displaying key specs directly on the page for easier comparison.
- **View Toggle**: User's choice of view should be persisted in local storage.

#### 5.2.2. Product Card Enhancements
- **Key Specs**: Display 3-4 of the most important specifications.
- **Info Tooltips**: On desktop, show a tooltip explaining technical terms (e.g., hovering over "Sensor Size" shows a brief definition).
- **Quick View**: A modal to show more product details without leaving the category page.

### 5.3. Search & Discovery

#### 5.3.1. Guided Selling
- **Buying Guides**: The category header will include a link to a "Camera Buying Guide" article.
- **Interactive Quiz (Future Iteration)**: A simple quiz ("Find Your Perfect Camera") could be developed to guide new users to the right subcategory.

### 5.4. Product Comparison Tool
*(Functionality from V1 remains valid, with a focus on a clean side-by-side specification table in a modal.)*

---

## 6. Layout Specifications
*(Layouts from V1 are a strong foundation. The primary change is the addition of the list/grid view toggle and clear labeling for thematic vs. technical filters.)*

### 6.1. Desktop Layout (≥768px)
```
┌─ Left Sidebar (320px) ──┐ ┌─ Main Content Area ────────────────┐
│ FILTERS                 │ │ [Sort] [View: Grid/List] [Compare] │
│ ┌─ Search ─────────────┐│ ├────────────────────────────────────┤
│ │ [Search in category]││ │ [Active Filters: Canon ✕]         │
│ └─────────────────────┘│ ├────────────────────────────────────┤
│                        │ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│ ▼ USE CASE             │ │ │ Prod│ │ Prod│ │ Prod│ │ Prod│  │
│ ☐ Good for Vlogging(12)│ │ │  1  │ │  2  │ │  3  │ │  4  │  │
│ ☐ Good for Sports (8)  │ │ └─────┘ └─────┘ └─────┘ └─────┘  │
│                        │ │                                  │
│ ▼ BRAND (TECHNICAL)    │ │ [← Previous] [1][2][3] [Next →] │
│ ☐ Canon (24)           │ └────────────────────────────────────┘
│ ☐ Nikon (18)           │
...
```

---

## 7. Implementation Plan
*(The phased plan from V1 is a good model. This version adjusts tasks to reflect new features.)*

- **Phase 1: Foundation (Week 1)**: Project setup, layout components, basic navigation. **New Task**: Implement the custom Medusa API endpoints defined in Section 4.2.
- **Phase 2: Core Filtering (Week 2)**: **Task**: Connect the frontend to the custom API. Implement the full faceted navigation system, including dynamic result counts and URL state management.
- **Phase 3: Product Display (Week 3)**: **Task**: Build Grid/List views, product cards with tooltips, and sorting.
- **Phase 4: Advanced Features (Week 4)**: **Task**: Build comparison tool, integrate buying guides, and implement in-category search.
- **Phase 5: Testing & Polish (Week 5)**: **New Task**: Add end-to-end tests for the custom API endpoints, faceted filtering, and comparison user flows.

---

## 8. Success Metrics

### 8.1. Key Performance Indicators (KPIs)
*(KPIs from V1 are retained. The following are added.)*
- **Filter Engagement**: % of users who interact with at least one filter. Target: 75%.
- **Zero-Result Searches**: Number of filter combinations that lead to zero results. Target: Reduce by 50%.
- **Guided Selling Adoption**: % of users who click on a buying guide from a category page. Target: 10%.
- **Comparison Tool Usage**: % of sessions where the product comparison tool is used. Target: 15%.

---

## 9. Appendix

### A.1. Component File Structure
*(Structure from V1 is a good starting point.)*

### A.2. API & Data Contracts

**Note**: These endpoints must be implemented as **custom routes** in the Medusa backend.

#### 1. Get Products API

- **Endpoint**: `POST /store/category-products`
- **Description**: Fetches a paginated list of products for a given category, applying a set of filters.

**Request Body:**
```json
{
  "category_id": "pcat_123",
  "page": 1,
  "page_size": 24,
  "sort_by": "price",
  "sort_direction": "asc",
  "filters": {
    "tags": ["vlogging"],
    "availability": ["in-stock"],
    "price": {
      "min": 1000,
      "max": 2500
    },
    "metadata": {
      "sensor_size": ["full-frame"],
      "brand": ["sony", "canon"]
    }
  }
}
```

**Product Response (Success: 200 OK):**
```json
{
  "pagination": {
    "total": 84,
    "limit": 24,
    "offset": 0,
    "totalPages": 4,
    "currentPage": 1
  },
  "products": [
    {
      "id": "prod_123",
      "title": "Sony Alpha a7 IV",
      "handle": "sony-alpha-a7-iv",
      "thumbnail": "/path/to/image.webp",
      "price": { "amount": 2499.99, "currency_code": "usd" },
      "rating": 4.8,
      "review_count": 152,
      "key_specs": [
        { "label": "Sensor", "value": "33MP Full-Frame" },
        { "label": "Video", "value": "4K 60p" }
      ],
      "availability": "in-stock"
    }
  ]
}
```

---

#### 2. Get Facets API

- **Endpoint**: `POST /store/category-facets`
- **Description**: Fetches the available filter facets and their dynamic counts based on the current filtering context.

**Request Body:**
*(The same body as the Get Products API is used to provide context)*
```json
{
  "category_id": "pcat_123",
  "filters": {
    "tags": ["vlogging"],
    "price": {
      "min": 1000,
      "max": 2500
    }
  }
}
```

**Facets Response (Success: 200 OK):**
```json
{
  "facets": [
    {
      "id": "brand",
      "label": "Brand",
      "type": "checkbox",
      "options": [
        { "value": "sony", "label": "Sony", "count": 12 },
        { "value": "canon", "label": "Canon", "count": 8 }
      ]
    },
    {
      "id": "sensor_size",
      "label": "Sensor Size",
      "type": "checkbox",
      "options": [
        { "value": "full-frame", "label": "Full-Frame", "count": 10 },
        { "value": "aps-c", "label": "APS-C", "count": 10 }
      ]
    },
    {
      "id": "price",
      "label": "Price",
      "type": "range",
      "options": { "min": 1100, "max": 2499 }
    }
  ]
}
```
