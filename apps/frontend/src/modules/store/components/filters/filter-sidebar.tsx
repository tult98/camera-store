"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { FacetAggregation } from "@camera-store/shared-types"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"
import FilterGroup from "./filter-group"

interface FilterSidebarProps {
  facets: FacetAggregation[]
  loading?: boolean
  refetch?: () => void
}

export default function FilterSidebar({
  facets,
  loading = false,
  refetch,
}: FilterSidebarProps) {
  const { searchQuery, setSearchQuery, clearAllFilters } =
    useCategoryFilterStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch?.()
  }

  return (
    <div className="w-80 bg-base-100 border-r border-base-300 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-base-300 bg-base-200/30">
        <h3 className="font-bold text-xl text-base-content mb-1">
          Refine Results
        </h3>
        <p className="text-sm text-base-content/70">
          Filter by specifications and features
        </p>
        <form onSubmit={handleSearch} className="mt-4">
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
          ) : Array.isArray(facets) && facets.length > 0 ? (
            facets.map((facet) => {
              try {
                return <FilterGroup key={facet.facet_key} facet={facet} />
              } catch (error) {
                console.error("Error rendering FilterGroup:", error, facet)
                return (
                  <div key={facet.facet_key} className="p-4 text-red-500">
                    Error rendering filter:{" "}
                    {facet.facet_label || facet.facet_key}
                  </div>
                )
              }
            })
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
      <div className="p-6 border-t border-base-300 bg-base-200/30">
        <button
          className="btn btn-outline btn-block hover:btn-primary transition-all duration-200"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}
