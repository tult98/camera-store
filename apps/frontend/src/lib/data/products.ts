"use server"

import { coreApiClient } from "@lib/core-api-client"
import { HttpTypes } from "@medusajs/types"
import { getDefaultRegion } from "./regions"

export const retrieveProduct = async (
  handle: string
): Promise<
  | (HttpTypes.StoreProduct & {
      product_attributes?: Array<{ attribute_name: string; value: unknown }>
    })
  | null
> => {
  try {
    // Get default region for pricing calculations
    const region = await getDefaultRegion()

    if (!region) {
      console.warn(
        "No default region found, product may not have proper pricing"
      )
      return null
    }

    const response = await coreApiClient.get<{
      product: HttpTypes.StoreProduct & {
        product_attributes?: Array<{ attribute_name: string; value: unknown }>
      }
    }>(`/store/products/${handle}`, {
      headers: {
        "currency-code": region.currency_code,
      },
    })

    return response.data.product
  } catch (error) {
    console.error(`Failed to retrieve product with handle ${handle}:`, error)
    return null
  }
}
