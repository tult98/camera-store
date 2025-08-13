import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductInfo from "@modules/products/templates/product-info"
import ProductTabs from "@modules/products/components/product-tabs"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container flex flex-col lg:flex-row lg:gap-12 py-6 relative"
        data-testid="product-container"
      >
        {/* Left Side - Image Gallery */}
        <div className="w-full lg:w-2/5 lg:flex-shrink-0">
          <ImageGallery images={product?.images || []} />
        </div>
        
        {/* Right Side - Product Information */}
        <div className="w-full lg:w-3/5 flex flex-col gap-y-8 pt-8 lg:pt-0">
          <ProductInfo product={product} />
          
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>

      {/* Product Description and Technical Specifications */}
      <div className="content-container py-8 lg:py-12">
        <ProductTabs product={product} />
      </div>
    </>
  )
}

export default ProductTemplate
