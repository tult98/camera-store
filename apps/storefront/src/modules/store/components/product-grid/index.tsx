import { EyeIcon } from "@heroicons/react/24/outline"
import { ViewMode } from "@modules/store/store/category-filter-store"
import CategoryProductCard from "@modules/store/components/category-product-card"
import { HttpTypes } from "@medusajs/types"

interface ProductGridProps {
  products: HttpTypes.StoreProduct[]
  viewMode?: ViewMode
}

export default function ProductGrid({
  products,
  viewMode = "grid",
}: ProductGridProps) {

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <EyeIcon className="w-16 h-16 text-base-content/30 mb-4" />
        <h3 className="text-lg font-medium text-base-content/70 mb-2">
          No products found
        </h3>
        <p className="text-base-content/50 text-center max-w-sm">
          Try adjusting your filters or search terms to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  const gridClasses =
    viewMode === "grid"
      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      : "flex flex-col gap-4"

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <CategoryProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
        />
      ))}
    </div>
  )
}

