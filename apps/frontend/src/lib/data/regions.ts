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

export const getDefaultRegion =
  async (): Promise<HttpTypes.StoreRegion | null> => {
    try {
      const regions = await listRegions()

      if (!regions || regions.length === 0) {
        return null
      }

      return regions[0]
    } catch (e: any) {
      return null
    }
  }
