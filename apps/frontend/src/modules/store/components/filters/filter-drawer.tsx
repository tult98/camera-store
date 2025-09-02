"use client"

import {
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline"
import { FacetAggregation } from "@camera-store/shared-types"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"
import FilterGroup from "./filter-group"

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  facets: FacetAggregation[]
  loading?: boolean
}

export default function FilterDrawer({
  isOpen,
  onClose,
  facets,
  loading = false,
}: FilterDrawerProps) {
  const { searchQuery, setSearchQuery, clearAllFilters, filters } =
    useCategoryFilterStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality handled by the store
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
        <div className="flex items-center justify-between p-6 border-b border-base-300 bg-base-200/30">
          <div className="flex items-center gap-3">
            <FunnelIcon className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-lg text-base-content">
                Refine Results
              </h3>
              <p className="text-xs text-base-content/70">
                Find your perfect camera
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-base-300">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search within category..."
                className="input input-bordered w-full pr-12 bg-base-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle hover:bg-primary hover:text-primary-content"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
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
                <FilterGroup key={facet.facet_key} facet={facet} />
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-base-300 bg-base-200/30">
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
                className="btn btn-ghost flex-1 hover:btn-error transition-all duration-200"
                disabled={activeFilterCount === 0}
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="btn btn-primary flex-1 shadow-lg"
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
