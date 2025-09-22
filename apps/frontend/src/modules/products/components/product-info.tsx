"use client"

import { HttpTypes } from "@medusajs/types"
import ProductPrice from "@modules/products/components/product-price"
import { useProductBreadcrumbs } from "@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  selectedVariant?: HttpTypes.StoreProductVariant
}

const ProductInfo = ({ product, selectedVariant }: ProductInfoProps) => {
  // Set breadcrumbs in the layout context
  useProductBreadcrumbs(product)

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-6">
        
        <h1
          className="text-2xl lg:text-3xl font-bold text-base-content leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </h1>
        
        <div className="bg-base-100/80 rounded-lg p-3">
          <ProductPrice 
            product={product} 
            variant={selectedVariant}
            mode={selectedVariant ? "single" : "range"}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductInfo