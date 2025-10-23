import { FacetAggregation, ApiFilters } from "@camera-store/shared-types"

interface RadioFilterProps {
  facet: FacetAggregation
  filters: ApiFilters
  onToggleFilter: (filterType: keyof ApiFilters, key: string, value?: string) => void
  onRemoveFilter: (filterType: keyof ApiFilters, key: string, value?: string) => void
  facetsLoading?: boolean
}

export default function RadioFilter({ 
  facet, 
  filters, 
  onToggleFilter,
  onRemoveFilter,
  facetsLoading = false
}: RadioFilterProps) {
  if (!Array.isArray(facet.values)) return null

  const isOptionSelected = (value: string) => {
    if (facet.facet_key === "tags") {
      return filters.tags?.includes(value) || false
    } else if (facet.facet_key === "availability") {
      return filters.availability?.includes(value) || false
    } else {
      return filters.metadata?.[facet.facet_key]?.includes(value) || false
    }
  }

  const handleToggle = (value: string) => {
    try {
      if (facet.facet_key === "tags" || facet.facet_key === "availability") {
        onRemoveFilter(facet.facet_key as keyof ApiFilters, value)
        onToggleFilter(facet.facet_key as keyof ApiFilters, value)
      } else {
        onRemoveFilter("metadata" as keyof ApiFilters, facet.facet_key)
        onToggleFilter("metadata" as keyof ApiFilters, facet.facet_key, value)
      }
    } catch (error) {
      console.error("Error toggling filter:", error)
    }
  }

  return (
    <div className="space-y-1 mt-3">
      {facet.values.map((option) => (
        <label
          key={String(option.value)}
          className="flex items-center gap-3 cursor-pointer hover:bg-base-200/50 p-2 rounded-lg transition-colors group"
        >
          <input
            type="radio"
            name={`filter-${facet.facet_key}`}
            className="radio radio-sm radio-primary"
            checked={isOptionSelected(String(option.value))}
            onChange={() => handleToggle(String(option.value))}
          />
          <span className="text-sm flex-1 group-hover:text-primary transition-colors">
            {option.label}
          </span>
          {facetsLoading ? (
            <div className="skeleton text-xs px-2 py-1 rounded-full font-medium h-5 min-w-[2rem]"></div>
          ) : (
            <span className="text-xs px-2 py-1 bg-base-300 text-base-content/70 rounded-full font-medium min-w-[2rem] h-5 flex items-center justify-center">
              {option.count}
            </span>
          )}
        </label>
      ))}
    </div>
  )
}