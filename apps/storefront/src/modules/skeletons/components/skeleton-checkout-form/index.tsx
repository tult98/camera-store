"use client"

import { useSearchParams } from "next/navigation"
import SkeletonCartStep from "@modules/skeletons/components/skeleton-cart-step"
import SkeletonShippingAddressStep from "@modules/skeletons/components/skeleton-shipping-address-step"
import SkeletonReviewStep from "@modules/skeletons/components/skeleton-review-step"

export default function SkeletonCheckoutForm() {
  const searchParams = useSearchParams()
  const step = searchParams.get("step") || "cart"

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-y-8">
        {step === "cart" && <SkeletonCartStep />}
        {step === "shipping-address" && <SkeletonShippingAddressStep />}
        {step === "review" && <SkeletonReviewStep />}
      </div>
    </div>
  )
}
