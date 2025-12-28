import React from "react"

import { HttpTypes } from "@medusajs/types"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductDetailsWrapper from "@modules/products/components/product-details-wrapper"

type ProductDetailProps = {
  product: HttpTypes.StoreProduct
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <>
      <div
        className="flex flex-col lg:flex-row lg:gap-12 py-6 relative"
        data-testid="product-container"
      >
        {/* Left Side - Image Gallery */}
        <div className="w-full lg:w-2/5 lg:flex-shrink-0">
          <ImageGallery images={product.images || []} />
        </div>

        {/* Right Side - Product Information */}
        <div className="w-full lg:w-3/5 flex flex-col gap-y-8 pt-8 lg:pt-0">
          <ProductDetailsWrapper product={product} />
        </div>
      </div>

      {/* Product Description and Technical Specifications */}
      <div className="py-8 lg:py-12">
        <ProductTabs product={product} />
      </div>
    </>
  )
}

export default ProductDetail