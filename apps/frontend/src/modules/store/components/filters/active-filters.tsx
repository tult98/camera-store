"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"

interface ActiveFilter {
  key: string
  label: string
  value: string
  displayValue: string
  filterType: 'tags' | 'availability' | 'metadata' | 'price' | 'search'
}

export default function ActiveFilters() {
  const { filters, searchQuery, removeFilter, clearAllFilters, setSearchQuery } = useCategoryFilterStore()

  const handleRemoveFilter = (filter: ActiveFilter) => {
    if (filter.filterType === 'search') {
      setSearchQuery('')
    } else if (filter.filterType === 'price') {
      removeFilter('price', '')
    } else if (filter.filterType === 'tags' || filter.filterType === 'availability') {
      removeFilter(filter.filterType, filter.value)
    } else if (filter.filterType === 'metadata') {
      removeFilter('metadata', filter.key, filter.value)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getActiveFilters = (): ActiveFilter[] => {
    const activeFilters: ActiveFilter[] = []

    // Search query
    if (searchQuery) {
      activeFilters.push({
        key: 'search',
        label: 'Search',
        value: searchQuery,
        displayValue: `Search: "${searchQuery}"`,
        filterType: 'search'
      })
    }

    // Price filter
    if (filters.price) {
      let priceLabel = 'Price: '
      if (filters.price.min && filters.price.max) {
        priceLabel += `${formatPrice(filters.price.min)} - ${formatPrice(filters.price.max)}`
      } else if (filters.price.min) {
        priceLabel += `From ${formatPrice(filters.price.min)}`
      } else if (filters.price.max) {
        priceLabel += `Up to ${formatPrice(filters.price.max)}`
      }
      
      activeFilters.push({
        key: 'price',
        label: 'Price',
        value: 'price_range',
        displayValue: priceLabel,
        filterType: 'price'
      })
    }

    // Tags filter
    if (filters.tags) {
      filters.tags.forEach(tag => {
        activeFilters.push({
          key: 'tags',
          label: 'Use Case',
          value: tag,
          displayValue: tag.charAt(0).toUpperCase() + tag.slice(1),
          filterType: 'tags'
        })
      })
    }

    // Availability filter
    if (filters.availability) {
      filters.availability.forEach(availability => {
        activeFilters.push({
          key: 'availability',
          label: 'Availability',
          value: availability,
          displayValue: availability === 'in-stock' ? 'In Stock' : availability === 'pre-order' ? 'Pre-Order' : 'Used',
          filterType: 'availability'
        })
      })
    }

    // Metadata filters
    if (filters.metadata) {
      Object.entries(filters.metadata).forEach(([key, values]) => {
        values.forEach(value => {
          const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          const formattedValue = value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          
          activeFilters.push({
            key,
            label: formattedKey,
            value,
            displayValue: formattedValue,
            filterType: 'metadata'
          })
        })
      })
    }

    return activeFilters
  }

  const activeFilters = getActiveFilters()

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-base-content/70">Active filters:</span>
        {activeFilters.map((filter, index) => (
          <div key={`${filter.key}-${filter.value}-${index}`} className="badge badge-primary gap-1">
            <span className="text-xs">{filter.displayValue}</span>
            <button
              onClick={() => handleRemoveFilter(filter)}
              className="btn btn-ghost btn-circle btn-xs hover:bg-primary-focus"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
        {activeFilters.length > 1 && (
          <button
            onClick={clearAllFilters}
            className="btn btn-ghost btn-sm text-xs"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  )
}