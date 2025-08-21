"use client"

import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { SortOption } from "@modules/store/store/category-filter-store"

interface SortDropdownProps {
  sortBy: SortOption
  onSortChange: (sortBy: SortOption) => void
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popularity", label: "Most Popular" },
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
  { value: "rating", label: "Highest Rated" },
]

export default function SortDropdown({ sortBy, onSortChange }: SortDropdownProps) {
  const currentSort = sortOptions.find(option => option.value === sortBy)

  return (
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-outline btn-sm gap-1"
      >
        <span className="text-sm">Sort: {currentSort?.label}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </div>
      <ul 
        tabIndex={0} 
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-64"
      >
        {sortOptions.map((option) => (
          <li key={option.value}>
            <button
              onClick={() => onSortChange(option.value)}
              className={`w-full text-left ${
                sortBy === option.value ? "active" : ""
              }`}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}