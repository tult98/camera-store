"use client"

import { useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { XMarkIcon } from "@heroicons/react/24/outline"

interface ActiveFilter {
  key: string
  label: string
  value: string
  displayValue: string
}

export default function ActiveFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (filterKey: string, filterValue?: string) => {
      const newSearchParams = new URLSearchParams(searchParams)
      
      // Handle multi-value filters (brands, sensor_size, video_capability, mount_type)
      const multiValueFilters = ["brands", "sensor_size", "video_capability", "mount_type"]
      
      if (multiValueFilters.includes(filterKey) && filterValue) {
        const currentValues = newSearchParams.getAll(filterKey)
        newSearchParams.delete(filterKey)
        currentValues
          .filter(value => value !== filterValue)
          .forEach(value => newSearchParams.append(filterKey, value))
      } else {
        newSearchParams.delete(filterKey)
      }
      
      newSearchParams.delete("page")
      
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const removeFilter = (filterKey: string, filterValue?: string) => {
    const query = createQueryString(filterKey, filterValue)
    router.push(`${pathname}?${query}`)
  }

  const clearAllFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    
    // Clear existing filters
    newSearchParams.delete("min_price")
    newSearchParams.delete("max_price")
    newSearchParams.delete("brands")
    newSearchParams.delete("in_stock")
    
    // Clear new camera-specific filters
    newSearchParams.delete("sensor_size")
    newSearchParams.delete("video_capability")
    newSearchParams.delete("mount_type")
    newSearchParams.delete("min_megapixels")
    newSearchParams.delete("max_megapixels")
    
    newSearchParams.delete("page")
    
    router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  const formatCurrency = (value: string) => {
    const num = parseInt(value)
    if (isNaN(num)) return value
    return new Intl.NumberFormat("vi-VN").format(num) + " ₫"
  }

  const getActiveFilters = (): ActiveFilter[] => {
    const filters: ActiveFilter[] = []

    // Price filter
    const minPrice = searchParams.get("min_price")
    const maxPrice = searchParams.get("max_price")
    
    if (minPrice || maxPrice) {
      let priceLabel = "Price: "
      if (minPrice && maxPrice) {
        priceLabel += `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
      } else if (minPrice) {
        priceLabel += `From ${formatCurrency(minPrice)}`
      } else if (maxPrice) {
        priceLabel += `Up to ${formatCurrency(maxPrice)}`
      }
      
      filters.push({
        key: "price",
        label: "Price",
        value: "price_range",
        displayValue: priceLabel
      })
    }

    // Megapixels filter
    const minMegapixels = searchParams.get("min_megapixels")
    const maxMegapixels = searchParams.get("max_megapixels")
    
    if (minMegapixels || maxMegapixels) {
      let megapixelLabel = "Megapixels: "
      if (minMegapixels && maxMegapixels) {
        megapixelLabel += `${minMegapixels} - ${maxMegapixels} MP`
      } else if (minMegapixels) {
        megapixelLabel += `From ${minMegapixels} MP`
      } else if (maxMegapixels) {
        megapixelLabel += `Up to ${maxMegapixels} MP`
      }
      
      filters.push({
        key: "megapixels",
        label: "Megapixels",
        value: "megapixel_range",
        displayValue: megapixelLabel
      })
    }

    // Brand filter
    const brands = searchParams.getAll("brands")
    brands.forEach(brand => {
      filters.push({
        key: "brands",
        label: "Brand",
        value: brand,
        displayValue: brand
      })
    })

    // Sensor size filter
    const sensorSizes = searchParams.getAll("sensor_size")
    sensorSizes.forEach(size => {
      const formattedSize = size.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      filters.push({
        key: "sensor_size",
        label: "Sensor",
        value: size,
        displayValue: formattedSize
      })
    })

    // Video capability filter
    const videoCapabilities = searchParams.getAll("video_capability")
    videoCapabilities.forEach(capability => {
      filters.push({
        key: "video_capability",
        label: "Video",
        value: capability,
        displayValue: capability.toUpperCase()
      })
    })

    // Mount type filter
    const mountTypes = searchParams.getAll("mount_type")
    mountTypes.forEach(mount => {
      const formattedMount = mount.replace(/-/g, ' ').toUpperCase()
      filters.push({
        key: "mount_type",
        label: "Mount",
        value: mount,
        displayValue: formattedMount
      })
    })

    // In stock filter
    const inStock = searchParams.get("in_stock")
    if (inStock === "true") {
      filters.push({
        key: "in_stock",
        label: "Status",
        value: "true",
        displayValue: "In Stock"
      })
    }

    return filters
  }

  const activeFilters = getActiveFilters()

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-base-content/70">Bộ lọc đang áp dụng:</span>
        {activeFilters.map((filter, index) => (
          <div key={`${filter.key}-${filter.value}-${index}`} className="badge badge-primary gap-1">
            <span className="text-xs">{filter.displayValue}</span>
            <button
              onClick={() => {
                const multiValueFilters = ["brands", "sensor_size", "video_capability", "mount_type"]
                removeFilter(filter.key, multiValueFilters.includes(filter.key) ? filter.value : undefined)
              }}
              className="btn btn-ghost btn-circle btn-xs hover:bg-primary-focus"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
        {activeFilters.length > 1 && (
          <button
            onClick={clearAllFilters}
            className="btn btn-ghost btn-sm text-xs"
          >
            Xóa tất cả
          </button>
        )}
      </div>
    </div>
  )
}