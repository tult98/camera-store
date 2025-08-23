import { ApiFilters } from './category-products'

export interface FacetOption {
  value: string
  label: string
  count: number
}

export interface FacetRangeOptions {
  min: number
  max: number
}

export interface Facet {
  id: string
  label: string
  type: 'checkbox' | 'range'
  options: FacetOption[] | FacetRangeOptions
}

export interface CategoryFacetsRequest {
  category_id: string
  filters?: ApiFilters
}

export interface CategoryFacetsResponse {
  facets: Facet[]
}