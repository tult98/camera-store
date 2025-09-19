import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import ProductDetailsWrapper from "@modules/products/templates/product-details-wrapper"

/**
 * Fetches real time pricing for a product and renders the product details wrapper component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
  baseProduct,
}: {
  id: string
  region: HttpTypes.StoreRegion
  baseProduct: HttpTypes.StoreProduct
}) {
  const { product } = await sdk.store.product.retrieve(
    id,
    {
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,+metadata,+tags,+images",
        region_id: region.id,
    },
  )

  if (!product) {
    return <ProductDetailsWrapper product={baseProduct} disabled />
  }

  return <ProductDetailsWrapper product={product} />
}
