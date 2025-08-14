import { listProducts } from "@lib/data/products"
import { getDefaultRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
}

export default async function RelatedProducts({
  product,
}: RelatedProductsProps) {
  const region = await getDefaultRegion()

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.FindParams & HttpTypes.StoreProductParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  // Note: collection_id, tag_id and is_giftcard are not supported by the current API
  // Consider implementing custom filtering logic if needed

  const products = await listProducts({
    queryParams,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-base-regular text-gray-600 mb-6">
          Related products
        </span>
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          You might also want to check out these products.
        </p>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {products.map((product) => (
          <li key={product.id}>
            <Product product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
