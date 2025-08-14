"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

let defaultRegion: HttpTypes.StoreRegion | null = null

// Get the default region for single-region stores
export const getDefaultRegion = async (): Promise<HttpTypes.StoreRegion | null> => {
  try {
    // Return cached default region if available
    if (defaultRegion) {
      return defaultRegion
    }

    const regions = await listRegions()
    
    if (!regions || regions.length === 0) {
      return null
    }

    // For single-region store, use the first region as default
    defaultRegion = regions[0]
    return defaultRegion
  } catch (e: any) {
    console.error("Error fetching default region:", e)
    return null
  }
}

// Get region by country code - for single-region stores, this behaves the same as getDefaultRegion
// Used specifically for cart operations that require country code validation
export const getRegion = async (countryCode: string): Promise<HttpTypes.StoreRegion | null> => {
  try {
    const regions = await listRegions()
    
    if (!regions || regions.length === 0) {
      return null
    }

    // For single-region stores, return the first region regardless of country code
    // In multi-region stores, you would filter by country code here
    return regions[0]
  } catch (e: any) {
    console.error("Error fetching region:", e)
    return null
  }
}

