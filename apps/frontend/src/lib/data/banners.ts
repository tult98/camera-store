"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getCacheOptions } from "./cookies"

export interface BannerData {
  id: string
  images: string[]
  is_active: boolean
}

export interface BannerResponse {
  banner: BannerData | null
}

export const getActiveBanner = async (): Promise<BannerData | null> => {
  try {
    const next = {
      ...(await getCacheOptions("active-banner")),
    }

    const response = await sdk.client.fetch<BannerResponse>(`/store/banners`, {
      method: "GET",
      next,
    })

    return response.banner
  } catch (error) {
    return medusaError(error)
  }
}
