"use client"

import { FacetAggregation } from "@camera-store/shared-types"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"
import { useState, useEffect, useCallback } from "react"

interface FilterGroupProps {
  facet: FacetAggregation
}

export default function FilterGroup({ facet }: FilterGroupProps) {
  const { filters, toggleFilter, removeFilter, setPriceRange } =
    useCategoryFilterStore()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [priceMin, setPriceMin] = useState<number>(0)
  const [priceMax, setPriceMax] = useState<number>(0)

  // Initialize price range values from facet data
  useEffect(() => {
    if (facet.range) {
      setPriceMin(filters.price?.min ?? facet.range.min)
      setPriceMax(filters.price?.max ?? facet.range.max)
    }
  }, [facet.range, filters.price])

  const formatPriceForInput = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handlePriceChange = useCallback(() => {
    try {
      if (facet.range) {
        const min = priceMin > facet.range.min ? priceMin : undefined
        const max = priceMax < facet.range.max ? priceMax : undefined
        setPriceRange({ min, max })
      }
    } catch (error) {
      console.error("Error updating price range:", error)
    }
  }, [facet.range, priceMin, priceMax, setPriceRange])

  if (!facet || !facet.facet_key) {
    return null
  }

  return (
    <div className="border-b border-base-300 last:border-b-0">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 text-left font-medium text-base-content hover:bg-base-200/50 hover:cursor-pointer transition-colors"
        aria-expanded={!isCollapsed}
        aria-controls={`filter-group-${facet.facet_key}`}
        aria-label={`Toggle ${facet.facet_label} filter options`}
      >
        <span
          className="flex items-center gap-2"
          id={`filter-header-${facet.facet_key}`}
        >
          {facet.facet_label}
          {(() => {
            // Check for active filters
            let hasActiveFilter = false
            let activeCount = 0

            if (
              facet.display_type === "slider" ||
              facet.aggregation_type === "range"
            ) {
              hasActiveFilter =
                filters.price?.min !== undefined ||
                filters.price?.max !== undefined
            } else if (facet.facet_key === "tags") {
              activeCount = filters.tags?.length || 0
              hasActiveFilter = activeCount > 0
            } else if (facet.facet_key === "availability") {
              activeCount = filters.availability?.length || 0
              hasActiveFilter = activeCount > 0
            } else {
              activeCount = filters.metadata?.[facet.facet_key]?.length || 0
              hasActiveFilter = activeCount > 0
            }

            if (hasActiveFilter) {
              return (
                <span className="badge badge-primary badge-sm">
                  {facet.display_type === "slider" ||
                  facet.aggregation_type === "range"
                    ? "✓"
                    : activeCount}
                </span>
              )
            }
            return null
          })()}
        </span>
        <span className="text-lg">{isCollapsed ? "+" : "-"}</span>
      </button>

      {!isCollapsed && (
        <div
          className="px-4 pb-4"
          id={`filter-group-${facet.facet_key}`}
          role="region"
          aria-labelledby={`filter-header-${facet.facet_key}`}
        >
          {facet.display_type === "checkbox" && Array.isArray(facet.values) && (
            <div className="space-y-1 mt-3">
              {facet.values.map((option) => {
                const isSelected = (() => {
                  if (facet.facet_key === "tags") {
                    return filters.tags?.includes(String(option.value)) || false
                  } else if (facet.facet_key === "availability") {
                    return (
                      filters.availability?.includes(String(option.value)) ||
                      false
                    )
                  } else {
                    return (
                      filters.metadata?.[facet.facet_key]?.includes(
                        String(option.value)
                      ) || false
                    )
                  }
                })()

                return (
                  <label
                    key={String(option.value)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-base-200/50 p-2 rounded-lg transition-colors group"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary"
                      checked={isSelected}
                      onChange={() => {
                        try {
                          if (
                            facet.facet_key === "tags" ||
                            facet.facet_key === "availability"
                          ) {
                            toggleFilter(
                              facet.facet_key as any,
                              String(option.value)
                            )
                          } else {
                            toggleFilter(
                              "metadata",
                              facet.facet_key,
                              String(option.value)
                            )
                          }
                        } catch (error) {
                          console.error("Error toggling filter:", error)
                        }
                      }}
                    />
                    <span className="text-sm flex-1 group-hover:text-primary transition-colors">
                      {option.label}
                    </span>
                    <span className="text-xs px-2 py-1 bg-base-300 text-base-content/70 rounded-full font-medium">
                      {option.count}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {(facet.display_type === "slider" ||
            facet.aggregation_type === "range") &&
            facet.range && (
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
            )}
        </div>
      )}
    </div>
  )
}
