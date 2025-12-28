"use client"

import { FunnelIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"

interface EmptyProductStateProps {
  hasActiveFilters: boolean
  hasSearchQuery: boolean
  onClearFilters?: () => void
}

export default function EmptyProductState({
  hasActiveFilters,
  hasSearchQuery,
  onClearFilters,
}: EmptyProductStateProps) {
  const getTitle = () => {
    if (hasSearchQuery && hasActiveFilters) {
      return "No matching products found"
    }
    if (hasSearchQuery) {
      return "No search results"
    }
    if (hasActiveFilters) {
      return "No products match your filters"
    }
    return "No products available"
  }

  const getDescription = () => {
    if (hasSearchQuery && hasActiveFilters) {
      return "Try adjusting your search terms or clearing some filters to find what you're looking for."
    }
    if (hasSearchQuery) {
      return "We couldn't find any products matching your search. Try different keywords or browse our categories."
    }
    if (hasActiveFilters) {
      return "Your current filter combination doesn't match any products. Try removing some filters to see more options."
    }
    return "Check back soon for new camera equipment and accessories."
  }

  const getIcon = () => {
    if (hasSearchQuery) {
      return <MagnifyingGlassIcon className="w-20 h-20 text-primary/30" />
    }
    return <FunnelIcon className="w-20 h-20 text-primary/30" />
  }

  return (
    <div className="w-full min-h-[500px] flex items-center justify-center py-20">
      <div className="card bg-base-200/40 shadow-sm border border-base-300/50 w-full">
        <div className="card-body items-center text-center px-8 py-12">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
            <div className="relative">{getIcon()}</div>
          </div>

          <h3 className="card-title text-2xl font-bold text-base-content mb-3">
            {getTitle()}
          </h3>

          <p className="text-base-content/70 text-base max-w-lg leading-relaxed mb-6">
            {getDescription()}
          </p>

          {(hasActiveFilters || hasSearchQuery) && onClearFilters && (
            <div className="card-actions">
              <button
                onClick={onClearFilters}
                className="btn btn-primary btn-md gap-2"
                aria-label="Clear all filters and search"
              >
                <XMarkIcon className="w-5 h-5" />
                Clear {hasSearchQuery && hasActiveFilters ? "Search & Filters" : hasSearchQuery ? "Search" : "Filters"}
              </button>
            </div>
          )}

          {!hasActiveFilters && !hasSearchQuery && (
            <div className="mt-2 text-sm text-base-content/50">
              Browse our categories to discover amazing camera equipment
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
