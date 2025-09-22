"use server"

import { apiClient } from "@lib/api-client"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getDefaultRegion } from "./regions"

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

    const { product } = await sdk.store.product.retrieve(response.product.id, {
      fields:
        "*variants.calculated_price,*variants.inventory_quantity,+metadata,+tags,+images",
      region_id: region.id,
    })

    return product
  } catch (error) {
    console.error(`Failed to retrieve product with handle ${handle}:`, error)
    return null
  }
}
