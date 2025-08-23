import { HttpTypes } from "@medusajs/types"
import { ViewMode } from "@modules/store/store/category-filter-store"
import { formatPrice } from "@lib/util/money"
import Image from "next/image"
import Link from "next/link"

interface CategoryProductCardProps {
  product: HttpTypes.StoreProduct
  viewMode?: ViewMode
}

export default function CategoryProductCard({
  product,
  viewMode = "grid",
}: CategoryProductCardProps) {
  const imageUrl = product.thumbnail || "/images/placeholder-camera.svg"

  // Get lowest price for display
  const getLowestPrice = () => {
    if (!product.variants?.length) return "Price not available"
    
    const validPrices = product.variants
      .map(v => v.calculated_price)
      .filter((p): p is NonNullable<typeof p> => 
        p?.calculated_amount !== undefined && p?.calculated_amount !== null
      )
    
    if (!validPrices.length) return "Price not available"
    
    const amounts = validPrices.map(p => p.calculated_amount!)
    const minPrice = Math.min(...amounts)
    const currency = validPrices[0].currency_code || "USD"
    
    return formatPrice(minPrice / 100, currency)
  }
  
  const displayPrice = getLowestPrice()

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.handle}`}>
        <div className="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <figure className="relative w-48 h-48 shrink-0">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 192px, 192px"
            />
          </figure>

          <div className="card-body">
            <h3 className="card-title text-lg">{product.title}</h3>

            {product.description && (
              <p className="text-sm text-base-content/70 line-clamp-2">
                {product.description}
              </p>
            )}

            <div className="card-actions justify-between items-center mt-auto">
              <span className="text-primary font-bold text-lg whitespace-nowrap">
                {displayPrice}
              </span>

              <button className="btn btn-primary btn-sm">Add to Cart</button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group h-full">
      <Link href={`/products/${product.handle}`} className="block h-full">
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
          <figure className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          </figure>

          <div className="card-body p-4 flex flex-col flex-grow">
            <h3 className="font-medium text-sm lg:text-base text-base-content line-clamp-2 min-h-[2.5rem]">
              {product.title}
            </h3>

            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-primary font-bold text-base lg:text-lg whitespace-nowrap">
                {displayPrice}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
