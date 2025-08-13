import { clx } from "@medusajs/ui"

import { getProductPrice, getPriceRange } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
  mode = "single",
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  mode?: "single" | "range"
}) {
  if (mode === "range") {
    const priceRange = getPriceRange(product)

    if (!priceRange) {
      return <div className="block w-32 h-12 bg-base-300 animate-pulse rounded" />
    }

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl lg:text-2xl font-semibold text-primary">
              {priceRange.hasRange ? (
                <>
                  <span data-testid="min-price" data-value={priceRange.minPrice.calculated_price_number}>
                    {priceRange.minPrice.calculated_price}
                  </span>
                  <span className="text-primary mx-2">-</span>
                  <span data-testid="max-price" data-value={priceRange.maxPrice.calculated_price_number}>
                    {priceRange.maxPrice.calculated_price}
                  </span>
                </>
              ) : (
                <span data-testid="single-price" data-value={priceRange.minPrice.calculated_price_number}>
                  {priceRange.minPrice.calculated_price}
                </span>
              )}
            </span>
          </div>
          {priceRange.hasSalePrice && priceRange.percentage_diff && (
            <span className="badge badge-secondary text-xs">
              -{priceRange.percentage_diff}%
            </span>
          )}
        </div>
        {priceRange.hasSalePrice && (
          <div className="flex items-center gap-2 text-base-content/60">
            <span className="text-xs">Giá gốc:</span>
            <span className="text-xs line-through">
              {priceRange.hasRange ? (
                <>
                  {priceRange.minPrice.original_price} - {priceRange.maxPrice.original_price}
                </>
              ) : (
                priceRange.minPrice.original_price
              )}
            </span>
          </div>
        )}
      </div>
    )
  }

  // Single variant mode (existing functionality)
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-ui-fg-base">
      <span
        className={clx("text-xl-semi", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        {!variant && "From "}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
