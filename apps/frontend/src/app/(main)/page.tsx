import { FeaturedCategoriesResponse } from "@camera-store/shared-types"
import { sdk } from "@lib/config"
import { getDefaultRegion } from "@lib/data/regions"
import HomePage from "@modules/home/templates/home-page"
import { Metadata } from "next"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "PH Camera | Premium Mirrorless Cameras & Lenses",
  description:
    "Discover the latest cameras, lenses, and accessories. Premium quality mirrorless cameras for photography enthusiasts and professionals.",
}

export default async function Home() {
  console.log("Home page: Fetching default region...")
  const defaultRegion = await getDefaultRegion()

  if (!defaultRegion) {
    console.error("Home page: No region found - cannot fetch featured categories")
    throw new Error("No region found")
  }
  
  console.log("Home page: Using region:", defaultRegion.id, defaultRegion.currency_code)

  try {
    console.log("Home page: Fetching featured categories with headers:", {
      region_id: defaultRegion.id,
      currency_code: defaultRegion.currency_code,
    })
    
    const { featured_categories: featuredCategories } =
      await sdk.client.fetch<FeaturedCategoriesResponse>(
        `/store/featured-categories`,
        {
          method: "GET",
          headers: {
            region_id: defaultRegion.id,
            currency_code: defaultRegion.currency_code,
          },
        }
      )

    console.log("Home page: Featured categories fetched successfully:", featuredCategories?.length || 0)
    return <HomePage featuredCategories={featuredCategories} />
  } catch (error) {
    console.error("Home page: Error fetching featured categories:", error)
    throw error
  }
}
