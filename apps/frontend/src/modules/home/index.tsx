import BannerSlider from "@modules/home/components/banner-slider"
import FeaturedProducts from "@modules/home/components/featured-products"
import ShopByCategory from "@modules/home/components/shop-by-category"
import { Banner } from "@modules/home/types"
import { Category } from "@modules/shared/types/category"
import { Product } from "@modules/shared/types/product"

interface HomePageProps {
  banner?: Banner | null
  featuredCategories?: Category[]
  featuredProducts?: Product[]
}

const HomePage = ({ banner, featuredCategories, featuredProducts }: HomePageProps) => (
  <div className="min-h-screen">
    {banner && <BannerSlider banner={banner} />}
    {featuredProducts && <FeaturedProducts products={featuredProducts} />}
    {featuredCategories && <ShopByCategory categories={featuredCategories} />}
  </div>
)

export default HomePage
