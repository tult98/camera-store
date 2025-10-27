import SkeletonCheckoutForm from "@modules/skeletons/components/skeleton-checkout-form"
import SkeletonCheckoutProgress from "@modules/skeletons/components/skeleton-checkout-progress"
import SkeletonCheckoutSummary from "@modules/skeletons/components/skeleton-checkout-summary"

const SkeletonCheckoutPage = () => {
  return (
    <div className="w-full py-4 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_416px] gap-4 md:gap-x-16 md:gap-y-8">
        <div className="space-y-4 md:space-y-8">
          <SkeletonCheckoutProgress />
          <SkeletonCheckoutForm />
        </div>
        <SkeletonCheckoutSummary />
      </div>
    </div>
  )
}

export default SkeletonCheckoutPage
