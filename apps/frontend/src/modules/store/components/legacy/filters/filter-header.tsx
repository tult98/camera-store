import { FacetAggregation, ApiFilters } from "@camera-store/shared-types"

interface FilterHeaderProps {
  facet: FacetAggregation
  filters: ApiFilters
  isCollapsed: boolean
  onToggle: () => void
}

export default function FilterHeader({ 
  facet, 
  filters, 
  isCollapsed, 
  onToggle 
}: FilterHeaderProps) {
  const getActiveFilterInfo = () => {
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

    return { hasActiveFilter, activeCount }
  }

  const { hasActiveFilter, activeCount } = getActiveFilterInfo()

  return (
    <button
      onClick={onToggle}
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
        {hasActiveFilter && (
          <span className="badge badge-primary badge-sm">
            {facet.display_type === "slider" ||
            facet.aggregation_type === "range"
              ? "✓"
              : activeCount}
          </span>
        )}
      </span>
      <span className="text-lg">{isCollapsed ? "+" : "-"}</span>
    </button>
  )
}