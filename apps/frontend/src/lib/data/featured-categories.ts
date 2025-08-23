import { cameraStoreApi } from "@lib/config"

interface FeaturedCategory {
  id: string;
  category_name: string;
  category_description: string;
  category_handle: string;
  hero_image_url: string;
  display_order: number;
  products: any[];
}

/**
 * Fetch featured categories with caching and type safety
 * Uses the Camera Store API client for type safety with Next.js caching for performance
 */
export async function getFeaturedCategories(): Promise<FeaturedCategory[]> {
  try {
    // Use unstable_cache for server-side caching with 5 minute revalidation
    const { unstable_cache } = await import('next/cache')
    
    const getCachedCategories = unstable_cache(
      async () => {
        return await cameraStoreApi.getFeaturedCategories()
      },
      ['featured-categories'],
      {
        revalidate: 300, // 5 minutes
        tags: ['featured-categories'],
      }
    )

    const featuredCategories = await getCachedCategories()
    return featuredCategories
  } catch (error) {
    console.error("Error fetching featured categories:", error)
    // Return empty array on error to prevent page crashes
    return []
  }
}