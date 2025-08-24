import { FeaturedCategoriesResponse } from "@camera-store/shared-types"
import { apiClient } from "@lib/api-client"
import { getDefaultRegion } from "./regions"

/**
 * Fetch featured categories with caching and type safety
 * Uses the Camera Store API client for type safety with Next.js caching for performance
 */
export async function getFeaturedCategories(): Promise<FeaturedCategoriesResponse> {
  try {
    // Get the default region for pricing context
    const region = await getDefaultRegion()
    
    if (!region) {
      console.error("No region available for featured categories")
      return {
        featured_categories: [],
        region_id: "",
        currency_code: ""
      }
    }

    // Use unstable_cache for server-side caching with 5 minute revalidation
    const { unstable_cache } = await import("next/cache")

    const getCachedCategories = unstable_cache(
      async () => {
        const params = new URLSearchParams({
          region_id: region.id,
          currency_code: region.currency_code
        })
        
        return await apiClient<FeaturedCategoriesResponse>(
          `/store/featured-categories?${params.toString()}`,
          {
            method: "GET",
            next: { revalidate: 300 },
          }
        )
      },
      ["featured-categories", region.id, region.currency_code],
      {
        revalidate: 300, // 5 minutes
        tags: ["featured-categories"],
      }
    )

    const featuredCategories = await getCachedCategories()
    return featuredCategories
  } catch (error) {
    console.error("Error fetching featured categories:", error)
    // Return empty array on error to prevent page crashes
    return {
      featured_categories: [],
      region_id: "",
      currency_code: ""
    }
  }
}
