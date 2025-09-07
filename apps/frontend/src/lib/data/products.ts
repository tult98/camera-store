"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOption } from "@modules/store/store/category-filter-store"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getDefaultRegion } from "./regions"
import { apiClient } from "@lib/api-client"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  // Get default region for single-region store
  const region = await getDefaultRegion()

  if (!region) {
    throw new Error(
      "No default region found - unable to calculate product pricing"
    )
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+images",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        ...(queryParams && { queryParams }),
      }
    })
}

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
