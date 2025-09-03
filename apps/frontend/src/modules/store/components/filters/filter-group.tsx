"use client"

import { FacetAggregation } from "@camera-store/shared-types"
import { useCategoryFilterStore } from "@modules/store/store/category-filter-store"
import { useState } from "react"
import FilterHeader from "./filter-header"
import CheckboxFilter from "./checkbox-filter"
import RadioFilter from "./radio-filter"
import DropdownFilter from "./dropdown-filter"
import ToggleFilter from "./toggle-filter"
import SliderFilter from "./slider-filter"

interface FilterGroupProps {
  facet: FacetAggregation
  facetsLoading?: boolean
}

export default function FilterGroup({ facet, facetsLoading = false }: FilterGroupProps) {
  const { filters, toggleFilter, removeFilter, setPriceRange } =
    useCategoryFilterStore()
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (!facet || !facet.facet_key) {
    return null
  }

  const renderFilterContent = () => {
    if (facet.display_type === "checkbox") {
      return (
        <CheckboxFilter
          facet={facet}
          filters={filters}
          onToggleFilter={toggleFilter}
          facetsLoading={facetsLoading}
        />
      )
    }

    if (facet.display_type === "radio") {
      return (
        <RadioFilter
          facet={facet}
          filters={filters}
          onToggleFilter={toggleFilter}
          onRemoveFilter={removeFilter}
          facetsLoading={facetsLoading}
        />
      )
    }

    if (facet.display_type === "dropdown") {
      return (
        <DropdownFilter
          facet={facet}
          filters={filters}
          onToggleFilter={toggleFilter}
          onRemoveFilter={removeFilter}
          facetsLoading={facetsLoading}
        />
      )
    }

    if (facet.display_type === "toggle") {
      return (
        <ToggleFilter
          facet={facet}
          filters={filters}
          onToggleFilter={toggleFilter}
          facetsLoading={facetsLoading}
        />
      )
    }

    if (facet.display_type === "slider" || facet.aggregation_type === "range") {
      return (
        <SliderFilter
          facet={facet}
          filters={filters}
          onSetPriceRange={setPriceRange}
        />
      )
    }

    return null
  }

  return (
    <div className="border-b border-base-300 last:border-b-0">
      <FilterHeader
        facet={facet}
        filters={filters}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {!isCollapsed && (
        <div
          className="px-4 pb-4"
          id={`filter-group-${facet.facet_key}`}
          role="region"
          aria-labelledby={`filter-header-${facet.facet_key}`}
        >
{renderFilterContent()}
        </div>
      )}
    </div>
  )
}
