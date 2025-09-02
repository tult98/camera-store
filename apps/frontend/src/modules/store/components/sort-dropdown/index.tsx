"use client"

import { ChevronDownIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline"
import { SortOption } from "@modules/store/store/category-filter-store"

interface SortDropdownProps {
  sortBy: SortOption
  onSortChange: (sortBy: SortOption) => void
}

const sortOptions: { value: SortOption; label: string; description?: string }[] = [
  { value: "popularity", label: "Most Popular", description: "Best sellers first" },
  { value: "newest", label: "Latest Arrivals", description: "Newest products first" },
  { value: "price_asc", label: "Price: Low to High", description: "Budget-friendly first" },
  { value: "price_desc", label: "Price: High to Low", description: "Premium equipment first" },
  { value: "name_asc", label: "Name: A to Z", description: "Alphabetical order" },
  { value: "name_desc", label: "Name: Z to A", description: "Reverse alphabetical" },
  { value: "rating", label: "Top Rated", description: "Customer favorites" },
]

export default function SortDropdown({ sortBy, onSortChange }: SortDropdownProps) {
  const currentSort = sortOptions.find(option => option.value === sortBy)

  return (
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-outline hover:btn-primary transition-all duration-200 gap-2 min-w-[200px] justify-between"
      >
        <div className="flex items-center gap-2">
          <Bars3BottomLeftIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Sort: {currentSort?.label}</span>
        </div>
        <ChevronDownIcon className="w-4 h-4" />
      </div>
      <div className="dropdown-content z-50 bg-base-100 shadow-xl rounded-2xl border border-base-300 p-2 mt-2 w-72">
        <div className="p-2 border-b border-base-300 mb-2">
          <h3 className="font-semibold text-sm text-base-content/80">Sort Products By</h3>
        </div>
        <ul className="space-y-1">
          {sortOptions.map((option) => (
            <li key={option.value}>
              <button
                onClick={() => onSortChange(option.value)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover:bg-base-200 ${
                  sortBy === option.value 
                    ? "bg-primary/10 text-primary border border-primary/20" 
                    : "hover:bg-base-200/70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-base-content/60 mt-1">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {sortBy === option.value && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}