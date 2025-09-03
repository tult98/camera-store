"use client"

import { FacetAggregation } from "@camera-store/shared-types"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useDebounce } from "@lib/hooks/use-debounce"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"
import { useEffect, useRef, useState } from "react"
import FilterGroup from "./filter-group"

interface FilterSidebarProps {
  facets: FacetAggregation[]
  loading?: boolean
  facetsLoading?: boolean
  refetch?: () => void
}

export default function FilterSidebar({
  facets,
  loading = false,
  facetsLoading = false,
  refetch,
}: FilterSidebarProps) {
  const { searchQuery, setSearchQuery, clearAllFilters } = useCategoryFilterStore()
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const debouncedSearchQuery = useDebounce(localSearchQuery, 500) // 500ms delay
  const lastGlobalSearch = useRef(searchQuery)

  // Update the global search query when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== lastGlobalSearch.current) {
      setSearchQuery(debouncedSearchQuery)
      lastGlobalSearch.current = debouncedSearchQuery
    }
  }, [debouncedSearchQuery, setSearchQuery])

  // Sync local search with global search when it changes externally (e.g., clear all filters)
  useEffect(() => {
    if (searchQuery !== lastGlobalSearch.current) {
      setLocalSearchQuery(searchQuery)
      lastGlobalSearch.current = searchQuery
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Immediately update the debounced value to trigger search
    setSearchQuery(localSearchQuery)
  }

  return (
    <div className="w-80 bg-base-100 border-r border-base-300 h-full flex flex-col">
      {/* Search */}
      <div className="p-4">
        <form onSubmit={handleSearch} role="search">
          <div className="relative">
            <input
              type="text"
              placeholder="Search product names..."
              className="input input-primary w-full pr-12 bg-base-100"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              aria-describedby="search-help"
              aria-label="Search products by name within this category"
            />
            <div id="search-help" className="sr-only">
              Search results will update automatically as you type
            </div>
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-primary-content"
              aria-label="Search products"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
        {/* Live region for search feedback */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {localSearchQuery && `Searching for "${localSearchQuery}"`}
        </div>
      </div>

      {/* Filter Groups */}
      <div className="flex-1 overflow-y-auto">
        <div className="">
          {loading ? (
            <div className="p-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border-b border-base-300 p-4 space-y-3">
                  <div className="skeleton h-5 w-32"></div>
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-full"></div>
                    <div className="skeleton h-4 w-5/6"></div>
                    <div className="skeleton h-4 w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : facets.length > 0 ? (
            facets.map((facet) => (
              <FilterGroup key={facet.facet_key} facet={facet} facetsLoading={facetsLoading} />
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-base-content/60">
                No filters available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Clear All Button */}
      <div className="p-4">
        <button
          className="btn btn-outline btn-primary btn-block hover:btn-primary"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}
