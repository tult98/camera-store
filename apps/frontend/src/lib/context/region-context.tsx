"use client"

import { HttpTypes } from "@medusajs/types"
import { createContext, useContext, useEffect, useState } from "react"
import { listRegions } from "@lib/data/regions"

interface RegionContextType {
  region: HttpTypes.StoreRegion | null
  isLoading: boolean
  error: string | null
}

const RegionContext = createContext<RegionContextType>({
  region: null,
  isLoading: true,
  error: null,
})

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initializeRegion() {
      try {
        const regions = await listRegions()
        
        if (regions && regions.length > 0) {
          // For single-region store, use the first (and only) region
          const defaultRegion = regions[0]
          setRegion(defaultRegion)
          
          // Store region ID for server-side usage
          if (typeof window !== "undefined") {
            sessionStorage.setItem("default-region-id", defaultRegion.id)
          }
        } else {
          setError("No regions found in your Medusa store")
        }
      } catch (err) {
        setError("Failed to fetch regions")
        console.error("Region initialization error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeRegion()
  }, [])

  return (
    <RegionContext.Provider value={{ region, isLoading, error }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider")
  }
  return context
}

// Helper function to get region ID from storage (for server-side usage)
export function getStoredRegionId(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  return sessionStorage.getItem("default-region-id")
}