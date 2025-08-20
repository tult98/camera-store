"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function AvailabilityFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isInStockFilter = searchParams.get("in_stock") === "true"

  const createQueryString = useCallback(
    (inStock: boolean | undefined) => {
      const newSearchParams = new URLSearchParams(searchParams)
      
      if (inStock === undefined) {
        newSearchParams.delete("in_stock")
      } else {
        newSearchParams.set("in_stock", String(inStock))
      }
      
      newSearchParams.delete("page")
      
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const handleAvailabilityToggle = () => {
    const newValue = !isInStockFilter
    const query = createQueryString(newValue ? true : undefined)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title font-medium">
        Tình trạng
        {isInStockFilter && (
          <span className="ml-2 badge badge-primary badge-sm">Đang lọc</span>
        )}
      </div>
      <div className="collapse-content">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-base-300 p-2 rounded">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
            checked={isInStockFilter}
            onChange={handleAvailabilityToggle}
          />
          <span className="text-sm">Chỉ hiển thị sản phẩm còn hàng</span>
        </label>
      </div>
    </div>
  )
}