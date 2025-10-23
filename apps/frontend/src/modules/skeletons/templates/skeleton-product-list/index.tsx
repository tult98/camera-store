import repeat from "@lib/util/repeat"

const SkeletonProductList = ({
  numberOfProducts = 6,
}: {
  numberOfProducts?: number
}) => {
  return (
    <div className="flex flex-col gap-4" data-testid="products-list-loader">
      {repeat(numberOfProducts).map((index) => (
        <div key={index}>
          <div className="card card-side bg-base-100 shadow-lg border border-base-300 animate-pulse">
            <figure className="relative w-56 h-56 shrink-0 bg-base-200">
              <div className="w-full h-full bg-base-300 rounded-l-2xl" />
            </figure>

            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4 space-y-2">
                  <div className="h-5 bg-base-300 rounded w-3/4"></div>
                  <div className="h-5 bg-base-300 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-base-300 rounded w-20"></div>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                <div className="h-5 bg-base-200 rounded w-16"></div>
                <div className="h-5 bg-base-200 rounded w-20"></div>
                <div className="h-5 bg-base-200 rounded w-14"></div>
                <div className="h-5 bg-base-200 rounded w-16"></div>
                <div className="h-5 bg-base-200 rounded w-18"></div>
              </div>

              <div className="space-y-2 mt-2">
                <div className="h-3 bg-base-200 rounded w-full"></div>
                <div className="h-3 bg-base-200 rounded w-full"></div>
                <div className="h-3 bg-base-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonProductList