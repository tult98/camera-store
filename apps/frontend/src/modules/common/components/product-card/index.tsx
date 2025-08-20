import { HeartIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"

interface ProductCardProps {
  product: HttpTypes.StoreProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cheapestPrice } = getProductPrice({ product })

  return (
    <div className="group">
      <Link href={`/products/${product.handle}`}>
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <figure className="relative aspect-square overflow-hidden">
            {/* Wishlist Button */}
            <button 
              className="absolute top-3 right-3 z-10 btn btn-circle btn-sm bg-base-100/90 hover:bg-primary hover:text-primary-content opacity-0 group-hover:opacity-100 transition-opacity"
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
            <h3 className="font-medium text-sm lg:text-base text-base-content line-clamp-2 mb-2">
              {product.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-auto">
              {cheapestPrice && (
                <span className="text-primary font-bold text-lg">
                  {cheapestPrice.calculated_price}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}