import FeaturedCategorySection from "@modules/home/components/featured-category-section"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fujifilm Camera Store | Premium Mirrorless Cameras & Lenses",
  description:
    "Discover the latest Fujifilm cameras, lenses, and accessories. Premium quality mirrorless cameras for photography enthusiasts and professionals.",
}

// Mock data for featured categories with banner-style hero images
const mockFeaturedCategories = [
  {
    title: "FUJIFILM GFX-SERIES",
    heroImage: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&h=400&fit=crop&crop=center",
    categoryLink: "/categories/gfx-series",
    products: [
      {
        id: "1",
        name: "FUJIFILM GFX100RF",
        price: "147.990.000 đ",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center",
        badge: {
          text: "Đặt hàng trước",
          type: "preorder" as const
        }
      },
      {
        id: "2",
        name: "Máy ảnh FUJIFILM GFX 100 II",
        price: "192.500.000 đ",
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop&crop=center"
      },
      {
        id: "3",
        name: "Máy ảnh FUJIFILM GFX 100S II",
        price: "132.990.000 đ",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=center"
      },
      {
        id: "4",
        name: "Máy ảnh FUJIFILM GFX 100S",
        price: "93.990.000 đ",
        originalPrice: "144.990.000 đ",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center&sat=-100",
        badge: {
          text: "-35%",
          type: "sale" as const
        }
      }
    ]
  },
  {
    title: "FUJIFILM X-SERIES",
    heroImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=400&fit=crop&crop=center",
    categoryLink: "/categories/x-series",
    products: [
      {
        id: "5",
        name: "FUJIFILM X-T5",
        price: "45.990.000 đ",
        image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&crop=center",
        badge: {
          text: "New",
          type: "new" as const
        }
      },
      {
        id: "6",
        name: "FUJIFILM X-H2S",
        price: "52.990.000 đ",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop&crop=center&brightness=10"
      },
      {
        id: "7",
        name: "FUJIFILM X-S20",
        price: "28.990.000 đ",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop&crop=center&brightness=20"
      },
      {
        id: "8",
        name: "FUJIFILM X100VI",
        price: "38.990.000 đ",
        originalPrice: "42.990.000 đ",
        image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&crop=center&brightness=-10",
        badge: {
          text: "-9%",
          type: "sale" as const
        }
      }
    ]
  }
]

export default async function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {/* <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Welcome to Fujifilm Store
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Discover the latest Fujifilm cameras, lenses, and accessories. 
            Premium quality equipment for photography enthusiasts and professionals.
          </p>
        </div>
      </div> */}

      {/* Featured Category Sections */}
      <div className="container mx-auto px-4 py-8">
        {mockFeaturedCategories.map((category, index) => (
          <FeaturedCategorySection
            key={index}
            title={category.title}
            heroImage={category.heroImage}
            categoryLink={category.categoryLink}
            products={category.products}
          />
        ))}
      </div>

      {/* All Products Section */}
      {/* <div className="container mx-auto px-4 py-8">
        <ProductListing />
      </div> */}
    </div>
  )
}
