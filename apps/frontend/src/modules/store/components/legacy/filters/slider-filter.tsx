"use client"

import { FacetAggregation, ApiFilters } from "@camera-store/shared-types"
import { useState, useEffect, useCallback } from "react"

interface SliderFilterProps {
  facet: FacetAggregation
  filters: ApiFilters
  onSetPriceRange: (range: { min?: number; max?: number }) => void
}

export default function SliderFilter({ 
  facet, 
  filters, 
  onSetPriceRange 
}: SliderFilterProps) {
  const [priceMin, setPriceMin] = useState<number>(0)
  const [priceMax, setPriceMax] = useState<number>(0)

  if (!facet.range) return null

  useEffect(() => {
    setPriceMin(filters.price?.min ?? facet.range!.min)
    setPriceMax(filters.price?.max ?? facet.range!.max)
  }, [facet.range, filters.price])

  const formatPriceForInput = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handlePriceChange = useCallback(() => {
    try {
      const min = priceMin > facet.range!.min ? priceMin : undefined
      const max = priceMax < facet.range!.max ? priceMax : undefined
      onSetPriceRange({ min, max })
    } catch (error) {
      console.error("Error updating price range:", error)
    }
  }, [facet.range, priceMin, priceMax, onSetPriceRange])

  return (
    <div className="mt-3 space-y-4">
      {/* Dual Range Slider Container */}
      <div className="relative px-2 py-2">
        <div className="relative h-2 flex items-center">
          {/* Track Background */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-gray-300 rounded-full h-2"></div>

          {/* Active Track */}
          <div
            className="absolute top-1/2 -translate-y-1/2 bg-orange-500 rounded-full h-2"
            style={{
              left: `${
                ((priceMin - facet.range.min) /
                  (facet.range.max - facet.range.min)) *
                100
              }%`,
              right: `${
                100 -
                ((priceMax - facet.range.min) /
                  (facet.range.max - facet.range.min)) *
                  100
              }%`,
            }}
          ></div>

          {/* Min Range Input */}
          <input
            type="range"
            min={facet.range.min}
            max={facet.range.max}
            step={facet.range.step || 100}
            value={priceMin}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (value <= priceMax) {
                setPriceMin(value)
              }
            }}
            onMouseUp={handlePriceChange}
            onTouchEnd={handlePriceChange}
            className="range-slider-input"
          />

          {/* Max Range Input */}
          <input
            type="range"
            min={facet.range.min}
            max={facet.range.max}
            step={facet.range.step || 100}
            value={priceMax}
            onChange={(e) => {
              const value = parseInt(e.target.value)
              if (value >= priceMin) {
                setPriceMax(value)
              }
            }}
            onMouseUp={handlePriceChange}
            onTouchEnd={handlePriceChange}
            className="range-slider-input"
          />
        </div>
      </div>

      {/* Price Input Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 text-sm">
            $
          </span>
          <input
            type="text"
            value={formatPriceForInput(priceMin)}
            onChange={(e) => {
              const cleanValue = e.target.value.replace(/,/g, "")
              const value = parseInt(cleanValue) || facet.range!.min
              if (value <= priceMax && value >= facet.range!.min) {
                setPriceMin(value)
              }
            }}
            onBlur={handlePriceChange}
            className="input input-sm w-full px-2 text-orange-500 font-medium border-0 bg-base-100 rounded-lg shadow-sm ring-1 ring-base-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base-content/60 text-lg font-medium">
            -
          </span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60 text-sm">
              $
            </span>
            <input
              type="text"
              value={formatPriceForInput(priceMax)}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/,/g, "")
                const value = parseInt(cleanValue) || facet.range!.max
                if (value >= priceMin && value <= facet.range!.max) {
                  setPriceMax(value)
                }
              }}
              onBlur={handlePriceChange}
              className="input input-sm w-full px-2 text-orange-500 font-medium border-0 bg-base-100 rounded-lg shadow-sm ring-1 ring-base-300"
            />
          </div>
        </div>
      </div>
    </div>
  )
}