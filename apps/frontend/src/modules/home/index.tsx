import BannerSlider from "@modules/home/components/banner-slider"
import ShopByCategory from "@modules/home/components/shop-by-category"
import { Banner } from "@modules/home/types"
import { Category } from "@modules/shared/types/category"

interface HomePageProps {
  banner?: Banner | null
  featuredCategories?: Category[]
}

const HomePage = ({ banner, featuredCategories }: HomePageProps) => (
  <div className="min-h-screen">
    {banner && <BannerSlider banner={banner} />}
    {featuredCategories && <ShopByCategory categories={featuredCategories} />}
  </div>
)

export default HomePage
