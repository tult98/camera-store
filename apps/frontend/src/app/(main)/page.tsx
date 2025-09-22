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
  const defaultRegion = await getDefaultRegion()

  if (!defaultRegion) {
    throw new Error("No region found")
  }

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

  return <HomePage featuredCategories={featuredCategories} />
}
