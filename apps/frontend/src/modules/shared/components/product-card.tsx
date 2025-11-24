"use client"

import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { Product } from "@modules/shared/types/product"
import Image from "next/image"
import Link from "next/link"

const ProductCard = ({ product }: { product: Product }) => {
  const thumbnail = product.thumbnail
  const variants = product.variants || []
  const firstVariant = variants[0]
  const price = firstVariant?.calculated_price.calculated_amount
  const currencyCode = firstVariant?.calculated_price.currency_code || "USD"

  return (
    <div className="group relative featured-product-card">
      <div className="relative bg-white rounded-3xl overflow-hidden transition-all duration-500 ease-out shadow-lg hover:shadow-2xl hover:scale-[1.02]">
        <div className="relative aspect-square overflow-hidden bg-base-200 rounded-t-3xl">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-base-300 flex items-center justify-center">
              <span className="text-base-content/30 text-sm">No image</span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <Link href={`/products/${product.handle}`}>
            <h3 className="font-bold text-xl lg:text-2xl text-base-content leading-tight hover:text-primary transition-colors">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-base-content">
                {price
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: currencyCode,
                    }).format(price)
                  : "No price"}
              </span>
            </div>

            <button className="btn btn-primary rounded-full px-6 flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
              <ShoppingCartIcon className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
