import { create } from 'zustand'

export type ViewMode = 'grid' | 'list'
export type SortOption = 'popularity' | 'price_asc' | 'price_desc' | 'newest' | 'name_asc' | 'name_desc' | 'rating'

export interface CategoryFilterState {
  filters: Record<string, string[]>
  sortBy: SortOption
  page: number
  viewMode: ViewMode
  searchQuery: string
  priceRange: { min?: number; max?: number }
  
  setFilters: (filters: Record<string, string[]>) => void
  toggleFilter: (filterKey: string, value: string) => void
  removeFilter: (filterKey: string, value?: string) => void
  clearAllFilters: () => void
  setSortBy: (sortBy: SortOption) => void
  setPage: (page: number) => void
  setViewMode: (viewMode: ViewMode) => void
  setSearchQuery: (query: string) => void
  setPriceRange: (range: { min?: number; max?: number }) => void
  initStateFromUrl: (searchParams: URLSearchParams) => void
  getUrlSearchParams: () => URLSearchParams
}

export const useCategoryFilterStore = create<CategoryFilterState>((set, get) => ({
  filters: {},
  sortBy: 'popularity',
  page: 1,
  viewMode: 'grid',
  searchQuery: '',
  priceRange: {},

  setFilters: (filters) => set({ filters, page: 1 }),

  toggleFilter: (filterKey, value) => {
    const currentFilters = get().filters
    const filterValues = currentFilters[filterKey] || []
    
    const newFilterValues = filterValues.includes(value)
      ? filterValues.filter(v => v !== value)
      : [...filterValues, value]
    
    const newFilters = {
      ...currentFilters,
      [filterKey]: newFilterValues.length > 0 ? newFilterValues : undefined
    }
    
    const cleanedFilters = Object.entries(newFilters).reduce((acc, [key, val]) => {
      if (val !== undefined) {
        acc[key] = val
      }
      return acc
    }, {} as Record<string, string[]>)
    
    set({ filters: cleanedFilters, page: 1 })
  },

  removeFilter: (filterKey, value) => {
    const currentFilters = get().filters
    
    if (value) {
      const filterValues = currentFilters[filterKey] || []
      const newFilterValues = filterValues.filter(v => v !== value)
      
      if (newFilterValues.length === 0) {
        const { [filterKey]: _, ...restFilters } = currentFilters
        set({ filters: restFilters, page: 1 })
      } else {
        set({
          filters: {
            ...currentFilters,
            [filterKey]: newFilterValues
          },
          page: 1
        })
      }
    } else {
      const { [filterKey]: _, ...restFilters } = currentFilters
      set({ filters: restFilters, page: 1 })
    }
  },

  clearAllFilters: () => {
    set({ 
      filters: {}, 
      priceRange: {}, 
      searchQuery: '', 
      page: 1 
    })
  },

  setSortBy: (sortBy) => set({ sortBy }),

  setPage: (page) => set({ page }),

  setViewMode: (viewMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('categoryViewMode', viewMode)
    }
    set({ viewMode })
  },

  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),

  setPriceRange: (priceRange) => set({ priceRange, page: 1 }),

  initStateFromUrl: (searchParams) => {
    const filters: Record<string, string[]> = {}
    const priceRange: { min?: number; max?: number } = {}
    
    searchParams.forEach((value, key) => {
      if (key === 'sortBy') {
        set({ sortBy: value as SortOption })
      } else if (key === 'page') {
        set({ page: parseInt(value, 10) || 1 })
      } else if (key === 'view') {
        set({ viewMode: value as ViewMode })
      } else if (key === 'q') {
        set({ searchQuery: value })
      } else if (key === 'price_min') {
        priceRange.min = parseFloat(value)
      } else if (key === 'price_max') {
        priceRange.max = parseFloat(value)
      } else {
        filters[key] = value.split(',')
      }
    })
    
    if (Object.keys(priceRange).length > 0) {
      set({ priceRange })
    }
    
    if (Object.keys(filters).length > 0) {
      set({ filters })
    }
    
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
    
    Object.entries(state.filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params.set(key, values.join(','))
      }
    })
    
    if (state.sortBy !== 'popularity') {
      params.set('sortBy', state.sortBy)
    }
    
    if (state.page > 1) {
      params.set('page', state.page.toString())
    }
    
    if (state.viewMode !== 'grid') {
      params.set('view', state.viewMode)
    }
    
    if (state.searchQuery) {
      params.set('q', state.searchQuery)
    }
    
    if (state.priceRange.min !== undefined) {
      params.set('price_min', state.priceRange.min.toString())
    }
    
    if (state.priceRange.max !== undefined) {
      params.set('price_max', state.priceRange.max.toString())
    }
    
    return params
  }
}))