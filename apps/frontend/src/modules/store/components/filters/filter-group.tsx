"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FilterOption } from "../../types/filters"

interface FilterGroupProps {
  filterKey: string
  title: string
  options: FilterOption[]
  type?: 'single' | 'multiple'
  showCount?: boolean
  maxHeight?: string
  searchable?: boolean
}

export default function FilterGroup({
  filterKey,
  title,
  options,
  type = 'multiple',
  showCount = true,
  maxHeight = 'max-h-48',
  searchable = false
}: FilterGroupProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getSelectedValues = () => {
    if (type === 'single') {
      const value = searchParams.get(filterKey)
      return value ? [value] : []
    } else {
      return searchParams.getAll(filterKey)
    }
  }

  const selectedValues = getSelectedValues()

  const createQueryString = useCallback(
    (values: string[]) => {
      const newSearchParams = new URLSearchParams(searchParams)
      
      newSearchParams.delete(filterKey)
      
      if (values.length > 0) {
        if (type === 'single') {
          newSearchParams.set(filterKey, values[0])
        } else {
          values.forEach(value => {
            newSearchParams.append(filterKey, value)
          })
        }
      }
      
      newSearchParams.delete("page")
      
      return newSearchParams.toString()
    },
    [searchParams, filterKey, type]
  )

  const handleValueToggle = (value: string) => {
    let newValues: string[]
    
    if (type === 'single') {
      newValues = selectedValues.includes(value) ? [] : [value]
    } else {
      if (selectedValues.includes(value)) {
        newValues = selectedValues.filter(v => v !== value)
      } else {
        newValues = [...selectedValues, value]
      }
    }
    
    const query = createQueryString(newValues)
    router.push(`${pathname}?${query}`)
  }

  const clearFilter = () => {
    const query = createQueryString([])
    router.push(`${pathname}?${query}`)
  }

  const hasActiveFilter = selectedValues.length > 0

  if (options.length === 0) {
    return null
  }

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title font-medium">
        {title}
        {hasActiveFilter && (
          <span className="ml-2 badge badge-primary badge-sm">
            {selectedValues.length}
          </span>
        )}
      </div>
      <div className="collapse-content">
        <div className="space-y-2">
          <div className={`${maxHeight} overflow-y-auto space-y-2`}>
            {options.map((option) => (
              <label 
                key={option.value} 
                className="flex items-center gap-2 cursor-pointer hover:bg-base-300 p-1 rounded"
              >
                <input
                  type={type === 'single' ? 'radio' : 'checkbox'}
                  name={type === 'single' ? filterKey : undefined}
                  className={`${type === 'single' ? 'radio radio-sm radio-primary' : 'checkbox checkbox-sm checkbox-primary'}`}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleValueToggle(option.value)}
                />
                <span className="text-sm flex-1">{option.label}</span>
                {showCount && option.count !== undefined && (
                  <span className="text-xs text-base-content/60">({option.count})</span>
                )}
              </label>
            ))}
          </div>
          
          {hasActiveFilter && (
            <button
              onClick={clearFilter}
              className="btn btn-ghost btn-sm btn-block"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  )
}