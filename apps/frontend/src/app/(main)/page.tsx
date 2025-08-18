import FeaturedCategorySection from "@modules/home/components/featured-category-section"
import { getFeaturedCategories } from "@lib/data/featured-categories"
import { Metadata } from "next"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface FeaturedCategory {
  id: string;
  category_name: string;
  category_description: string;
  category_handle: string;
  hero_image_url: string;
  display_order: number;
  products: any[];
}

export const metadata: Metadata = {
  title: "Camera Store | Premium Mirrorless Cameras & Lenses",
  description:
    "Discover the latest cameras, lenses, and accessories. Premium quality mirrorless cameras for photography enthusiasts and professionals.",
}

export default async function Home() {
  let featuredCategories: FeaturedCategory[] = []
  
  try {
    featuredCategories = await getFeaturedCategories()
  } catch (error) {
    console.error("Failed to fetch featured categories:", error)
  }

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
            <h1 className="text-4xl font-bold mb-4 text-base-content">Welcome to <span className="text-primary">Camera Store</span></h1>
            <p className="text-lg text-base-content/70">
              Premium quality mirrorless cameras and lenses for photography enthusiasts
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
