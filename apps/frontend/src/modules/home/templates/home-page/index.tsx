import { HttpTypes } from "@medusajs/types"
import BannerSlider from "@modules/home/components/banner-slider"
import FeaturedCategorySection from "@modules/home/components/featured-category-section"

interface BannerData {
  id: string
  images: string[]
  is_active: boolean
}

interface HomePageProps {
  banner?: BannerData | null
  featuredCategories: Array<{
    id?: string
    category_name: string
    hero_image_url?: string
    category_handle: string
    products: HttpTypes.StoreProduct[]
  }>
}

const HomePage = ({ banner, featuredCategories }: HomePageProps) => (
  <div className="min-h-screen bg-base-100">
    {banner && <BannerSlider banner={banner} />}
    <div className="py-8">
      {featuredCategories.length > 0 ? (
        featuredCategories.map((category, index) => (
          <FeaturedCategorySection
            key={category.id || index}
            title={category.category_name}
            heroImage={category.hero_image_url!}
            categoryLink={`/categories/${category.category_handle}`}
            products={category.products}
          />
        ))
      ) : (
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4 text-base-content">
            Welcome to <span className="text-primary">PH Camera</span>
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

export default HomePage
