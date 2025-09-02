import { FacetAggregation, ApiFilters } from "@camera-store/shared-types"

interface ToggleFilterProps {
  facet: FacetAggregation
  filters: ApiFilters
  onToggleFilter: (filterType: keyof ApiFilters, key: string, value?: string) => void
}

export default function ToggleFilter({ 
  facet, 
  filters, 
  onToggleFilter 
}: ToggleFilterProps) {
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
        onToggleFilter(facet.facet_key as keyof ApiFilters, value)
      } else {
        onToggleFilter("metadata" as keyof ApiFilters, facet.facet_key, value)
      }
    } catch (error) {
      console.error("Error toggling filter:", error)
    }
  }

  return (
    <div className="space-y-2 mt-3">
      {facet.values.map((option) => (
        <div
          key={String(option.value)}
          className="flex items-center justify-between p-2 hover:bg-base-200/50 rounded-lg transition-colors group"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm group-hover:text-primary transition-colors">
              {option.label}
            </span>
            <span className="text-xs px-2 py-1 bg-base-300 text-base-content/70 rounded-full font-medium">
              {option.count}
            </span>
          </div>
          <input
            type="checkbox"
            className="toggle toggle-sm toggle-primary"
            checked={isOptionSelected(String(option.value))}
            onChange={() => handleToggle(String(option.value))}
          />
        </div>
      ))}
    </div>
  )
}