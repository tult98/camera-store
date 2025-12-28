import ProductCard from "@modules/shared/components/product-card"
import { Product } from "@modules/shared/types/product"

interface FeaturedProductsProps {
  products: Product[]
}

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            Featured Products
          </h2>
          <p className="text-lg text-base-content/70 font-serif italic">
            Handpicked excellence for the discerning photographer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
