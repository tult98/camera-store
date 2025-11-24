import { sdk } from "@lib/config"
import { coreApiClient } from "@lib/core-api-client"
import { getDefaultRegion } from "@lib/data/regions"
import HomePage from "@modules/home"
import { Banner } from "@modules/home/types"
import { CategoryResponse } from "@modules/shared/types/category"
import { ProductResponse } from "@modules/shared/types/product"
import { Metadata } from "next"

// Revalidate every 5 minutes
export const revalidate = 300

export const metadata: Metadata = {
  title: "PH Camera | Premium Mirrorless Cameras & Lenses",
  description:
    "Discover the latest cameras, lenses, and accessories. Premium quality mirrorless cameras for photography enthusiasts and professionals.",
}

interface BannerResponse {
  banner: Banner | null
}

export default async function Home() {
  const defaultRegion = await getDefaultRegion()

  if (!defaultRegion) {
    throw new Error("No region found")
  }

  const [{ banner }, featuredCategoriesResponse, featuredProductResponse] =
    await Promise.all([
      sdk.client.fetch<BannerResponse>(`/store/banners`, {
        method: "GET",
      }),
      coreApiClient.get<CategoryResponse>("/store/categories/featured"),
      coreApiClient.get<ProductResponse>("/store/products/featured", {
        headers: {
          "currency-code": defaultRegion.currency_code,
        },
      }),
    ])

  return (
    <HomePage
      banner={banner}
      featuredCategories={featuredCategoriesResponse.data.categories}
      featuredProducts={featuredProductResponse.data.products}
    />
  )
}
