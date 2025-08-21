"use client"

import { Facet, FacetOption } from "@lib/hooks/useCategoryData"
import { useCategoryFilterStore, ApiFilters } from "@modules/store/store/category-filter-store"
import { useState } from "react"

interface FilterGroupProps {
  facet: Facet
}

export default function FilterGroup({ facet }: FilterGroupProps) {
  const { filters, toggleFilter, removeFilter, setPriceRange } = useCategoryFilterStore()
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const getSelectedValues = (): string[] => {
    if (facet.id === 'tags') {
      return filters.tags || []
    } else if (facet.id === 'availability') {
      return filters.availability || []
    } else if (facet.id === 'price') {
      return []
    } else {
      return filters.metadata?.[facet.id] || []
    }
  }

  const selectedValues = getSelectedValues()

  const handleValueToggle = (value: string) => {
    if (facet.id === 'tags' || facet.id === 'availability') {
      toggleFilter(facet.id as keyof ApiFilters, value)
    } else if (facet.id !== 'price') {
      toggleFilter('metadata', facet.id, value)
    }
  }

  const handlePriceSubmit = () => {
    const min = priceMin ? parseFloat(priceMin) : undefined
    const max = priceMax ? parseFloat(priceMax) : undefined
    setPriceRange({ min, max })
  }

  const clearFilter = () => {
    if (facet.id === 'tags' || facet.id === 'availability') {
      removeFilter(facet.id as keyof ApiFilters, '')
    } else if (facet.id === 'price') {
      removeFilter('price', '')
      setPriceMin('')
      setPriceMax('')
    } else {
      removeFilter('metadata', facet.id)
    }
  }

  const hasActiveFilter = facet.type === 'range' 
    ? (filters.price?.min !== undefined || filters.price?.max !== undefined)
    : selectedValues.length > 0

  if (facet.type === 'checkbox' && Array.isArray(facet.options) && facet.options.length === 0) {
    return null
  }

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title font-medium">
        {facet.label}
        {hasActiveFilter && (
          <span className="ml-2 badge badge-primary badge-sm">
            {facet.type === 'range' ? '✓' : selectedValues.length}
          </span>
        )}
      </div>
      <div className="collapse-content">
        <div className="space-y-2">
          {facet.type === 'range' && typeof facet.options === 'object' && 'min' in facet.options ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label label-text-sm">Min Price</label>
                  <input
                    type="number"
                    placeholder={facet.options.min.toString()}
                    className="input input-bordered input-sm w-full"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label label-text-sm">Max Price</label>
                  <input
                    type="number"
                    placeholder={facet.options.max.toString()}
                    className="input input-bordered input-sm w-full"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handlePriceSubmit}
                className="btn btn-primary btn-sm btn-block"
              >
                Apply Price Range
              </button>
              {hasActiveFilter && (
                <button
                  onClick={clearFilter}
                  className="btn btn-ghost btn-sm btn-block"
                >
                  Clear Price Filter
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {Array.isArray(facet.options) && facet.options.map((option: FacetOption) => (
                  <label 
                    key={option.value} 
                    className="flex items-center gap-2 cursor-pointer hover:bg-base-300 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary"
                      checked={selectedValues.includes(option.value)}
                      onChange={() => handleValueToggle(option.value)}
                    />
                    <span className="text-sm flex-1">{option.label}</span>
                    <span className="text-xs text-base-content/60">({option.count})</span>
                  </label>
                ))}
              </div>
              
              {hasActiveFilter && (
                <button
                  onClick={clearFilter}
                  className="btn btn-ghost btn-sm btn-block"
                >
                  Clear
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}