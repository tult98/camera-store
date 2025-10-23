import { create } from 'zustand'
import { ApiFilters } from '@camera-store/shared-types'

export type ViewMode = 'grid' | 'list'
export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'name_asc' | 'name_desc'

export interface CategoryFilterState {
  filters: ApiFilters
  sortBy: SortOption
  page: number
  pageSize: number
  viewMode: ViewMode
  searchQuery: string
  brandFilter: string | null

  setFilters: (filters: ApiFilters) => void
  toggleFilter: (filterType: keyof ApiFilters, key: string, value?: string) => void
  removeFilter: (filterType: keyof ApiFilters, key: string, value?: string) => void
  clearAllFilters: () => void
  setSortBy: (sortBy: SortOption) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setViewMode: (viewMode: ViewMode) => void
  setSearchQuery: (query: string) => void
  setPriceRange: (range: { min?: number; max?: number }) => void
  setBrandFilter: (brandId: string | null) => void
  clearBrandFilter: () => void
  initStateFromUrl: (searchParams: URLSearchParams) => void
  getUrlSearchParams: () => URLSearchParams
  getApiRequestBody: (categoryId: string) => any
}

export const useCategoryFilterStore = create<CategoryFilterState>((set, get) => ({
  filters: {},
  sortBy: 'price_asc',
  page: 1,
  pageSize: 24,
  viewMode: 'grid',
  searchQuery: '',
  brandFilter: null,

  setFilters: (filters) => set({ filters, page: 1 }),

  toggleFilter: (filterType, key, value) => {
    const currentFilters = get().filters
    
    if (filterType === 'tags' || filterType === 'availability') {
      const currentValues = currentFilters[filterType] || []
      const newValues = currentValues.includes(key)
        ? currentValues.filter(v => v !== key)
        : [...currentValues, key]
      
      set({
        filters: {
          ...currentFilters,
          [filterType]: newValues.length > 0 ? newValues : undefined
        },
        page: 1
      })
    } else if (filterType === 'metadata' && value) {
      const metadata = currentFilters.metadata || {}
      const currentValues = metadata[key] || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      const newMetadata = {
        ...metadata,
        [key]: newValues.length > 0 ? newValues : undefined
      }
      
      const cleanedMetadata = Object.entries(newMetadata).reduce((acc, [k, v]) => {
        if (v !== undefined) {
          acc[k] = v
        }
        return acc
      }, {} as Record<string, string[]>)
      
      set({
        filters: {
          ...currentFilters,
          metadata: Object.keys(cleanedMetadata).length > 0 ? cleanedMetadata : undefined
        },
        page: 1
      })
    }
  },

  removeFilter: (filterType, key, value) => {
    const currentFilters = get().filters
    
    if (filterType === 'tags' || filterType === 'availability') {
      const currentValues = currentFilters[filterType] || []
      const newValues = currentValues.filter(v => v !== key)
      
      set({
        filters: {
          ...currentFilters,
          [filterType]: newValues.length > 0 ? newValues : undefined
        },
        page: 1
      })
    } else if (filterType === 'metadata') {
      const metadata = currentFilters.metadata || {}
      
      if (value) {
        const currentValues = metadata[key] || []
        const newValues = currentValues.filter(v => v !== value)
        
        const newMetadata = {
          ...metadata,
          [key]: newValues.length > 0 ? newValues : undefined
        }
        
        const cleanedMetadata = Object.entries(newMetadata).reduce((acc, [k, v]) => {
          if (v !== undefined) {
            acc[k] = v
          }
          return acc
        }, {} as Record<string, string[]>)
        
        set({
          filters: {
            ...currentFilters,
            metadata: Object.keys(cleanedMetadata).length > 0 ? cleanedMetadata : undefined
          },
          page: 1
        })
      } else {
        const { [key]: _, ...restMetadata } = metadata
        set({
          filters: {
            ...currentFilters,
            metadata: Object.keys(restMetadata).length > 0 ? restMetadata : undefined
          },
          page: 1
        })
      }
    } else if (filterType === 'price') {
      set({
        filters: {
          ...currentFilters,
          price: undefined
        },
        page: 1
      })
    }
  },

  clearAllFilters: () => {
    set({
      filters: {},
      searchQuery: '',
      brandFilter: null,
      page: 1
    })
  },

  setSortBy: (sortBy) => set({ sortBy }),

  setPage: (page) => set({ page }),

  setPageSize: (pageSize) => set({ pageSize }),

  setViewMode: (viewMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('categoryViewMode', viewMode)
    }
    set({ viewMode })
  },

  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),

  setPriceRange: (priceRange) => set({
    filters: {
      ...get().filters,
      price: priceRange
    },
    page: 1
  }),

  setBrandFilter: (brandId) => set({ brandFilter: brandId, page: 1 }),

  clearBrandFilter: () => set({ brandFilter: null, page: 1 }),

  initStateFromUrl: (searchParams) => {
    const filters: ApiFilters = {}
    const priceRange: { min?: number; max?: number } = {}
    let tags: string[] = []
    let availability: string[] = []
    const metadata: Record<string, string[]> = {}
    
    searchParams.forEach((value, key) => {
      if (key === 'sortBy') {
        set({ sortBy: value as SortOption })
      } else if (key === 'page') {
        set({ page: parseInt(value, 10) || 1 })
      } else if (key === 'pageSize') {
        set({ pageSize: parseInt(value, 10) || 24 })
      } else if (key === 'view') {
        set({ viewMode: value as ViewMode })
      } else if (key === 'q') {
        set({ searchQuery: value })
      } else if (key === 'price_min') {
        priceRange.min = parseFloat(value)
      } else if (key === 'price_max') {
        priceRange.max = parseFloat(value)
      } else if (key === 'tags') {
        tags = value.split(',')
      } else if (key === 'availability') {
        availability = value.split(',')
      } else if (key.startsWith('meta_')) {
        const metaKey = key.substring(5)
        metadata[metaKey] = value.split(',')
      }
    })
    
    if (tags.length > 0) {
      filters.tags = tags
    }
    
    if (availability.length > 0) {
      filters.availability = availability
    }
    
    if (Object.keys(metadata).length > 0) {
      filters.metadata = metadata
    }
    
    if (Object.keys(priceRange).length > 0) {
      filters.price = priceRange
    }
    
    set({ filters })
    
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem('categoryViewMode') as ViewMode
      if (savedViewMode && !searchParams.has('view')) {
        set({ viewMode: savedViewMode })
      }
    }
  },

  getUrlSearchParams: () => {
    const state = get()
    const params = new URLSearchParams()
    
    if (state.filters.tags && state.filters.tags.length > 0) {
      params.set('tags', state.filters.tags.join(','))
    }
    
    if (state.filters.availability && state.filters.availability.length > 0) {
      params.set('availability', state.filters.availability.join(','))
    }
    
    if (state.filters.metadata) {
      Object.entries(state.filters.metadata).forEach(([key, values]) => {
        if (values && values.length > 0) {
          params.set(`meta_${key}`, values.join(','))
        }
      })
    }
    
    if (state.filters.price?.min !== undefined) {
      params.set('price_min', state.filters.price.min.toString())
    }
    
    if (state.filters.price?.max !== undefined) {
      params.set('price_max', state.filters.price.max.toString())
    }
    
    if (state.sortBy !== 'price_asc') {
      params.set('sortBy', state.sortBy)
    }
    
    if (state.page > 1) {
      params.set('page', state.page.toString())
    }
    
    if (state.pageSize !== 24) {
      params.set('pageSize', state.pageSize.toString())
    }
    
    if (state.viewMode !== 'grid') {
      params.set('view', state.viewMode)
    }
    
    if (state.searchQuery) {
      params.set('q', state.searchQuery)
    }
    
    return params
  },

  getApiRequestBody: (categoryId) => {
    const state = get()
    const sortMapping: Record<SortOption, string> = {
      'price_asc': 'price',
      'price_desc': '-price',
      'newest': '-created_at',
      'name_asc': 'name',
      'name_desc': '-name'
    }

    const orderBy = sortMapping[state.sortBy] || 'price'

    // Flatten metadata filters to root level for backend compatibility
    const flattenedFilters: Record<string, any> = { ...state.filters }
    if (state.filters.metadata) {
      Object.entries(state.filters.metadata).forEach(([key, value]) => {
        flattenedFilters[key] = value
      })
      delete flattenedFilters.metadata
    }

    if (state.brandFilter) {
      flattenedFilters.brand_id = state.brandFilter
    }

    return {
      category_id: categoryId,
      page: state.page,
      page_size: state.pageSize,
      order_by: orderBy,
      filters: flattenedFilters,
      search_query: state.searchQuery || undefined
    }
  }
}))