"use client"

import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline"
import { ViewMode } from "@modules/store/store/category-filter-store"

interface ViewToggleProps {
  viewMode: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
}

export default function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  if (!onViewModeChange) {
    return null
  }

  return (
    <div className="join">
      <button
        onClick={() => onViewModeChange("grid")}
        className={`join-item btn btn-sm ${
          viewMode === "grid" ? "btn-primary" : "btn-outline"
        }`}
        title="Grid view"
      >
        <Squares2X2Icon className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewModeChange("list")}
        className={`join-item btn btn-sm ${
          viewMode === "list" ? "btn-primary" : "btn-outline"
        }`}
        title="List view"
      >
        <ListBulletIcon className="w-4 h-4" />
      </button>
    </div>
  )
}