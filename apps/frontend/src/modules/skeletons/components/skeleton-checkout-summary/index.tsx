import repeat from "@lib/util/repeat"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonCheckoutSummary = () => {
  return (
    <div className="md:sticky md:top-0 border border-gray-200 p-4 md:p-6 rounded-lg overflow-hidden">
      <div className="w-full flex flex-col space-y-4 md:space-y-6">
        <div className="w-40 h-6 bg-gray-200 animate-pulse" />

        <div className="space-y-3 md:space-y-4 overflow-x-auto">
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

        <div className="pt-3 md:pt-4">
          <SkeletonCartTotals header={false} />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCheckoutSummary
