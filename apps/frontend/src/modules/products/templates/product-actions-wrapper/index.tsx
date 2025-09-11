import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import ProductActions from "@modules/products/components/product-actions"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region: HttpTypes.StoreRegion
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
    return null
  }

  return <ProductActions product={product} />
}
