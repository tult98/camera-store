"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Facet } from "@lib/hooks/useCategoryData"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"
import { useState } from "react"
import FilterGroup from "./filter-group"

interface FilterSidebarProps {
  facets: Facet[]
  loading?: boolean
  refetch?: () => void
}

export default function FilterSidebar({ 
  facets,
  loading = false,
  refetch
}: FilterSidebarProps) {
  const { searchQuery, setSearchQuery, clearAllFilters } = useCategoryFilterStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    refetch?.()
  }

  return (
    <div className="w-80 bg-base-100 border-r border-base-300 h-full">
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <h3 className="font-semibold text-lg">Filters</h3>
        <form onSubmit={handleSearch} className="mt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search in category..."
              className="input input-bordered input-sm w-full pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-xs"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Filter Groups */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
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
              <FilterGroup
                key={facet.id}
                facet={facet}
              />
            ))
          )}
        </div>
      </div>

      {/* Clear All Button */}
      <div className="p-4 border-t border-base-300">
        <button 
          className="btn btn-outline btn-block btn-sm"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}