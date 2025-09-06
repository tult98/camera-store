import { formatPrice } from "@lib/util/money"
import { ViewMode } from "@modules/store/store/category-filter-store"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"

interface ProductWithAttributes extends HttpTypes.StoreProduct {
  product_attributes?: Record<string, unknown>
}

interface CategoryProductCardProps {
  product: ProductWithAttributes
  viewMode?: ViewMode
}

export default function CategoryProductCard({
  product,
  viewMode = "grid",
}: CategoryProductCardProps) {
  const imageUrl = product.thumbnail || "/images/placeholder-camera.svg"


  // Memoize price calculation for performance
  const displayPrice = useMemo(() => {
    if (!product.variants?.length) return "Price not available"

    const validPrices = product.variants
      .map((v) => v.calculated_price)
      .filter(
        (p): p is NonNullable<typeof p> =>
          p?.calculated_amount !== undefined && p?.calculated_amount !== null
      )

    if (!validPrices.length) return "Price not available"

    const amounts = validPrices.map((p) => p.calculated_amount!)
    const minPrice = Math.min(...amounts)
    const currency = validPrices[0].currency_code || "USD"

    return formatPrice(minPrice / 100, currency)
  }, [product.variants])

  // Memoize description preview for performance
  const descriptionPreview = useMemo(() => {
    if (!product.description) return ""
    
    // Remove HTML tags and get plain text
    const plainText = product.description
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
    
    // Return first 150 characters for preview
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
  }, [product.description])

  // Extract key product attributes (prioritize most useful for quick scanning)
  const productAttributes = useMemo(() => {
    if (!product.product_attributes) return []
    
    const attrs = product.product_attributes
    const attributes: { label: string; value: string }[] = []
    
    // Add brand (most important)
    if (attrs['brand']) {
      attributes.push({ label: 'brand', value: String(attrs['brand']) })
    }
    
    // Add sensor type (important for cameras)
    if (attrs['sensor_type']) {
      attributes.push({ label: 'sensor', value: String(attrs['sensor_type']) })
    }
    
    // Add megapixels
    if (attrs['megapixels']) {
      attributes.push({ label: 'mp', value: `${attrs['megapixels']}MP` })
    }
    
    // Add lens mount (important for interchangeable lens cameras)
    if (attrs['lens_mount']) {
      attributes.push({ label: 'mount', value: String(attrs['lens_mount']) })
    }
    
    // Add video resolution if available
    if (attrs['video_resolution']) {
      attributes.push({ label: 'video', value: String(attrs['video_resolution']) })
    }
    
    // Return max 4 attributes for grid view, can show more in list view
    return attributes
  }, [product.product_attributes])


  if (viewMode === "list") {
    return (
      <Link href={`/products/${product.handle}`} aria-label={`View details for ${product.title} - ${displayPrice}`}>
        <div className="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/20">
          <figure className="relative w-56 h-56 shrink-0 bg-base-200">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover rounded-l-2xl"
              sizes="(max-width: 768px) 224px, 224px"
              loading="lazy"
            />
          </figure>

          <div className="card-body p-6">
            <div className="flex items-start justify-between">
              <h3 className="card-title text-lg font-bold line-clamp-2 flex-1 pr-4">
                {product.title}
              </h3>
              <span className="text-primary font-bold text-xl whitespace-nowrap" aria-label="Price">
                {displayPrice}
              </span>
            </div>

            {productAttributes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {productAttributes.slice(0, 5).map((attr, idx) => (
                  <span key={idx} className="badge badge-sm badge-ghost">
                    {attr.value}
                  </span>
                ))}
              </div>
            )}

            {descriptionPreview && (
              <p className="text-sm text-base-content/70 line-clamp-3 mt-2">
                {descriptionPreview}
              </p>
            )}

          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group h-full">
      <Link href={`/products/${product.handle}`} className="block h-full" aria-label={`View details for ${product.title} - ${displayPrice}`}>
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-base-300 hover:border-primary/30 hover:scale-[1.02]">
          <figure className="relative aspect-square overflow-hidden bg-base-200">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              loading="lazy"
            />
          </figure>

          <div className="card-body p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-sm lg:text-base text-base-content line-clamp-2 min-h-[2.5rem] leading-tight">
              {product.title}
            </h3>

            {productAttributes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {productAttributes.slice(0, 3).map((attr, idx) => (
                  <span key={idx} className="badge badge-xs badge-ghost">
                    {attr.value}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-3">
              <span className="text-primary font-bold text-base lg:text-lg" aria-label="Price">
                {displayPrice}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
