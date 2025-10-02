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
      console.log("Returning cached default region:", defaultRegion.id, defaultRegion.currency_code)
      return defaultRegion
    }

    console.log("Fetching regions from API...")
    const regions = await listRegions()
    console.log("Regions API response:", regions?.length ? `${regions.length} regions found` : "No regions returned")
    
    if (!regions || regions.length === 0) {
      console.error("No regions available - this will cause featured-categories to fail")
      return null
    }

    // For single-region store, use the first region as default
    defaultRegion = regions[0]
    console.log("Set default region:", defaultRegion.id, defaultRegion.currency_code)
    return defaultRegion
  } catch (e: any) {
    console.error("Error fetching default region:", e)
    console.error("Stack trace:", e.stack)
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

