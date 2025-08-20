"use client"

import FilterGroup from "./filter-group"
import { VIDEO_CAPABILITY_OPTIONS } from "../../types/filters"

interface VideoCapabilityFilterProps {
  availableOptions?: Array<{
    value: string
    label: string
    count?: number
  }>
}

export default function VideoCapabilityFilter({ availableOptions }: VideoCapabilityFilterProps) {
  const options = availableOptions || VIDEO_CAPABILITY_OPTIONS

  return (
    <FilterGroup
      filterKey="video_capability"
      title="Video Capability"
      options={options}
      type="multiple"
      showCount={true}
    />
  )
}