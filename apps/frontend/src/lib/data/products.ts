"use server"

import { getDefaultRegion } from "./regions"
import { apiClient } from "@lib/api-client"
import { HttpTypes } from "@medusajs/types"

export const retrieveProduct = async (
  handle: string
): Promise<HttpTypes.StoreProduct | null> => {
  try {
    // Get default region for pricing calculations
    const region = await getDefaultRegion()

    if (!region) {
      console.warn(
        "No default region found, product may not have proper pricing"
      )
      return null
    }

    const response = await apiClient<{ product: HttpTypes.StoreProduct }>(
      `/store/products?handle=${handle}`,
      {
        headers: {
          region_id: region.id,
          currency_code: region.currency_code,
        },
      }
    )

    return response.product
  } catch (error) {
    console.error(`Failed to retrieve product with handle ${handle}:`, error)
    return null
  }
}
