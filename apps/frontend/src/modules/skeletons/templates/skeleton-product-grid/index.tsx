import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = ({
  numberOfProducts = 8,
}: {
  numberOfProducts?: number
}) => {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      data-testid="products-list-loader"
    >
      {repeat(numberOfProducts).map((index) => (
        <div key={index}>
          <SkeletonProductPreview />
        </div>
      ))}
    </div>
  )
}

export default SkeletonProductGrid
