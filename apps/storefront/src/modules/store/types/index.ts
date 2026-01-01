import { HttpTypes } from "@medusajs/types"

export interface ApiFilters {
  tags?: string[]
  availability?: string[]
  price?: { min?: number; max?: number }
  metadata?: Record<string, string[]>
  brand_id?: string
}

export interface FacetAggregation {
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

export interface FacetsResponse {
  category_id: string
  total_products: number
  facets: FacetAggregation[]
  applied_filters: Record<string, unknown>
}

export interface Brand {
  id: string
  name: string
  image_url: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface GetCategoryBrandsResponse {
  brands: Brand[]
}

export interface CategoryProductsResponse
  extends HttpTypes.PaginatedResponse<{ items: HttpTypes.StoreProduct[] }> {}
