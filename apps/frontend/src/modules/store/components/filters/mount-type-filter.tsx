"use client"

import FilterGroup from "./filter-group"
import { MOUNT_TYPE_OPTIONS } from "../../types/filters"

interface MountTypeFilterProps {
  availableOptions?: Array<{
    value: string
    label: string
    count?: number
  }>
}

export default function MountTypeFilter({ availableOptions }: MountTypeFilterProps) {
  const options = availableOptions || MOUNT_TYPE_OPTIONS

  return (
    <FilterGroup
      filterKey="mount_type"
      title="Mount Type"
      options={options}
      type="multiple"
      showCount={true}
      maxHeight="max-h-64"
    />
  )
}