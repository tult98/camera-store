"use client"

import {
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline"
import { FacetAggregation } from "@camera-store/shared-types"
import { useDebounce } from "@lib/hooks/use-debounce"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"
import { useEffect, useRef, useState } from "react"
import FilterGroup from "./filter-group"

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  facets: FacetAggregation[]
  loading?: boolean
  facetsLoading?: boolean
}

export default function FilterDrawer({
  isOpen,
  onClose,
  facets,
  loading = false,
  facetsLoading = false,
}: FilterDrawerProps) {
  const { searchQuery, setSearchQuery, clearAllFilters, filters } = useCategoryFilterStore()
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

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.tags?.length) count += filters.tags.length
    if (filters.availability?.length) count += filters.availability.length
    if (filters.price?.min !== undefined || filters.price?.max !== undefined)
      count++
    if (filters.metadata) {
      Object.values(filters.metadata).forEach((values) => {
        if (values?.length) count += values.length
      })
    }
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-80 bg-base-100 z-50 lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex-1 mr-4">
            <form onSubmit={handleSearch} role="search">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search product names..."
                  className="input input-primary w-full pr-12 bg-base-100"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  aria-describedby="mobile-search-help"
                  aria-label="Search products by name within this category"
                />
                <div id="mobile-search-help" className="sr-only">
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
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content"
            aria-label="Close filter panel"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="skeleton h-4 w-24"></div>
                    <div className="space-y-1">
                      <div className="skeleton h-3 w-full"></div>
                      <div className="skeleton h-3 w-3/4"></div>
                      <div className="skeleton h-3 w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              facets.map((facet) => (
                <FilterGroup key={facet.facet_key} facet={facet} facetsLoading={facetsLoading} />
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4">
          <div className="space-y-3">
            {activeFilterCount > 0 && (
              <div className="text-center">
                <p className="text-sm text-base-content/70">
                  {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
                  applied
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={clearAllFilters}
                className="btn btn-outline btn-primary flex-1 hover:btn-primary"
                disabled={activeFilterCount === 0}
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="btn btn-primary flex-1"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
