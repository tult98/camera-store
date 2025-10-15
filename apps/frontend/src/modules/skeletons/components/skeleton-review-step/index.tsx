import repeat from "@lib/util/repeat"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonReviewStep = () => {
  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="w-56 h-7 bg-gray-200 animate-pulse" />
      </div>

      <div className="mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="w-40 h-6 bg-gray-200 animate-pulse mb-4" />

          <div className="mb-6">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <tbody>
                  {repeat(3).map((i) => (
                    <SkeletonLineItem key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6 border-t pt-4">
            <div className="w-48 h-6 bg-gray-200 animate-pulse mb-4" />
            <div className="space-y-3">
              {repeat(2).map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse mt-1" />
                  <div className="flex-1">
                    <div className="w-32 h-5 bg-gray-200 animate-pulse mb-2" />
                    <div className="w-48 h-4 bg-gray-100 animate-pulse mb-2" />
                    <div className="w-20 h-4 bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <SkeletonCartTotals header={false} />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-full h-12 bg-gray-100 animate-pulse rounded-lg" />
        <div className="w-full h-12 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    </div>
  )
}

export default SkeletonReviewStep
