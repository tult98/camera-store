"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import BrandFilter from "./brand-filter"
import PriceRangeFilter from "./price-range-filter"
import AvailabilityFilter from "./availability-filter"
import SensorSizeFilter from "./sensor-size-filter"
import VideoCapabilityFilter from "./video-capability-filter"
import MountTypeFilter from "./mount-type-filter"
import MegapixelRangeFilter from "./megapixel-range-filter"
import ActiveFilters from "./active-filters"

interface FilterSidebarProps {
  availableBrands?: Array<{
    value: string
    label: string
    count?: number
  }>
  categoryType?: 'cameras' | 'lenses' | 'accessories'
  showSearch?: boolean
}

export default function FilterSidebar({ 
  availableBrands = [],
  categoryType = 'cameras',
  showSearch = true
}: FilterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Search:", searchQuery)
  }

  return (
    <div className="w-80 bg-base-100 border-r border-base-300 h-full">
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <h3 className="font-semibold text-lg">Filters</h3>
        {showSearch && (
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
        )}
      </div>

      {/* Active Filters */}
      <div className="p-4">
        <ActiveFilters />
      </div>

      {/* Filter Groups */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Brand Filter */}
          <BrandFilter availableBrands={availableBrands} />
          
          {/* Camera-specific filters */}
          {(categoryType === 'cameras' || categoryType === 'lenses') && (
            <>
              <SensorSizeFilter />
              <MegapixelRangeFilter />
              <VideoCapabilityFilter />
              <MountTypeFilter />
            </>
          )}
          
          {/* Price Filter */}
          <PriceRangeFilter showSlider={false} />
          
          {/* Availability Filter */}
          <AvailabilityFilter />
        </div>
      </div>

      {/* Clear All Button */}
      <div className="p-4 border-t border-base-300">
        <button className="btn btn-outline btn-block btn-sm">
          Clear All Filters
        </button>
      </div>
    </div>
  )
}