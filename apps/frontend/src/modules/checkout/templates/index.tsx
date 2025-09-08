"use client"

import { HttpTypes } from "@medusajs/types"
import CheckoutForm from "./checkout-form"
import CheckoutSummary from "./checkout-summary"
import CheckoutProgress from "../components/checkout-progress"

const CheckoutTemplate = ({
  cart,
  isBuyNow = false,
}: {
  cart: HttpTypes.StoreCart
  isBuyNow?: boolean
}) => {
  return (
    <div className="content-container py-12">
      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_416px] gap-x-16 gap-y-8">
        <div className="space-y-8">
          {/* Progress Indicator */}
          <CheckoutProgress />
          <CheckoutForm cart={cart} isBuyNow={isBuyNow} />
        </div>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}

export default CheckoutTemplate