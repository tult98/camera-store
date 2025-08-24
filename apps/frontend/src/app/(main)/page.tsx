import { getFeaturedCategories } from "@lib/data/featured-categories"
import FeaturedCategorySection from "@modules/home/components/featured-category-section"
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

  return (
    <div className="min-h-screen bg-base-100">
      <div className="py-8">
        {featuredCategories.length > 0 ? (
          featuredCategories.map((category, index) => (
            <FeaturedCategorySection
              key={category.id || index}
              title={category.category_name}
              heroImage={category.hero_image_url}
              categoryLink={`/categories/${category.category_handle}`}
              products={category.products}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-4 text-base-content">
              Welcome to <span className="text-primary">Camera Store</span>
            </h1>
            <p className="text-lg text-base-content/70">
              Premium quality mirrorless cameras and lenses for photography
              enthusiasts
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
