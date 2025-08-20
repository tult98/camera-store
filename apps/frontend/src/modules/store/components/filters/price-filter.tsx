"use client"

import { useCallback, useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface PriceFilterProps {
  minPrice?: number
  maxPrice?: number
}

export default function PriceFilter({ minPrice = 0, maxPrice = 100000000 }: PriceFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [localMinPrice, setLocalMinPrice] = useState<string>(
    searchParams.get("min_price") || ""
  )
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(
    searchParams.get("max_price") || ""
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
    const query = createQueryString({
      min_price: localMinPrice || undefined,
      max_price: localMaxPrice || undefined,
    })
    router.push(`${pathname}?${query}`)
  }

  const clearPriceFilter = () => {
    setLocalMinPrice("")
    setLocalMaxPrice("")
    const query = createQueryString({
      min_price: undefined,
      max_price: undefined,
    })
    router.push(`${pathname}?${query}`)
  }

  const formatCurrency = (value: string) => {
    const num = parseInt(value)
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

  const hasActiveFilter = searchParams.has("min_price") || searchParams.has("max_price")

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title font-medium">
        Giá
        {hasActiveFilter && (
          <span className="ml-2 badge badge-primary badge-sm">Đang lọc</span>
        )}
      </div>
      <div className="collapse-content">
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">Giá tối thiểu</span>
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
              <span className="label-text text-sm">Giá tối đa</span>
            </label>
            <input
              type="text"
              placeholder="100,000,000"
              className="input input-bordered input-sm"
              value={formatCurrency(localMaxPrice)}
              onChange={handleMaxPriceChange}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={applyPriceFilter}
              className="btn btn-primary btn-sm flex-1"
            >
              Áp dụng
            </button>
            {hasActiveFilter && (
              <button
                onClick={clearPriceFilter}
                className="btn btn-ghost btn-sm"
              >
                Xóa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}