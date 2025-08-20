import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/common/components/product-card"
import ViewToggle from "./view-toggle"
import { EyeIcon } from "@heroicons/react/24/outline"
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline"

export type ViewMode = "grid" | "list"

interface ProductGridProps {
  products: HttpTypes.StoreProduct[]
  isLoading?: boolean
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
}

export default function ProductGrid({
  products,
  isLoading = false,
  viewMode = "grid",
  onViewModeChange,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="skeleton h-4 w-32"></div>
          <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        </div>
        <ProductGridSkeleton viewMode={viewMode} />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <EyeIcon className="w-16 h-16 text-base-content/30 mb-4" />
        <h3 className="text-lg font-medium text-base-content/70 mb-2">
          No products found
        </h3>
        <p className="text-base-content/50 text-center max-w-sm">
          Try adjusting your filters or search terms to find what you&apos;re
          looking for.
        </p>
      </div>
    )
  }

  const gridClasses =
    viewMode === "grid"
      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      : "flex flex-col gap-4"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-base-content/70">
          Showing {products.length} product{products.length !== 1 ? "s" : ""}
        </p>
        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>

      <div className={gridClasses}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  )
}

function ProductGridSkeleton({ viewMode }: { viewMode: ViewMode }) {
  const skeletonCount = viewMode === "grid" ? 12 : 6
  const gridClasses =
    viewMode === "grid"
      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      : "flex flex-col gap-4"

  return (
    <div className={gridClasses}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div
          key={index}
          className={
            viewMode === "grid"
              ? "space-y-3"
              : "flex gap-4 p-4 bg-base-100 rounded-lg"
          }
        >
          {viewMode === "grid" ? (
            <>
              <div className="skeleton aspect-square w-full rounded-lg"></div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-4 w-1/2"></div>
                <div className="skeleton h-4 w-1/3"></div>
              </div>
            </>
          ) : (
            <>
              <div className="skeleton w-32 h-32 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="skeleton h-5 w-3/4"></div>
                <div className="skeleton h-4 w-1/2"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-2/3"></div>
                <div className="flex gap-2 mt-4">
                  <div className="skeleton h-8 w-20"></div>
                  <div className="skeleton h-8 w-8"></div>
                  <div className="skeleton h-8 w-8"></div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
