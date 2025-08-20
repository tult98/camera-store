"use client"

import { useCallback, useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface BrandFilterProps {
  availableBrands: Array<{
    value: string
    label: string
    count?: number
  }>
}

export default function BrandFilter({ availableBrands }: BrandFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getSelectedBrands = () => {
    const brandsParam = searchParams.getAll("brands")
    return brandsParam
  }

  const [selectedBrands, setSelectedBrands] = useState<string[]>(getSelectedBrands())

  useEffect(() => {
    setSelectedBrands(getSelectedBrands())
  }, [searchParams])

  const createQueryString = useCallback(
    (brands: string[]) => {
      const newSearchParams = new URLSearchParams(searchParams)
      
      newSearchParams.delete("brands")
      
      if (brands.length > 0) {
        brands.forEach(brand => {
          newSearchParams.append("brands", brand)
        })
      }
      
      newSearchParams.delete("page")
      
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const handleBrandToggle = (brand: string) => {
    let newBrands: string[]
    
    if (selectedBrands.includes(brand)) {
      newBrands = selectedBrands.filter(b => b !== brand)
    } else {
      newBrands = [...selectedBrands, brand]
    }
    
    const query = createQueryString(newBrands)
    router.push(`${pathname}?${query}`)
  }

  const clearBrandFilter = () => {
    const query = createQueryString([])
    router.push(`${pathname}?${query}`)
  }

  const hasActiveFilter = selectedBrands.length > 0

  if (availableBrands.length === 0) {
    return null
  }

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title font-medium">
        Thương hiệu
        {hasActiveFilter && (
          <span className="ml-2 badge badge-primary badge-sm">{selectedBrands.length}</span>
        )}
      </div>
      <div className="collapse-content">
        <div className="space-y-2">
          <div className="max-h-48 overflow-y-auto space-y-2">
            {availableBrands.map((brand) => (
              <label key={brand.value} className="flex items-center gap-2 cursor-pointer hover:bg-base-300 p-1 rounded">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm checkbox-primary"
                  checked={selectedBrands.includes(brand.value)}
                  onChange={() => handleBrandToggle(brand.value)}
                />
                <span className="text-sm flex-1">{brand.label}</span>
                {brand.count !== undefined && (
                  <span className="text-xs text-base-content/60">({brand.count})</span>
                )}
              </label>
            ))}
          </div>
          
          {hasActiveFilter && (
            <button
              onClick={clearBrandFilter}
              className="btn btn-ghost btn-sm btn-block"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </div>
    </div>
  )
}