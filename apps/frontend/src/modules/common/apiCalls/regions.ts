import { sdk } from "@lib/config"

export const fetchRegions = async () => {
  const response = await sdk.store.region.list()
  return response.regions
}
