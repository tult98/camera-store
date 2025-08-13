import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Link from "next/link"
import ProductPrice from "@modules/products/components/product-price"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-6">
        {product.collection && (
          <nav className="text-sm breadcrumbs">
            <ul className="text-base-content/60">
              <li>
                <Link 
                  href="/" 
                  className="hover:text-primary transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href={`/collections/${product.collection.handle}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.collection.title}
                </Link>
              </li>
              <li className="text-base-content font-semibold cursor-default">{product.title}</li>
            </ul>
          </nav>
        )}
        
        <Heading
          level="h1"
          className="text-2xl lg:text-3xl font-bold text-base-content leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </Heading>
        
        <div className="bg-base-100/80 rounded-lg p-3">
          <ProductPrice product={product} mode="range" />
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
