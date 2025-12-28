import SkeletonButton from "@modules/skeletons/components/skeleton-button"
import SkeletonCartTotals from "@modules/skeletons/components/skeleton-cart-totals"

const SkeletonOrderSummary = () => {
  return (
    <div className="space-y-6">
      <div className="w-40 h-6 bg-base-300 animate-pulse rounded" />
      <div className="space-y-4">
        <div className="divider my-4"></div>
        <SkeletonCartTotals header={false} />
        <div className="divider my-4"></div>
        <div className="flex flex-col gap-2">
          <SkeletonButton />
          <SkeletonButton />
        </div>
      </div>
    </div>
  )
}

export default SkeletonOrderSummary
