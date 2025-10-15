"use client"

import { HttpTypes } from "@medusajs/types"
import CheckoutForm from "@modules/checkout/components/checkout-form"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"
import CheckoutSummary from "@modules/checkout/components/checkout-summary"
import SkeletonCheckoutForm from "@modules/skeletons/components/skeleton-checkout-form"
import SkeletonCheckoutProgress from "@modules/skeletons/components/skeleton-checkout-progress"
import SkeletonCheckoutSummary from "@modules/skeletons/components/skeleton-checkout-summary"

interface CheckoutClientProps {
  cart?: HttpTypes.StoreCart
  isBuyNow: boolean
  isLoading?: boolean
}

export default function Checkout({
  cart,
  isBuyNow,
  isLoading = false,
}: CheckoutClientProps) {
  if (isLoading || !cart) {
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

  return (
    <div className="w-full py-4 md:py-12">
      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_416px] gap-4 md:gap-x-16 md:gap-y-8">
        <div className="space-y-4 md:space-y-8">
          {/* Progress Indicator */}
          <CheckoutProgress />
          <CheckoutForm cart={cart} isBuyNow={isBuyNow} />
        </div>
        <CheckoutSummary initialCart={cart} />
      </div>
    </div>
  )
}
