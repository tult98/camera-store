"use client"

import { useState } from "react"
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"
import FilterDrawer from "@modules/store/components/filters/filter-drawer"

interface MobileFilterControlsProps {
  availableBrands?: Array<{
    value: string
    label: string
    count?: number
  }>
  categoryType?: 'cameras' | 'lenses' | 'accessories'
}

export default function MobileFilterControls({
  availableBrands = [],
  categoryType = 'cameras'
}: MobileFilterControlsProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="block small:hidden mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="btn btn-primary btn-sm gap-2"
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        availableBrands={availableBrands}
        categoryType={categoryType}
      />
    </>
  )
}