export interface ApiFilters {
  tags?: string[]
  availability?: string[]
  price?: { min?: number; max?: number }
  metadata?: Record<string, string[]>
}

export interface ProductKeySpec {
  label: string
  value: string
}

export interface CategoryProduct {
  id: string
  title: string
  handle: string
  thumbnail: string
  price: { amount: number; currency_code: string }
  rating?: number
  review_count?: number
  key_specs?: ProductKeySpec[]
  availability: string
}

export interface CategoryProductsResponse {
  pagination: {
    total: number
    limit: number
    offset: number
    totalPages: number
    currentPage: number
  }
  products: CategoryProduct[]
}

export interface FacetOption {
  value: string
  label: string
  count: number
}

export interface Facet {
  id: string
  label: string
  type: 'checkbox' | 'range'
  options: FacetOption[] | { min: number; max: number }
}

export interface CategoryFacetsResponse {
  facets: Facet[]
}

export interface CategoryProductsRequest {
  category_id: string
  page?: number
  page_size?: number
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
  filters?: ApiFilters
}

export interface CategoryFacetsRequest {
  category_id: string
  filters?: ApiFilters
}