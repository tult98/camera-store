"use client"

import { HttpTypes } from "@medusajs/types"
import CheckoutForm from "@modules/checkout/components/checkout-form"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"
import CheckoutSummary from "@modules/checkout/components/checkout-summary"

interface CheckoutClientProps {
  cart: HttpTypes.StoreCart
  isBuyNow: boolean
}

export default function Checkout({ cart, isBuyNow }: CheckoutClientProps) {
  return (
    <div className="w-full py-4 md:py-12">
      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_416px] gap-4 md:gap-x-16 md:gap-y-8">
        <div className="space-y-4 md:space-y-8">
          {/* Progress Indicator */}
          <CheckoutProgress />
          <CheckoutForm cart={cart} isBuyNow={isBuyNow} />
        </div>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}
