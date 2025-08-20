"use client"

import { useCallback, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface MegapixelRangeFilterProps {
  minMegapixels?: number
  maxMegapixels?: number
}

export default function MegapixelRangeFilter({
  minMegapixels = 1,
  maxMegapixels = 100
}: MegapixelRangeFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [localMin, setLocalMin] = useState<string>(
    searchParams.get("min_megapixels") || ""
  )
  const [localMax, setLocalMax] = useState<string>(
    searchParams.get("max_megapixels") || ""
  )

  const createQueryString = useCallback(
    (params: Record<string, string | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams)
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      })
      
      newSearchParams.delete("page")
      
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const applyFilter = () => {
    const query = createQueryString({
      min_megapixels: localMin || undefined,
      max_megapixels: localMax || undefined,
    })
    router.push(`${pathname}?${query}`)
  }

  const clearFilter = () => {
    setLocalMin("")
    setLocalMax("")
    const query = createQueryString({
      min_megapixels: undefined,
      max_megapixels: undefined,
    })
    router.push(`${pathname}?${query}`)
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "")
    setLocalMin(value)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "")
    setLocalMax(value)
  }

  const hasActiveFilter = searchParams.has("min_megapixels") || searchParams.has("max_megapixels")

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title font-medium">
        Megapixels
        {hasActiveFilter && (
          <span className="ml-2 badge badge-primary badge-sm">Active</span>
        )}
      </div>
      <div className="collapse-content">
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">Minimum MP</span>
            </label>
            <input
              type="text"
              placeholder="1"
              className="input input-bordered input-sm"
              value={localMin}
              onChange={handleMinChange}
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">Maximum MP</span>
            </label>
            <input
              type="text"
              placeholder="100"
              className="input input-bordered input-sm"
              value={localMax}
              onChange={handleMaxChange}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={applyFilter}
              className="btn btn-primary btn-sm flex-1"
            >
              Apply
            </button>
            {hasActiveFilter && (
              <button
                onClick={clearFilter}
                className="btn btn-ghost btn-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}