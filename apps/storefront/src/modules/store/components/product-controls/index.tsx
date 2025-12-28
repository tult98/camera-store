"use client"

import { FunnelIcon } from "@heroicons/react/24/outline"
import FilterDropdown from "../filter-dropdown"
import SortDropdown from "../sort-dropdown"
import ViewToggle from "../product-grid/view-toggle"

interface ProductControlsProps {
  pagination: {
    currentPage: number
    totalPages: number
    limit: number
    total: number
  } | null
  activeFilterCount: number
  categoryId: string
  sortBy: string
  viewMode: "grid" | "list"
  onSortChange: (sortBy: string) => void
  onViewModeChange: (viewMode: "grid" | "list") => void
  isLoading?: boolean
}

const ProductControls = ({
  pagination,
  activeFilterCount,
  categoryId,
  sortBy,
  viewMode,
  onSortChange,
  onViewModeChange,
  isLoading = false,
}: ProductControlsProps) => {
  return (
    <div className="bg-base-200/30 rounded-2xl p-4 mb-6 border border-base-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-5 bg-base-300 rounded w-40 animate-pulse"></div>
          ) : (
            pagination && (
              <div>
                <p className="text-sm font-medium text-base-content">
                  {pagination.total === 0
                    ? `0 results found`
                    : `Showing ${
                        (pagination.currentPage - 1) * pagination.limit + 1
                      }–${Math.min(
                        pagination.currentPage * pagination.limit,
                        pagination.total
                      )} of ${pagination.total}`}
                </p>
              </div>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline btn-primary hover:btn-primary transition-all duration-200 gap-2"
              aria-label="Filter products"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>
                Filter
                {activeFilterCount > 0 && ` (${activeFilterCount})`}
              </span>
            </div>
            <FilterDropdown
              categoryId={categoryId}
              activeFilterCount={activeFilterCount}
            />
          </div>
          <div className="flex-1 lg:flex-initial">
            <SortDropdown sortBy={sortBy as any} onSortChange={onSortChange} />
          </div>
          <div className="hidden lg:block">
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductControls
