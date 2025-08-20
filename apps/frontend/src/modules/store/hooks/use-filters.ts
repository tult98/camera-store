"use client"

import { useCallback, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FilterState } from "../types/filters"

export function useFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse current filter state from URL
  const currentFilters: Partial<FilterState> = useMemo(() => {
    return {
      brand: searchParams.getAll("brands"),
      sensorSize: searchParams.getAll("sensor_size"),
      megapixels: {
        min: parseInt(searchParams.get("min_megapixels") || "0") || 0,
        max: parseInt(searchParams.get("max_megapixels") || "100") || 100
      },
      videoCapabilities: searchParams.getAll("video_capability"),
      mountType: searchParams.getAll("mount_type"),
      priceRange: {
        min: parseInt(searchParams.get("min_price") || "0") || 0,
        max: parseInt(searchParams.get("max_price") || "100000000") || 100000000
      },
      availability: searchParams.getAll("availability"),
      focalLength: {
        min: parseInt(searchParams.get("min_focal_length") || "0") || 0,
        max: parseInt(searchParams.get("max_focal_length") || "1000") || 1000
      },
      maxAperture: parseFloat(searchParams.get("max_aperture") || "0") || 0,
      lensType: searchParams.getAll("lens_type"),
      imageStabilization: searchParams.get("image_stabilization") === "true",
      mountCompatibility: searchParams.getAll("mount_compatibility"),
      sortBy: searchParams.get("sort") || "best_sellers",
      page: parseInt(searchParams.get("page") || "1") || 1,
      limit: parseInt(searchParams.get("limit") || "24") || 24,
      inStock: searchParams.get("in_stock") === "true"
    }
  }, [searchParams])

  // Create query string helper
  const createQueryString = useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      const newSearchParams = new URLSearchParams(searchParams)
      
      Object.entries(updates).forEach(([key, value]) => {
        // Remove existing parameters for this key
        newSearchParams.delete(key)
        
        if (value === undefined || value === null) {
          // Skip undefined/null values
          return
        }
        
        if (Array.isArray(value)) {
          // Handle array values (multi-select filters)
          value.forEach(v => {
            if (v !== undefined && v !== null && v !== "") {
              newSearchParams.append(key, v)
            }
          })
        } else if (value !== "") {
          // Handle string values
          newSearchParams.set(key, value)
        }
      })
      
      // Always reset to first page when filters change
      if (!updates.hasOwnProperty("page")) {
        newSearchParams.delete("page")
      }
      
      return newSearchParams.toString()
    },
    [searchParams]
  )

  // Update filters and navigate
  const updateFilters = useCallback(
    (updates: Record<string, string | string[] | undefined>) => {
      const query = createQueryString(updates)
      router.push(`${pathname}?${query}`)
    },
    [createQueryString, router, pathname]
  )

  // Add/remove single filter value (for multi-select)
  const toggleFilterValue = useCallback(
    (filterKey: string, value: string) => {
      const currentValues = searchParams.getAll(filterKey)
      let newValues: string[]
      
      if (currentValues.includes(value)) {
        newValues = currentValues.filter(v => v !== value)
      } else {
        newValues = [...currentValues, value]
      }
      
      updateFilters({ [filterKey]: newValues })
    },
    [searchParams, updateFilters]
  )

  // Clear specific filter
  const clearFilter = useCallback(
    (filterKey: string) => {
      updateFilters({ [filterKey]: undefined })
    },
    [updateFilters]
  )

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    updateFilters({
      brands: undefined,
      sensor_size: undefined,
      video_capability: undefined,
      mount_type: undefined,
      min_price: undefined,
      max_price: undefined,
      min_megapixels: undefined,
      max_megapixels: undefined,
      availability: undefined,
      lens_type: undefined,
      min_focal_length: undefined,
      max_focal_length: undefined,
      max_aperture: undefined,
      image_stabilization: undefined,
      mount_compatibility: undefined,
      in_stock: undefined,
      page: undefined
    })
  }, [updateFilters])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    const filterParams = [
      "brands", "sensor_size", "video_capability", "mount_type",
      "min_price", "max_price", "min_megapixels", "max_megapixels",
      "availability", "lens_type", "min_focal_length", "max_focal_length",
      "max_aperture", "image_stabilization", "mount_compatibility", "in_stock"
    ]
    
    return filterParams.some(param => {
      const value = searchParams.get(param) || searchParams.getAll(param)
      return Array.isArray(value) ? value.length > 0 : value !== null
    })
  }, [searchParams])

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    
    if (searchParams.get("min_price") || searchParams.get("max_price")) count++
    if (searchParams.getAll("brands").length > 0) count++
    if (searchParams.getAll("sensor_size").length > 0) count++
    if (searchParams.getAll("video_capability").length > 0) count++
    if (searchParams.getAll("mount_type").length > 0) count++
    if (searchParams.get("min_megapixels") || searchParams.get("max_megapixels")) count++
    if (searchParams.get("in_stock")) count++
    if (searchParams.getAll("availability").length > 0) count++
    if (searchParams.getAll("lens_type").length > 0) count++
    if (searchParams.get("min_focal_length") || searchParams.get("max_focal_length")) count++
    if (searchParams.get("max_aperture")) count++
    if (searchParams.get("image_stabilization")) count++
    if (searchParams.getAll("mount_compatibility").length > 0) count++
    
    return count
  }, [searchParams])

  return {
    currentFilters,
    updateFilters,
    toggleFilterValue,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
    createQueryString
  }
}