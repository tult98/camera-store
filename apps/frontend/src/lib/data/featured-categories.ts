import { cameraStoreApi } from "@lib/config"

// Temporarily using inline type until shared-types module is resolved
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
 * Fetch featured categories from the backend API
 * This uses the custom Camera Store API client for type safety
 */
export async function getFeaturedCategories(): Promise<FeaturedCategory[]> {
  try {
    const featuredCategories = await cameraStoreApi.getFeaturedCategories()
    return featuredCategories
  } catch (error) {
    console.error("Error fetching featured categories:", error)
    // Return empty array on error to prevent page crashes
    return []
  }
}

/**
 * Fetch featured categories with caching for better performance
 */
export async function getCachedFeaturedCategories(): Promise<FeaturedCategory[]> {
  try {
    // Use Next.js cache with 5 minute revalidation
    const featuredCategories = await fetch('/store/featured-categories', {
      headers: {
        'x-publishable-api-key': process.env['NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY'] || '',
      },
      next: { revalidate: 300 }, // 5 minutes
    }).then(res => res.json()).then(data => data.featured_categories)
    
    return featuredCategories || []
  } catch (error) {
    console.error("Error fetching cached featured categories:", error)
    // Fallback to direct API call
    return getFeaturedCategories()
  }
}