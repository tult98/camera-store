import repeat from "@lib/util/repeat"

const SkeletonProductList = ({
  numberOfProducts = 6,
}: {
  numberOfProducts?: number
}) => {
  return (
    <div className="space-y-4" data-testid="products-list-loader">
      {repeat(numberOfProducts).map((index) => (
        <div key={index} className="animate-pulse">
          <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg">
            {/* Product Image */}
            <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg"></div>
            
            {/* Product Info */}
            <div className="flex-1 space-y-2">
              {/* Product Title */}
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              
              {/* Key Specs */}
              <div className="space-y-1">
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/3"></div>
              </div>
            </div>
            
            {/* Price and Actions */}
            <div className="flex flex-col justify-between items-end space-y-2">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonProductList