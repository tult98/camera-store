import { FacetAggregation, ApiFilters } from "@camera-store/shared-types"

interface DropdownFilterProps {
  facet: FacetAggregation
  filters: ApiFilters
  onToggleFilter: (filterType: keyof ApiFilters, key: string, value?: string) => void
  onRemoveFilter: (filterType: keyof ApiFilters, key: string, value?: string) => void
  facetsLoading?: boolean
}

export default function DropdownFilter({ 
  facet, 
  filters, 
  onToggleFilter,
  onRemoveFilter,
  facetsLoading = false
}: DropdownFilterProps) {
  if (!Array.isArray(facet.values)) return null

  const getCurrentValue = () => {
    if (facet.facet_key === "tags") {
      return filters.tags?.[0] || ""
    } else if (facet.facet_key === "availability") {
      return filters.availability?.[0] || ""
    } else {
      return filters.metadata?.[facet.facet_key]?.[0] || ""
    }
  }

  const handleChange = (value: string) => {
    try {
      if (value === "") {
        if (facet.facet_key === "tags" || facet.facet_key === "availability") {
          const currentValues = filters[facet.facet_key] || []
          currentValues.forEach(val => onRemoveFilter(facet.facet_key as keyof ApiFilters, val))
        } else {
          const currentValues = filters.metadata?.[facet.facet_key] || []
          currentValues.forEach(val => onRemoveFilter("metadata" as keyof ApiFilters, facet.facet_key, val))
        }
      } else {
        if (facet.facet_key === "tags" || facet.facet_key === "availability") {
          const currentValues = filters[facet.facet_key] || []
          currentValues.forEach(val => onRemoveFilter(facet.facet_key as keyof ApiFilters, val))
          onToggleFilter(facet.facet_key as keyof ApiFilters, value)
        } else {
          const currentValues = filters.metadata?.[facet.facet_key] || []
          currentValues.forEach(val => onRemoveFilter("metadata" as keyof ApiFilters, facet.facet_key, val))
          onToggleFilter("metadata" as keyof ApiFilters, facet.facet_key, value)
        }
      }
    } catch (error) {
      console.error("Error updating dropdown filter:", error)
    }
  }

  return (
    <div className="mt-3">
      <select
        className="select select-sm select-bordered w-full"
        value={getCurrentValue()}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">All {facet.facet_label}</option>
        {facet.values.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label} ({facetsLoading ? '...' : option.count})
          </option>
        ))}
      </select>
    </div>
  )
}