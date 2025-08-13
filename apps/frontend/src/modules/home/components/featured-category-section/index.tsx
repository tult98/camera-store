'use client'

import { ChevronRightIcon, HeartIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

interface ProductVariant {
  id: string
  title: string
  prices: Array<{
    id: string
    amount: number
    currency_code: string
  }>
}

interface Product {
  id: string
  title: string
  handle: string
  thumbnail: string
  variants: ProductVariant[]
}

interface FeaturedCategorySectionProps {
  title: string
  heroImage: string
  products: Product[]
  categoryLink: string
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
        {products.map((product) => {
          // Get the price from the first variant's first price
          const firstVariant = product.variants?.[0]
          const price = firstVariant?.prices?.[0]?.amount
          const formattedPrice = price 
            ? new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0
              }).format(price) // Price is already in VND
            : 'N/A'

          return (
            <div key={product.id} className="group">
              <Link href={`/products/${product.handle}`}>
                <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <figure className="relative aspect-square overflow-hidden">
                    {/* Wishlist Button */}
                    <button 
                      className="absolute top-3 right-3 z-10 btn btn-ghost btn-circle btn-sm bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault()
                        // Handle wishlist logic here
                      }}
                    >
                      <HeartIcon className="w-4 h-4" />
                    </button>

                    {product.thumbnail && (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </figure>

                  <div className="card-body p-4">
                    <h3 className="font-medium text-sm lg:text-base text-gray-800 line-clamp-2 mb-2">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-red-500 font-bold text-lg">
                        {formattedPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}