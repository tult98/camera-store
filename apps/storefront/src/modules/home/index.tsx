import BannerSlider from "@modules/home/components/banner-slider"
import FeaturedProducts from "@modules/home/components/featured-products"
import ShopByBrand from "@modules/home/components/shop-by-brand"
import ShopByCategory from "@modules/home/components/shop-by-category"
import { Banner } from "@modules/home/types"
import { Brand } from "@modules/shared/types/brand"
import { Category } from "@modules/shared/types/category"
import { Product } from "@modules/shared/types/product"

interface HomePageProps {
  banner?: Banner | null
  featuredCategories?: Category[]
  featuredProducts?: Product[]
  brands?: Brand[]
}

const HomePage = ({
  banner,
  featuredCategories,
  featuredProducts,
  brands,
}: HomePageProps) => (
  <div className="min-h-screen">
    {banner && <BannerSlider banner={banner} />}
    {featuredProducts && <FeaturedProducts products={featuredProducts} />}
    {featuredCategories && <ShopByCategory categories={featuredCategories} />}
    {brands && <ShopByBrand brands={brands} />}
  </div>
)

export default HomePage
