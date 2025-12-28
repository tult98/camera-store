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

