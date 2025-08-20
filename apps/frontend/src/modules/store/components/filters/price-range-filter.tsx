"use client"

import { useCallback, useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface PriceRangeFilterProps {
  minPrice?: number
  maxPrice?: number
  step?: number
  showSlider?: boolean
}

export default function PriceRangeFilter({ 
  minPrice = 0, 
  maxPrice = 100000000, 
  step = 100000,
  showSlider = false
}: PriceRangeFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [localMinPrice, setLocalMinPrice] = useState<string>(
    searchParams.get("min_price") || ""
  )
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    searchParams.get("max_price") || ""
  )

  const [sliderMin, setSliderMin] = useState<number>(
    parseInt(searchParams.get("min_price") || minPrice.toString())
  )
  const [sliderMax, setSliderMax] = useState<number>(
    parseInt(searchParams.get("max_price") || maxPrice.toString())
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

  const applyPriceFilter = () => {
    const minVal = showSlider ? sliderMin.toString() : localMinPrice
    const maxVal = showSlider ? sliderMax.toString() : localMaxPrice

    const query = createQueryString({
      min_price: minVal || undefined,
      max_price: maxVal || undefined,
    })
    router.push(`${pathname}?${query}`)
  }

  const clearPriceFilter = () => {
    setLocalMinPrice("")
    setLocalMaxPrice("")
    setSliderMin(minPrice)
    setSliderMax(maxPrice)
    
    const query = createQueryString({
      min_price: undefined,
      max_price: undefined,
    })
    router.push(`${pathname}?${query}`)
  }

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseInt(value) : value
    if (isNaN(num)) return ""
    return new Intl.NumberFormat("vi-VN").format(num)
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setLocalMinPrice(value)
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setLocalMaxPrice(value)
  }

  const handleSliderMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setSliderMin(Math.min(value, sliderMax - step))
  }

  const handleSliderMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setSliderMax(Math.max(value, sliderMin + step))
  }

  useEffect(() => {
    if (showSlider) {
      setLocalMinPrice(sliderMin.toString())
      setLocalMaxPrice(sliderMax.toString())
    }
  }, [sliderMin, sliderMax, showSlider])

  const hasActiveFilter = searchParams.has("min_price") || searchParams.has("max_price")

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title font-medium">
        Price Range
        {hasActiveFilter && (
          <span className="ml-2 badge badge-primary badge-sm">Active</span>
        )}
      </div>
      <div className="collapse-content">
        <div className="space-y-4">
          {showSlider ? (
            <div className="space-y-4">
              <div className="px-2">
                <div className="relative">
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={step}
                    value={sliderMin}
                    onChange={handleSliderMinChange}
                    className="range range-primary range-sm absolute z-20 opacity-75"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    step={step}
                    value={sliderMax}
                    onChange={handleSliderMaxChange}
                    className="range range-primary range-sm absolute z-10"
                  />
                </div>
                <div className="flex justify-between text-xs text-base-content/60 mt-2">
                  <span>{formatCurrency(minPrice)} ₫</span>
                  <span>{formatCurrency(maxPrice)} ₫</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span>{formatCurrency(sliderMin)} ₫</span>
                <span>-</span>
                <span>{formatCurrency(sliderMax)} ₫</span>
              </div>
            </div>
          ) : (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm">Minimum Price</span>
                </label>
                <input
                  type="text"
                  placeholder="0"
                  className="input input-bordered input-sm"
                  value={formatCurrency(localMinPrice)}
                  onChange={handleMinPriceChange}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm">Maximum Price</span>
                </label>
                <input
                  type="text"
                  placeholder="100,000,000"
                  className="input input-bordered input-sm"
                  value={formatCurrency(localMaxPrice)}
                  onChange={handleMaxPriceChange}
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            <button
              onClick={applyPriceFilter}
              className="btn btn-primary btn-sm flex-1"
            >
              Apply
            </button>
            {hasActiveFilter && (
              <button
                onClick={clearPriceFilter}
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