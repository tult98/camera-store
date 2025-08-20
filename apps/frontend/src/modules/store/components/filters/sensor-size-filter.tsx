"use client"

import FilterGroup from "./filter-group"
import { SENSOR_SIZE_OPTIONS } from "../../types/filters"

interface SensorSizeFilterProps {
  availableOptions?: Array<{
    value: string
    label: string
    count?: number
  }>
}

export default function SensorSizeFilter({ availableOptions }: SensorSizeFilterProps) {
  const options = availableOptions || SENSOR_SIZE_OPTIONS

  return (
    <FilterGroup
      filterKey="sensor_size"
      title="Sensor Size"
      options={options}
      type="multiple"
      showCount={true}
    />
  )
}