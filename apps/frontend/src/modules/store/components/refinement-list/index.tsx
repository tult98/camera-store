"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import BrandFilter from "../filters/brand-filter"
import PriceRangeFilter from "../filters/price-range-filter"
import AvailabilityFilter from "../filters/availability-filter"
import SensorSizeFilter from "../filters/sensor-size-filter"
import VideoCapabilityFilter from "../filters/video-capability-filter"
import MountTypeFilter from "../filters/mount-type-filter"
import MegapixelRangeFilter from "../filters/megapixel-range-filter"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
  availableBrands?: Array<{
    value: string
    label: string
    count?: number
  }>
  categoryType?: 'cameras' | 'lenses' | 'accessories'
}

const RefinementList = ({ 
  sortBy, 
  'data-testid': dataTestId,
  availableBrands = [],
  categoryType = 'cameras'
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Sort Products */}
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} {...(dataTestId && { "data-testid": dataTestId })} />
        
        {/* Brand Filter */}
        {availableBrands.length > 0 && (
          <BrandFilter availableBrands={availableBrands} />
        )}
        
        {/* Camera/Lens specific filters */}
        {(categoryType === 'cameras' || categoryType === 'lenses') && (
          <>
            <SensorSizeFilter />
            <MegapixelRangeFilter />
            <VideoCapabilityFilter />
            <MountTypeFilter />
          </>
        )}
        
        {/* Price Filter */}
        <PriceRangeFilter />
        
        {/* Availability Filter */}
        <AvailabilityFilter />
      </div>
    </div>
  )
}

export default RefinementList
