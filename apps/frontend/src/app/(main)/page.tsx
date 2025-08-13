import FeaturedCategorySection from "@modules/home/components/featured-category-section"
import { getCachedFeaturedCategories } from "@lib/data/featured-categories"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Camera Store | Premium Mirrorless Cameras & Lenses",
  description:
    "Discover the latest cameras, lenses, and accessories. Premium quality mirrorless cameras for photography enthusiasts and professionals.",
}

export default async function Home() {
  const featuredCategories = await getCachedFeaturedCategories()

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {featuredCategories.map((category, index) => (
          <FeaturedCategorySection
            key={category.id || index}
            title={category.category_name}
            heroImage={category.hero_image_url}
            categoryLink={`/categories/${category.category_handle}`}
            products={category.products}
          />
        ))}
      </div>
    </div>
  )
}
