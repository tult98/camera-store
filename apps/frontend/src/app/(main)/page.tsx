import { FeaturedCategoriesResponse } from "@camera-store/shared-types"
import { sdk } from "@lib/config"
import { getDefaultRegion } from "@lib/data/regions"
import HomePage from "@modules/home/templates/home-page"
import { Metadata } from "next"

// Revalidate every 5 minutes
export const revalidate = 300

export const metadata: Metadata = {
  title: "PH Camera | Premium Mirrorless Cameras & Lenses",
  description:
    "Discover the latest cameras, lenses, and accessories. Premium quality mirrorless cameras for photography enthusiasts and professionals.",
}

interface BannerData {
  id: string
  images: string[]
  is_active: boolean
}

interface BannerResponse {
  banner: BannerData | null
}

export default async function Home() {
  const defaultRegion = await getDefaultRegion()

  if (!defaultRegion) {
    throw new Error("No region found")
  }

  const [{ banner }, { featured_categories: featuredCategories }] =
    await Promise.all([
      sdk.client.fetch<BannerResponse>(`/store/banners`, {
        method: "GET",
      }),
      sdk.client.fetch<FeaturedCategoriesResponse>(
        `/store/featured-categories`,
        {
          method: "GET",
          headers: {
            region_id: defaultRegion.id,
            currency_code: defaultRegion.currency_code,
          },
        }
      ),
    ])

  return <HomePage banner={banner} featuredCategories={featuredCategories} />
}
