import { getFeaturedCategories } from "@lib/data/featured-categories"
import HomePage from "@modules/home/templates/home-page"
import { Metadata } from "next"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Camera Store | Premium Mirrorless Cameras & Lenses",
  description:
    "Discover the latest cameras, lenses, and accessories. Premium quality mirrorless cameras for photography enthusiasts and professionals.",
}

export default async function Home() {
  const { featured_categories: featuredCategories } =
    await getFeaturedCategories()

  return <HomePage featuredCategories={featuredCategories} />
}
