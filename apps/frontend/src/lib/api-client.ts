import { sdk } from "./config"
import { getDefaultRegion } from "./data/regions"

type FetchOptions = Parameters<typeof sdk.client.fetch>[1]

export async function apiClient<T = any>(
  path: string,
  options?: FetchOptions
): Promise<T> {
  const region = await getDefaultRegion()
  
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> || {}),
  }
  
  if (region) {
    headers["region_id"] = region.id
    headers["currency_code"] = region.currency_code
  }
  
  return sdk.client.fetch<T>(path, {
    ...options,
    headers,
  })
}

export function createApiClient() {
  let cachedRegion: { id: string; currency_code: string } | null = null
  
  return async function clientApiClient<T = any>(
    path: string,
    options?: FetchOptions
  ): Promise<T> {
    if (typeof window !== "undefined" && !cachedRegion) {
      const regionId = sessionStorage.getItem("default-region-id")
      const currencyCode = sessionStorage.getItem("default-currency-code")
      
      if (regionId && currencyCode) {
        cachedRegion = { id: regionId, currency_code: currencyCode }
      }
    }
    
    const headers: Record<string, string> = {
      ...(options?.headers as Record<string, string> || {}),
    }
    
    if (cachedRegion) {
      headers["region_id"] = cachedRegion.id
      headers["currency_code"] = cachedRegion.currency_code
    } else {
      const region = await getDefaultRegion()
      if (region) {
        headers["region_id"] = region.id
        headers["currency_code"] = region.currency_code
        
        if (typeof window !== "undefined") {
          sessionStorage.setItem("default-region-id", region.id)
          sessionStorage.setItem("default-currency-code", region.currency_code)
          cachedRegion = { id: region.id, currency_code: region.currency_code }
        }
      }
    }
    
    return sdk.client.fetch<T>(path, {
      ...options,
      headers,
    })
  }
}

export const cameraStoreApi = createApiClient()