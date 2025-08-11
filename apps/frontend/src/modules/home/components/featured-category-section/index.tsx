import { ChevronRightIcon, HeartIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import type { FeaturedCategory } from '@camera-store/shared-types'

interface MockProduct {
  id: string
  name: string
  price: string
  originalPrice?: string
  image: string
  badge?: {
    text: string
    type: 'sale' | 'preorder' | 'new'
  }
}

interface FeaturedCategorySectionProps {
  title: string
  heroImage: string
  products: MockProduct[]
  categoryLink: string
}

// Updated interface for real data
interface FeaturedCategorySectionV2Props {
  category: FeaturedCategory
}

export default function FeaturedCategorySection({
  title,
  heroImage,
  products,
  categoryLink,
}: FeaturedCategorySectionProps) {
  return (
    <section className="mb-16">
      {/* Category Hero Banner */}
      <div className="relative mb-8">
        <div 
          className="relative h-64 lg:h-80 rounded-2xl overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content overlay */}
          <div className="relative h-full flex items-center justify-between p-8 lg:p-12">
            <div className="flex-1">
              <h2 className="text-3xl lg:text-5xl font-bold text-white uppercase tracking-wide drop-shadow-lg">
                {title}
              </h2>
            </div>
            <div className="flex-shrink-0">
              <Link
                href={categoryLink}
                className="flex items-center bg-white/90 hover:bg-white text-red-500 hover:text-red-600 font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:shadow-lg"
              >
                Xem thêm
                <ChevronRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <figure className="relative aspect-square overflow-hidden">
                {/* Product Badges */}
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <div
                      className={`badge text-white text-xs font-medium px-2 py-1 ${
                        product.badge.type === 'sale'
                          ? 'bg-red-500'
                          : product.badge.type === 'preorder'
                          ? 'bg-pink-500'
                          : 'bg-green-500'
                      }`}
                    >
                      {product.badge.text}
                    </div>
                  </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 z-10 btn btn-ghost btn-circle btn-sm bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <HeartIcon className="w-4 h-4" />
                </button>

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </figure>

              <div className="card-body p-4">
                <h3 className="font-medium text-sm lg:text-base text-gray-800 line-clamp-2 mb-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-red-500 font-bold text-lg">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}