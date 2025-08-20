"use client"

import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import BrandFilter from "./brand-filter"
import PriceRangeFilter from "./price-range-filter"
import AvailabilityFilter from "./availability-filter"
import SensorSizeFilter from "./sensor-size-filter"
import VideoCapabilityFilter from "./video-capability-filter"
import MountTypeFilter from "./mount-type-filter"
import MegapixelRangeFilter from "./megapixel-range-filter"

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  availableBrands?: Array<{
    value: string
    label: string
    count?: number
  }>
  categoryType?: 'cameras' | 'lenses' | 'accessories'
  showSearch?: boolean
}

export default function FilterDrawer({ 
  isOpen,
  onClose,
  availableBrands = [],
  categoryType = 'cameras',
  showSearch = true
}: FilterDrawerProps) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  // Count active filters for the apply button
  useEffect(() => {
    let count = 0
    
    // Count each filter type
    if (searchParams.get("min_price") || searchParams.get("max_price")) count++
    if (searchParams.getAll("brands").length > 0) count += searchParams.getAll("brands").length
    if (searchParams.getAll("sensor_size").length > 0) count += searchParams.getAll("sensor_size").length
    if (searchParams.getAll("video_capability").length > 0) count += searchParams.getAll("video_capability").length
    if (searchParams.getAll("mount_type").length > 0) count += searchParams.getAll("mount_type").length
    if (searchParams.get("min_megapixels") || searchParams.get("max_megapixels")) count++
    if (searchParams.get("in_stock")) count++
    
    setActiveFilterCount(count)
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search:", searchQuery)
  }

  const clearAllFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    
    // Clear all filters
    newSearchParams.delete("min_price")
    newSearchParams.delete("max_price")
    newSearchParams.delete("brands")
    newSearchParams.delete("sensor_size")
    newSearchParams.delete("video_capability")
    newSearchParams.delete("mount_type")
    newSearchParams.delete("min_megapixels")
    newSearchParams.delete("max_megapixels")
    newSearchParams.delete("in_stock")
    newSearchParams.delete("page")
    
    window.history.pushState(null, '', `${window.location.pathname}?${newSearchParams.toString()}`)
    window.location.reload()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-80 bg-base-100 z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="p-4 border-b border-base-300">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in cameras..."
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
        )}

        {/* Filter Content */}
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
            
            {/* Price Filter with slider for mobile */}
            <PriceRangeFilter showSlider={true} />
            
            {/* Availability Filter */}
            <AvailabilityFilter />

            {/* Show More Filters Button */}
            <div className="pt-4">
              <button className="btn btn-ghost btn-block btn-sm text-primary">
                Show More Filters ▼
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-base-300">
          <div className="flex gap-2">
            <button
              onClick={clearAllFilters}
              className="btn btn-ghost btn-sm flex-1"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className={`btn btn-primary btn-sm flex-1 ${activeFilterCount > 0 ? '' : 'btn-disabled'}`}
            >
              Apply ({activeFilterCount})
            </button>
          </div>
        </div>
      </div>
    </>
  )
}