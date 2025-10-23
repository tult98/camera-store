"use client"

import { FacetsResponse } from "@camera-store/shared-types"
import { apiClient } from "@lib/api-client"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"
import { useQuery } from "@tanstack/react-query"
import FilterGroup from "./filter-group"

interface FilterDropdownProps {
  categoryId: string
  activeFilterCount: number
}

const fetchCategoryFacets = async ({
  categoryId,
  filters,
}: {
  categoryId: string
  filters: any
}) => {
  const flattenedFilters = { ...filters }
  if (filters.metadata) {
    Object.entries(filters.metadata).forEach(([key, value]) => {
      flattenedFilters[key] = value
    })
    delete flattenedFilters.metadata
  }

  const facetsRequest = {
    category_id: categoryId,
    applied_filters: flattenedFilters,
    include_counts: true,
  }

  const response = await apiClient<FacetsResponse>("/store/facets/aggregate", {
    method: "POST",
    body: facetsRequest,
  })

  return response
}

export default function FilterDropdown({
  categoryId,
  activeFilterCount,
}: FilterDropdownProps) {
  const { filters } = useCategoryFilterStore()

  const { data: facetsData, isLoading: facetsLoading } =
    useQuery<FacetsResponse>({
      queryKey: ["category-facets", categoryId, JSON.stringify(filters)],
      queryFn: () => fetchCategoryFacets({ categoryId, filters }),
      placeholderData: (previousData) => previousData,
    })

  const facets = facetsData?.facets || []

  return (
    <div className="dropdown-content z-50 bg-base-100 shadow-xl rounded-2xl border border-base-300 p-2 mt-2 w-80">
      <div className="p-2 border-b border-base-300 mb-2">
        <h3 className="font-semibold text-sm text-base-content/80">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 badge badge-primary badge-sm">
              {activeFilterCount}
            </span>
          )}
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {facets.length === 0 ? (
          <div className="p-4 text-center text-sm text-base-content/60">
            No filters available
          </div>
        ) : (
          facets.map((facet) => (
            <FilterGroup
              key={facet.facet_key}
              facet={facet}
              facetsLoading={facetsLoading}
            />
          ))
        )}
      </div>
    </div>
  )
}
