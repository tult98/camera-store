# Product Requirements Document (PRD)
# Dynamic Facets System for Camera Store

**Version:** 1.0  
**Date:** January 2025  
**Status:** Draft  
**Author:** Development Team  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Goals & Objectives](#2-goals--objectives)
3. [User Stories & Requirements](#3-user-stories--requirements)
4. [Functional Requirements](#4-functional-requirements)
5. [Technical Architecture](#5-technical-architecture)
6. [Data Models](#6-data-models)
7. [API Specifications](#7-api-specifications)
8. [Implementation Plan](#8-implementation-plan)
9. [Migration Strategy](#9-migration-strategy)
10. [Testing Strategy](#10-testing-strategy)
11. [Risk Analysis](#11-risk-analysis)

---

## 1. Executive Summary

### 1.0 Implementation Scope
**Target Catalog Size**: 100-200 products  
**Optimization Level**: Simple, real-time queries (no complex caching)  
**Scalability**: Architecture designed to add optimization layers when catalog grows

### 1.1 Problem Statement
The camera store currently uses hardcoded filters for product discovery (sensor size, video capabilities, mount type, etc.). This approach lacks flexibility and requires code changes to add or modify filters. With the existing ProductAttribute system in place, we need a dynamic faceting system that leverages attribute data to generate filters automatically.

### 1.2 Solution Overview
Implement a Dynamic Facets System that:
- Extends the existing AttributeTemplate system with facet configuration
- Automatically generates product filters based on marked attributes
- Provides aggregation and counting for facet values
- Enables admin control over which attributes become facets
- Maintains backward compatibility with existing filters

### 1.3 Key Benefits
- **Flexibility**: Add/remove facets without code changes
- **Consistency**: Unified filtering across all product types
- **Performance**: Optimized aggregation queries
- **Scalability**: Support unlimited facets per category
- **User Experience**: Dynamic, relevant filters per product type

---

## 2. Goals & Objectives

### 2.1 Business Goals
| Goal | Description | Success Metric |
|------|-------------|----------------|
| **Improve Product Discovery** | Enable precise product filtering | 40% increase in filter usage |
| **Reduce Development Overhead** | Eliminate code changes for new filters | Zero developer tickets for filter additions |
| **Enhance Conversion** | Help customers find products faster | 25% reduction in search abandonment |
| **Category-Specific Filtering** | Show relevant filters per category | 100% dynamic filter coverage |

### 2.2 Technical Goals
- Leverage existing ProductAttribute infrastructure
- Maintain sub-200ms filter aggregation response time
- Support 50+ concurrent facets per page
- Enable real-time facet count updates
- Implement efficient caching strategy

---

## 3. User Stories & Requirements

### 3.1 Admin User Stories

#### US-001: Configure Facets on Templates
```
As an admin user,
I want to mark specific attributes as facets when creating templates,
So that they automatically appear as filters on the storefront.

Acceptance Criteria:
✓ Can toggle "Use as facet" for each attribute
✓ Can set display priority for facet ordering
✓ Can configure aggregation type (term, range, boolean)
✓ Can set display type (checkbox, slider, dropdown)
✓ Changes reflect immediately on storefront
```

#### US-002: Manage Facet Display Settings
```
As an admin user,
I want to configure how facets display on the storefront,
So that I can optimize the filtering experience.

Acceptance Criteria:
✓ Can set maximum items before "Show more"
✓ Can enable/disable product counts
✓ Can configure range buckets for numeric facets
```

#### US-003: Monitor Facet Performance
```
As an admin user,
I want to see facet usage analytics,
So that I can optimize which attributes to use as facets.

Acceptance Criteria:
✓ View click-through rates per facet
✓ See most/least used facet combinations
✓ Monitor facet aggregation performance
✓ Export facet usage reports
```

#### US-006: Understand Field Distinctions
```
As an admin user,
I want clear explanations of the difference between attribute and facet settings,
So that I can correctly configure templates without confusion.

Acceptance Criteria:
✓ See tooltip icons next to each field label
✓ Tooltips explain field purpose and context (admin vs customer)
✓ Visual distinction between attribute and facet sections
✓ Examples provided in tooltip content
✓ Different tooltip colors for attribute vs facet fields
```

### 3.2 Customer User Stories

#### US-004: Filter Products by Attributes
```
As a customer,
I want to filter products using relevant attributes,
So that I can find products matching my requirements.

Acceptance Criteria:
✓ See relevant facets for current category
✓ Apply multiple facet selections
✓ See product counts for each option
✓ Clear individual or all filters easily
✓ Facets update based on current selection
```

#### US-005: Persistent Filter State
```
As a customer,
I want my filter selections to persist,
So that I don't lose them when navigating.

Acceptance Criteria:
✓ Filters persist in URL parameters
✓ Back button maintains filter state
✓ Can share filtered URLs
✓ Filters persist during pagination
```

---

## 4. Functional Requirements

### 4.1 Facet Configuration

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| FR-001 | Facet configuration stored within AttributeDefinition | High |
| FR-002 | Support multiple aggregation types (term, range, histogram, boolean) | High |
| FR-003 | Configure display types (checkbox, slider, dropdown, toggle) | High |
| FR-004 | Set display priority for facet ordering | Medium |
| FR-005 | Configure range buckets for numeric facets | Medium |
| FR-006 | Enable facet-specific UI settings (collapsible, searchable) | Low |

### 4.2 Facet Aggregation

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| FR-007 | Real-time aggregation of facet values from ProductAttribute | High |
| FR-008 | Count products for each facet value | High |
| FR-009 | Support multi-select within facets (OR logic) | High |
| FR-010 | Support cross-facet filtering (AND logic) | High |
| FR-011 | Dynamic facet updates based on current filters | Medium |
| FR-012 | Cache aggregation results for performance | Medium |

### 4.3 Storefront Integration

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| FR-013 | Dynamic facet rendering based on category | High |
| FR-014 | URL parameter synchronization for filters | High |
| FR-015 | Mobile-responsive facet display | High |
| FR-016 | Facet search for options with many values | Medium |
| FR-017 | Active filter summary display | Medium |
| FR-018 | Quick filter clear functionality | Low |

### 4.4 Admin UI Guidance

| Requirement ID | Description | Priority |
|----------------|-------------|----------|
| FR-019 | Tooltip icons next to all configuration fields | High |
| FR-020 | Context-aware tooltip content (attribute vs facet) | High |
| FR-021 | Visual separation of attribute and facet sections | High |
| FR-022 | Color-coded tooltips (blue for attributes, purple for facets) | Medium |
| FR-023 | Example values in tooltip content | Medium |
| FR-024 | Keyboard-accessible tooltips for accessibility | Medium |
| FR-025 | Persistent help panel option for detailed explanations | Low |

---

## 5. Technical Architecture

### 5.1 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  Dynamic Facet Components │ Filter State Manager │ URL Sync    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  /store/facets/[category]  │  /store/products (with facets)    │
│  /store/facets/aggregate   │  /admin/facets/configure          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Service Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  FacetAggregationService   │  FacetConfigurationService        │
│  ProductAttributeService   │  FacetCacheService                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer                                 │
├─────────────────────────────────────────────────────────────────┤
│  AttributeTemplate (with facet_config)                         │
│  ProductAttribute │ Product │ Category                         │
│  Redis Cache for Aggregations                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Data Flow

```
1. Admin Configuration Flow:
   Admin UI → Template Editor → Add facet_config to attribute
   → Save to AttributeTemplate

2. Customer Filter Flow:
   Category Page → Fetch facets for category → Get templates
   → Extract facet-enabled attributes → Aggregate values (real-time)
   → Display filters → Apply selections → Query products

3. Aggregation Flow (Simplified for Small Catalog):
   FacetAggregationService → Query ProductAttributes directly
   → Group by template & attribute → Count occurrences → Return counts
   (No caching needed for 100-200 products)
```

---

## 6. Data Models

### 6.1 Extended AttributeDefinition Interface

```typescript
export interface FacetConfig {
  // Core settings
  is_facet: boolean
  display_priority: number  // 1 = highest priority
  aggregation_type: "term" | "range" | "histogram" | "boolean"
  display_type: "checkbox" | "radio" | "slider" | "dropdown" | "toggle"
  
  // Range configuration (for numeric facets)
  range_config?: {
    min?: number
    max?: number
    step?: number
    buckets?: Array<{
      min: number
      max: number | null
      label: string
    }>
  }
  
  // UI configuration
  show_count?: boolean           // Show (X) next to each option
  max_display_items?: number     // Show "See more" after X items
  
  // Advanced settings
  cache_ttl?: number             // Cache duration in seconds
  depends_on?: string[]          // Other facets this depends on
}

export interface AttributeDefinition {
  key: string
  label: string
  type: "text" | "number" | "select" | "boolean"
  options?: string[]
  option_group?: string
  required: boolean
  display_order: number
  help_text?: string
  validation?: {
    rules: string[]
    min?: number
    max?: number
    regex?: string
  }
  default_value?: any
  unit?: string
  placeholder?: string
  
  // NEW: Facet configuration
  facet_config?: FacetConfig
  
  // NEW: Tooltip content for admin UI
  tooltip?: {
    attribute_tooltip?: string  // Explains attribute field purpose
    facet_tooltip?: string      // Explains facet field purpose
  }
}
```

### 6.2 Facet Aggregation Response

```typescript
interface FacetAggregation {
  facet_key: string
  facet_label: string
  aggregation_type: string
  display_type: string
  values: Array<{
    value: string | number | boolean
    label: string
    count: number
    selected?: boolean
  }>
  range?: {
    min: number
    max: number
    step: number
  }
  ui_config: {
    show_count: boolean
    max_display_items?: number
  }
}

interface FacetsResponse {
  category_id: string
  total_products: number
  facets: FacetAggregation[]
  applied_filters: Record<string, any>
}
```

### 6.3 Database Indexes

```sql
-- Essential indexes for facet aggregation queries
CREATE INDEX idx_product_attributes_template_id_key 
  ON product_attributes(template_id, (attribute_values->>'key'));

CREATE INDEX idx_product_attributes_facet_values 
  ON product_attributes USING GIN (attribute_values);

-- Product-category relationship for filtering
CREATE INDEX idx_product_categories_category_product 
  ON product_categories(category_id, product_id);

-- Note: No cache table needed for small catalog (100-200 products)
-- Can add Redis/cache layer later if catalog grows significantly
```

### 6.4 System Facets

System facets are built-in filters that aggregate data from core commerce models rather than ProductAttribute:

```typescript
interface SystemFacet {
  key: string
  type: "price" | "availability" | "rating"
  aggregation_source: string
  config: {
    display_priority: number
    display_type: "slider" | "checkbox" | "range"
    show_count: boolean
  }
}

// Price facet configuration
const PRICE_FACET: SystemFacet = {
  key: "price",
  type: "price", 
  aggregation_source: "variant.calculated_price",
  config: {
    display_priority: 0, // Always show first
    display_type: "slider",
    show_count: true
  }
}
```

#### Key Differences from Attribute Facets:
- **Data Source**: Aggregates from Product/Variant models, not ProductAttribute
- **Configuration**: Not managed through AttributeTemplate admin UI
- **Implementation**: Handled by separate aggregation logic in FacetAggregationService
- **Always Available**: Present on all category pages regardless of templates

#### Implementation Notes:
```typescript
// FacetAggregationService needs dual paths
class FacetAggregationService {
  // For attribute-based facets
  async aggregateAttributeFacets(categoryId: string) {
    // Query ProductAttribute table
    // Use template facet_config
  }
  
  // For system facets like price
  async aggregateSystemFacets(categoryId: string) {
    // Query Product/Variant tables directly
    // Get min/max from calculated_price
    // Return price ranges
  }
  
  // Combine both for complete facet list
  async getAllFacets(categoryId: string) {
    const [systemFacets, attributeFacets] = await Promise.all([
      this.aggregateSystemFacets(categoryId),
      this.aggregateAttributeFacets(categoryId)
    ])
    return [...systemFacets, ...attributeFacets]
  }
}
```

---

## 7. API Specifications

### 7.1 Store APIs

#### Get Facets for Category
```typescript
GET /store/facets/:category_id

Response: {
  category_id: string
  facets: Array<{
    key: string
    label: string
    type: string
    display_priority: number
    config: FacetConfig
  }>
}
```

#### Get Facet Aggregations
```typescript
POST /store/facets/aggregate

Request: {
  category_id: string
  applied_filters?: Record<string, any>
  include_counts?: boolean
}

Response: FacetsResponse
```

#### Search Products with Facets
```typescript
POST /store/products/search

Request: {
  category_id?: string
  facet_filters?: Record<string, any>
  page?: number
  page_size?: number
  sort_by?: string
}

Response: {
  products: Product[]
  facets: FacetAggregation[]
  pagination: PaginationInfo
}
```

### 7.2 Admin APIs

#### Configure Template Facets
```typescript
PUT /admin/attribute-templates/:id/facets

Request: {
  attribute_key: string
  facet_config: FacetConfig
}

Response: {
  success: boolean
  template: AttributeTemplate
}
```

#### Get Facet Analytics
```typescript
GET /admin/facets/analytics

Query Parameters:
- start_date: ISO date
- end_date: ISO date
- category_id?: string

Response: {
  usage_stats: Array<{
    facet_key: string
    click_count: number
    conversion_rate: number
    avg_products_shown: number
  }>
  popular_combinations: Array<{
    filters: Record<string, any>
    usage_count: number
  }>
}
```

---

## 8. Implementation Plan

### Phase 1: Backend Foundation (Simplified - 2-3 Days)

#### Day 1: Complete Admin UI (US-002)
- [ ] Add range_config fields to attribute template form
- [ ] Add min, max, step inputs for range facets
- [ ] Show range config only when aggregation_type is "range" or "histogram"

#### Day 2: Simple Service Layer
- [ ] Create basic FacetAggregationService (no caching)
- [ ] Implement aggregation logic for term, range, boolean types
- [ ] Add system facet support for price (from variant.calculated_price)
- [ ] Create simple aggregation queries for small datasets

#### Day 3: Basic Database Setup
- [ ] Add essential indexes for ProductAttribute queries
- [ ] Test aggregation performance with 200 products
- [ ] Ensure queries run under 50ms (simple target)

### Phase 2: API Development (Simplified - 2-3 Days)

#### Day 4-5: Store APIs
- [ ] Implement /store/facets/:category_id endpoint (simple config retrieval)
- [ ] Create /store/facets/aggregate endpoint (real-time aggregation)
- [ ] Extend product search with facet filters
- [ ] Test APIs with sample data

#### Day 6: Integration
- [ ] Link Product and ProductAttribute modules
- [ ] Update existing product queries to support facet filtering
- [ ] Test end-to-end flow with real data
- [ ] Skip analytics endpoints for initial implementation

### Phase 3: Frontend Implementation (Simplified - 3-4 Days)

#### Day 7-8: Core Components
- [ ] Create DynamicFacetFilter component
- [ ] Build FacetGroup component
- [ ] Implement basic display types (checkbox, slider, dropdown)
- [ ] Skip search functionality for initial version

#### Day 9-10: State Management
- [ ] Create simple facet state hooks
- [ ] Implement URL synchronization
- [ ] Add filter persistence
- [ ] Build active filter display

#### Day 11: Integration
- [ ] Replace hardcoded filters with dynamic facets
- [ ] Update category pages to use new system
- [ ] Test with mobile responsive design
- [ ] Skip lazy loading (not needed for small catalog)

### Phase 4: Testing & Polish (1-2 Days)

#### Day 12: Testing & Validation
- [ ] Test facet configuration in admin UI
- [ ] Test dynamic facets on storefront
- [ ] Verify filter combinations work correctly
- [ ] Test with sample product data

#### Day 13: Final Polish
- [ ] Fix any UI issues
- [ ] Add basic error handling
- [ ] Test mobile responsive design
- [ ] Verify backward compatibility

### Future Enhancements (When Catalog Grows)
- [ ] Add Redis caching layer
- [ ] Implement analytics dashboard
- [ ] Add facet search functionality
- [ ] Optimize for large datasets
- [ ] Add drag-drop priority management

### Phase 5: Deployment (1 Day)

#### Day 14: Deployment
- [ ] Deploy to staging
- [ ] Run basic smoke tests
- [ ] Deploy to production
- [ ] Monitor basic performance
- [ ] Document setup for future optimization

#### Migration Strategy (Simplified)
- [ ] Keep existing hardcoded filters as fallback initially
- [ ] Gradually enable facets category by category
- [ ] Remove hardcoded filters once facets proven stable

---

## 9. Migration Strategy

### 9.1 Mapping Existing Filters to Facets

| Current Filter | Attribute Key | Facet Type | Migration Action |
|----------------|---------------|------------|------------------|
| sensor-size-filter | sensor_type | term | Map hardcoded options to attribute |
| megapixel-range-filter | megapixels | range | Convert to range facet with buckets |
| video-capability-filter | video_resolution | term | Map to select attribute options |
| mount-type-filter | mount_type | term | Use existing attribute options |
| brand-filter | brand | term | Create brand attribute in templates |
| price-filter | N/A (variant.calculated_price) | range | System facet - aggregates from variant prices, not attributes |

### 9.2 Migration Steps

1. **Phase 1: Parallel Running**
   - Deploy facet system alongside existing filters
   - Run both systems in parallel for testing
   - Compare results for consistency

2. **Phase 2: Gradual Migration**
   - Migrate one filter at a time
   - Start with simple term facets (brand, mount type)
   - Move to complex range facets (megapixels, focal length)
   - Price filter remains as system facet (no migration needed)

3. **Phase 3: Deprecation**
   - Remove hardcoded filter components
   - Clean up old filter code
   - Update documentation

### 9.3 Backward Compatibility

- Maintain URL parameter structure
- Support old filter query format
- Provide redirect rules for changed URLs
- Keep API responses compatible

---

## 10. Testing Strategy

### 10.1 Unit Tests

```typescript
describe('FacetAggregationService', () => {
  describe('aggregateTermFacet', () => {
    it('should count unique values correctly', async () => {
      const result = await service.aggregateTermFacet(
        'sensor_type',
        productAttributes
      );
      expect(result).toEqual([
        { value: 'Full Frame', count: 25, label: 'Full Frame' },
        { value: 'APS-C', count: 18, label: 'APS-C' }
      ]);
    });
  });

  describe('aggregateRangeFacet', () => {
    it('should create buckets correctly', async () => {
      const config = {
        buckets: [
          { min: 10, max: 20, label: '10-20 MP' },
          { min: 20, max: 30, label: '20-30 MP' }
        ]
      };
      const result = await service.aggregateRangeFacet(
        'megapixels',
        productAttributes,
        config
      );
      expect(result[0].count).toBe(12);
    });
  });
});
```

### 10.2 Integration Tests

- Test facet API endpoints with real data
- Verify cache invalidation
- Test concurrent facet requests
- Validate filter combinations

### 10.3 Performance Tests

| Test Case | Target | Measurement |
|-----------|--------|-------------|
| Facet aggregation (200 products) | < 50ms | 95th percentile |
| Complex filter (3+ facets) | < 100ms | 95th percentile |
| Category facet config load | < 20ms | 95th percentile |
| Concurrent users (10) | < 200ms | 95th percentile |

**Note**: Performance targets are conservative for small catalog. Can optimize later if catalog grows to 1000+ products.

### 10.4 E2E Tests

```typescript
describe('Facet Filtering Flow', () => {
  it('should filter products by multiple facets', () => {
    cy.visit('/store/category/cameras');
    
    // Select brand facet
    cy.get('[data-facet="brand"]').click();
    cy.get('[data-facet-value="Canon"]').click();
    
    // Select sensor size facet
    cy.get('[data-facet="sensor_type"]').click();
    cy.get('[data-facet-value="Full Frame"]').click();
    
    // Verify products filtered
    cy.get('[data-product]').should('have.length.lessThan', 20);
    cy.get('[data-product]').each(($product) => {
      cy.wrap($product).should('contain', 'Canon');
    });
    
    // Verify URL updated
    cy.url().should('include', 'brand=Canon');
    cy.url().should('include', 'sensor_type=Full+Frame');
  });
});
```

---

## 11. Risk Analysis

### 11.1 Risk Matrix

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|-------------------|
| **Query performance with growth** | Low | Medium | Monitor query times, add indexes if needed |
| **Complex facet combinations** | Low | Low | Simple queries sufficient for small catalog |
| **Future scaling needs** | Medium | Low | Architecture supports adding caching later |
| **Migration data inconsistency** | Low | High | Parallel running, data validation, rollback plan |
| **UI complexity for many facets** | Medium | Medium | Progressive disclosure, search within facets |
| **Browser compatibility issues** | Low | Low | Progressive enhancement, polyfills |

### 11.2 Performance Optimization Strategies (Current Implementation)

1. **Simple Query Optimization**
   - Use essential database indexes
   - Direct aggregation queries (no caching complexity)
   - Limit queries to active products only

2. **Frontend Optimization**
   - Standard React state management
   - URL synchronization for filter persistence
   - Basic responsive design

3. **Future Scaling Options** (When Catalog Grows > 500 Products)
   - Add Redis caching layer
   - Implement query result pagination
   - Add lazy loading for facet values
   - Use materialized views for heavy aggregations

### 11.3 Monitoring & Metrics

- **Performance Metrics** (Basic)
  - Facet aggregation response time
  - Query execution time
  - API response time

- **Business Metrics** (Basic)
  - Facet usage rate
  - Filter conversion rate

- **Error Monitoring** (Essential)
  - Failed aggregation queries
  - Invalid facet configurations
  - API timeout errors

**Note**: Keep monitoring simple initially. Can expand analytics when catalog grows.

---

## Appendix A: Admin UI Tooltip Content Library

### A.1 Attribute Configuration Tooltips

#### Core Attribute Fields
```typescript
const ATTRIBUTE_TOOLTIPS = {
  type: {
    icon: "ℹ️",
    color: "blue",
    content: "Controls how admins input data when editing products",
    examples: {
      select: "Dropdown with single selection",
      text: "Free text input field",
      number: "Numeric input with validation",
      boolean: "Toggle switch (yes/no)"
    }
  },
  
  display_order: {
    icon: "ℹ️", 
    color: "blue",
    content: "Position of this field in the product editing form (1 = first)",
    example: "Order 5 = appears 5th when editing a product"
  },
  
  required: {
    icon: "ℹ️",
    color: "blue", 
    content: "Whether admins must fill this field when creating products",
    note: "Required fields show * in product forms"
  },
  
  options: {
    icon: "ℹ️",
    color: "blue",
    content: "Predefined choices for select-type attributes",
    note: "Used for dropdown options in product editing"
  },
  
  validation: {
    icon: "ℹ️",
    color: "blue",
    content: "Rules for validating admin input",
    examples: "Min/max values, regex patterns, required rules"
  }
}
```

### A.2 Facet Configuration Tooltips

#### Facet Core Settings
```typescript
const FACET_TOOLTIPS = {
  is_facet: {
    icon: "🔍",
    color: "purple",
    content: "Enable to show this attribute as a customer filter",
    guidance: "Not all attributes make good filters (e.g., serial numbers, detailed descriptions)"
  },
  
  display_priority: {
    icon: "🔍",
    color: "purple", 
    content: "Order of this filter in customer filter sidebar (1 = top)",
    comparison: "Different from 'Display Order' which affects product editing",
    example: "Priority 1 = appears first in filters, even if display order is 10"
  },
  
  aggregation_type: {
    icon: "🔍",
    color: "purple",
    content: "How values are grouped for filtering",
    options: {
      term: "Exact matches (Canon, Nikon, Sony)",
      range: "Numeric buckets (10-20 MP, 20-30 MP)",
      histogram: "Evenly-spaced intervals ($0-500, $500-1000)",
      boolean: "Yes/No toggle filters"
    }
  },
  
  display_type: {
    icon: "🔍", 
    color: "purple",
    content: "How customers interact with this filter",
    comparison: "Can differ from attribute 'Type' field",
    examples: {
      checkbox: "Multiple selections allowed",
      radio: "Single selection only", 
      slider: "Range selection with handles",
      dropdown: "Searchable select menu",
      toggle: "On/off switch"
    }
  }
}
```

### A.3 UI Layout Guidance

#### Visual Separation
```tsx
// Admin template editor layout
<div className="space-y-8">
  {/* Attribute Configuration Section */}
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
    <h3 className="text-blue-800 font-semibold mb-4">
      📝 Attribute Configuration
      <TooltipIcon 
        content="These settings control how admins enter product data"
        color="blue"
      />
    </h3>
    
    <FieldWithTooltip
      label="Input Type"
      tooltip={ATTRIBUTE_TOOLTIPS.type}
      field={<TypeSelector />}
    />
    
    <FieldWithTooltip
      label="Display Order"
      tooltip={ATTRIBUTE_TOOLTIPS.display_order}
      field={<NumberInput />}
    />
  </div>

  {/* Facet Configuration Section */}
  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
    <h3 className="text-purple-800 font-semibold mb-4">
      🔍 Customer Filter Configuration
      <TooltipIcon 
        content="These settings control how customers filter products"
        color="purple"
      />
    </h3>
    
    <FieldWithTooltip
      label="Use as Filter"
      tooltip={FACET_TOOLTIPS.is_facet}
      field={<ToggleSwitch />}
    />
    
    <FieldWithTooltip
      label="Filter Priority"
      tooltip={FACET_TOOLTIPS.display_priority}
      field={<NumberInput />}
    />
    
    <FieldWithTooltip
      label="Filter Display Type"
      tooltip={FACET_TOOLTIPS.display_type}
      field={<DisplayTypeSelector />}
    />
  </div>
</div>
```

### A.4 Tooltip Component Specifications

#### Component Props
```typescript
interface TooltipProps {
  content: string
  color: "blue" | "purple"
  icon?: "ℹ️" | "🔍"
  position?: "top" | "bottom" | "left" | "right"
  trigger?: "hover" | "click"
  maxWidth?: number
  examples?: Record<string, string>
  comparison?: string
}

interface FieldWithTooltipProps {
  label: string
  tooltip: TooltipConfig
  field: React.ReactNode
  required?: boolean
}
```

#### Tooltip Content Structure
```typescript
interface TooltipConfig {
  icon: string
  color: "blue" | "purple"
  content: string           // Main explanation
  examples?: Record<string, string> | string
  comparison?: string       // How it differs from similar field
  guidance?: string         // When to use/not use
  note?: string            // Additional context
}
```

---

## Appendix B: Sample Configurations

### Camera Template with Facets

```json
{
  "name": "Digital Camera Attributes",
  "code": "camera_digital",
  "attribute_definitions": [
    {
      "key": "brand",
      "label": "Brand",
      "type": "select",
      "options": ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic"],
      "required": true,
      "display_order": 1,
      "facet_config": {
        "is_facet": true,
        "display_priority": 1,
        "aggregation_type": "term",
        "display_type": "checkbox",
        "show_count": true
      }
    },
    {
      "key": "sensor_type",
      "label": "Sensor Size",
      "type": "select",
      "options": ["Full Frame", "APS-C", "Micro Four Thirds", "1-inch"],
      "required": true,
      "display_order": 2,
      "facet_config": {
        "is_facet": true,
        "display_priority": 2,
        "aggregation_type": "term",
        "display_type": "checkbox",
        "show_count": true
      }
    },
    {
      "key": "megapixels",
      "label": "Resolution",
      "type": "number",
      "required": true,
      "display_order": 3,
      "unit": "MP",
      "facet_config": {
        "is_facet": true,
        "display_priority": 3,
        "aggregation_type": "range",
        "display_type": "slider",
        "range_config": {
          "min": 10,
          "max": 60,
          "step": 5,
          "buckets": [
            { "min": 10, "max": 20, "label": "10-20 MP" },
            { "min": 20, "max": 30, "label": "20-30 MP" },
            { "min": 30, "max": 45, "label": "30-45 MP" },
            { "min": 45, "max": null, "label": "45+ MP" }
          ]
        },
        "show_count": true
      }
    },
    {
      "key": "video_resolution",
      "label": "Video Capability",
      "type": "select",
      "options": ["8K", "6K", "4K", "Full HD", "No Video"],
      "required": false,
      "display_order": 4,
      "facet_config": {
        "is_facet": true,
        "display_priority": 4,
        "aggregation_type": "term",
        "display_type": "checkbox",
        "show_count": true,
        "max_display_items": 3
      }
    },
    {
      "key": "weather_sealed",
      "label": "Weather Sealed",
      "type": "boolean",
      "default_value": false,
      "display_order": 5,
      "facet_config": {
        "is_facet": true,
        "display_priority": 5,
        "aggregation_type": "boolean",
        "display_type": "toggle",
        "show_count": true
      }
    }
  ]
}
```

### Lens Template with Facets

```json
{
  "name": "Camera Lens Attributes",
  "code": "lens_camera",
  "attribute_definitions": [
    {
      "key": "focal_length_min",
      "label": "Focal Length",
      "type": "number",
      "unit": "mm",
      "required": true,
      "display_order": 1,
      "facet_config": {
        "is_facet": true,
        "display_priority": 1,
        "aggregation_type": "range",
        "display_type": "slider",
        "range_config": {
          "min": 8,
          "max": 800,
          "step": 10
        },
        "show_count": true
      }
    },
    {
      "key": "max_aperture",
      "label": "Maximum Aperture",
      "type": "select",
      "options": ["f/1.2", "f/1.4", "f/1.8", "f/2", "f/2.8", "f/4"],
      "required": true,
      "display_order": 2,
      "facet_config": {
        "is_facet": true,
        "display_priority": 2,
        "aggregation_type": "term",
        "display_type": "checkbox",
        "show_count": true
      }
    },
    {
      "key": "mount_type",
      "label": "Lens Mount",
      "type": "select",
      "option_group": "lens_mounts",
      "required": true,
      "display_order": 3,
      "facet_config": {
        "is_facet": true,
        "display_priority": 3,
        "aggregation_type": "term",
        "display_type": "dropdown",
        "show_count": true
      }
    }
  ]
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2025 | Development Team | Initial PRD creation |

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Technical Lead | | | |
| QA Lead | | | |
| Business Stakeholder | | | |