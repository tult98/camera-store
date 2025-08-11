import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Badge } from "@medusajs/ui"

export default function ProductCard({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice, compareAtPrice } = getProductPrice({
    product,
  })

  // Check if product is new (created within last 30 days)
  const isNew = product.created_at 
    ? new Date(product.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    : false

  // Check if product has a sale price
  const isOnSale = compareAtPrice && cheapestPrice && compareAtPrice.amount > cheapestPrice.amount

  // Check inventory status
  const totalInventory = product.variants?.reduce((total, variant) => {
    return total + (variant.inventory_quantity || 0)
  }, 0) || 0

  const isLowStock = totalInventory > 0 && totalInventory <= 5
  const isOutOfStock = totalInventory === 0

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm border border-ui-border-base hover:shadow-md transition-shadow duration-200">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            className="group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isNew && (
              <Badge className="bg-green-500 text-white text-xs">
                New
              </Badge>
            )}
            {isOnSale && (
              <Badge className="bg-red-500 text-white text-xs">
                Sale
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge className="bg-orange-500 text-white text-xs">
                Low Stock
              </Badge>
            )}
            {isOutOfStock && (
              <Badge className="bg-gray-500 text-white text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <Text 
            className="font-medium text-ui-fg-base group-hover:text-ui-fg-interactive transition-colors duration-200 line-clamp-2 mb-2" 
            data-testid="product-title"
          >
            {product.title}
          </Text>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            {cheapestPrice && (
              <Text className="font-semibold text-ui-fg-base">
                {cheapestPrice.currency_code.toUpperCase()} {(cheapestPrice.amount / 100).toFixed(2)}
              </Text>
            )}
            {isOnSale && compareAtPrice && (
              <Text className="text-sm text-ui-fg-muted line-through">
                {compareAtPrice.currency_code.toUpperCase()} {(compareAtPrice.amount / 100).toFixed(2)}
              </Text>
            )}
          </div>

          {/* Inventory Status */}
          <div className="mt-2">
            {isOutOfStock ? (
              <Text className="text-sm text-red-600">Out of Stock</Text>
            ) : isLowStock ? (
              <Text className="text-sm text-orange-600">Only {totalInventory} left</Text>
            ) : (
              <Text className="text-sm text-green-600">In Stock</Text>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}