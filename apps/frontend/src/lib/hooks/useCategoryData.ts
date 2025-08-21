import { useQuery } from '@tanstack/react-query'
import { cameraStoreApi } from '@lib/config'
import { ApiFilters } from '@modules/store/store/category-filter-store'

export interface CategoryProductsRequest {
  category_id: string
  page: number
  page_size: number
  sort_by: string
  sort_direction: 'asc' | 'desc'
  filters: ApiFilters
  search_query?: string
}

export interface CategoryFacetsRequest {
  category_id: string
  filters: ApiFilters
}

export interface ProductData {
  id: string
  title: string
  handle: string
  thumbnail: string
  price: {
    amount: number
    currency_code: string
  }
  rating?: number
  review_count?: number
  key_specs: Array<{
    label: string
    value: string
  }>
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
  products: ProductData[]
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

export const useCategoryProducts = (request: CategoryProductsRequest) => {
  return useQuery<CategoryProductsResponse>({
    queryKey: ['categoryProducts', request],
    queryFn: async () => {
      const response = await cameraStoreApi.post('/store/category-products', request)
      return response.data
    },
    enabled: !!request.category_id,
  })
}

export const useCategoryFacets = (request: CategoryFacetsRequest) => {
  return useQuery<CategoryFacetsResponse>({
    queryKey: ['categoryFacets', request],
    queryFn: async () => {
      const response = await cameraStoreApi.post('/store/category-facets', request)
      return response.data
    },
    enabled: !!request.category_id,
  })
}

export const useCategoryDataWithInitial = (
  request: CategoryProductsRequest,
  initialProductsData?: CategoryProductsResponse,
  initialFacetsData?: CategoryFacetsResponse
) => {
  const productsQuery = useQuery<CategoryProductsResponse>({
    queryKey: ['categoryProducts', request],
    queryFn: async () => {
      const response = await cameraStoreApi.post('/store/category-products', request)
      return response.data
    },
    initialData: initialProductsData,
    enabled: !!request.category_id,
  })

  const facetsQuery = useQuery<CategoryFacetsResponse>({
    queryKey: ['categoryFacets', { category_id: request.category_id, filters: request.filters }],
    queryFn: async () => {
      const response = await cameraStoreApi.post('/store/category-facets', {
        category_id: request.category_id,
        filters: request.filters,
      })
      return response.data
    },
    initialData: initialFacetsData,
    enabled: !!request.category_id,
  })

  return {
    productsQuery,
    facetsQuery,
    isLoading: productsQuery.isLoading || facetsQuery.isLoading,
    isError: productsQuery.isError || facetsQuery.isError,
    refetchAll: async () => {
      await Promise.all([
        productsQuery.refetch(),
        facetsQuery.refetch(),
      ])
    }
  }
}