import { FeaturedCategoriesResponse } from "@camera-store/shared-types"
import { sdk } from "@lib/config"
import { getActiveBanner } from "@lib/data/banners"
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
    const bannerPromise = getActiveBanner()

    console.log("Home page: Fetching featured categories with headers:", {
      region_id: defaultRegion.id,
      currency_code: defaultRegion.currency_code,
    })

    const featuredCategoriesPromise = sdk.client.fetch<FeaturedCategoriesResponse>(
      `/store/featured-categories`,
      {
        method: "GET",
        headers: {
          region_id: defaultRegion.id,
          currency_code: defaultRegion.currency_code,
        },
      }
    )

    const [banner, { featured_categories: featuredCategories }] = await Promise.all([
      bannerPromise,
      featuredCategoriesPromise,
    ])

    console.log("Home page: Featured categories fetched successfully:", featuredCategories?.length || 0)
    console.log("Home page: Banner fetched:", banner ? "Yes" : "No")

    return <HomePage banner={banner} featuredCategories={featuredCategories} />
  } catch (error) {
    console.error("Home page: Error fetching data:", error)
    throw error
  }
}
