import { HttpTypes } from "@medusajs/types"
import { ViewMode } from "@modules/store/store/category-filter-store"
import { formatPrice } from "@lib/util/money"
import Image from "next/image"
import Link from "next/link"
import { CpuChipIcon } from "@heroicons/react/24/outline"

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

  // Extract technical specs from metadata for camera products
  const getTechnicalSpecs = () => {
    const specs = []
    if (product.metadata?.sensor_type) {
      specs.push({ label: 'Sensor', value: product.metadata.sensor_type })
    }
    if (product.metadata?.megapixels) {
      specs.push({ label: 'MP', value: `${product.metadata.megapixels}` })
    }
    if (product.metadata?.mount_type) {
      specs.push({ label: 'Mount', value: product.metadata.mount_type })
    }
    return specs.slice(0, 2) // Show max 2 specs in grid view
  }

  const technicalSpecs = getTechnicalSpecs()

  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.handle}`}>
        <div className="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/20">
          <figure className="relative w-56 h-56 shrink-0 bg-base-200">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover rounded-l-2xl"
              sizes="(max-width: 768px) 224px, 224px"
            />
          </figure>

          <div className="card-body p-6">
            <div className="flex items-start justify-between">
              <h3 className="card-title text-lg font-bold line-clamp-2 flex-1 pr-4">
                {product.title}
              </h3>
              <span className="text-primary font-bold text-xl whitespace-nowrap">
                {displayPrice}
              </span>
            </div>

            {product.description && (
              <p className="text-sm text-base-content/70 line-clamp-3 mt-2">
                {product.description}
              </p>
            )}

            {/* Technical Specifications */}
            {technicalSpecs.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-base-300">
                {technicalSpecs.map((spec, index) => (
                  <div key={index} className="">
                    <dt className="text-xs font-medium text-base-content/50 uppercase tracking-wide">
                      {spec.label}
                    </dt>
                    <dd className="text-sm font-semibold text-base-content mt-1">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group h-full">
      <Link href={`/products/${product.handle}`} className="block h-full">
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-base-300 hover:border-primary/30 hover:scale-[1.02]">
          <figure className="relative aspect-square overflow-hidden bg-base-200">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          </figure>

          <div className="card-body p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-sm lg:text-base text-base-content line-clamp-2 min-h-[2.5rem] leading-tight">
              {product.title}
            </h3>

            {/* Technical Specifications */}
            {technicalSpecs.length > 0 && (
              <div className="flex items-center gap-3 mt-2 text-xs text-base-content/70">
                {technicalSpecs.map((spec, index) => (
                  <div key={index} className="flex items-center gap-1">
                    {spec.label === 'Sensor' && <CpuChipIcon className="w-3 h-3" />}
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-3">
              <span className="text-primary font-bold text-base lg:text-lg">
                {displayPrice}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
