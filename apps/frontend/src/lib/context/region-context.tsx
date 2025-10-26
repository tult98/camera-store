"use client"

import { HttpTypes } from "@medusajs/types"
import { fetchRegions } from "@modules/common/apiCalls/regions"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext } from "react"

interface RegionContextType {
  region: HttpTypes.StoreRegion | null
  isLoading: boolean
}

const RegionContext = createContext<RegionContextType>({
  region: null,
  isLoading: true,
})

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const { data: regions, isLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: Infinity,
    gcTime: Infinity,
  })
  const region = regions?.[0] || null

  return (
    <RegionContext.Provider value={{ region, isLoading }}>
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
