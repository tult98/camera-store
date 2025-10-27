"use client"

import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { HttpTypes } from "@medusajs/types"
import CartTotals from "@modules/common/components/cart-totals"
import Link from "next/link"

type OrderSummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const OrderSummary = ({ cart }: OrderSummaryProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-base-content">Order Summary</h2>
      <div className="space-y-4">
        <CartTotals totals={cart} />
        <div className="flex flex-col gap-2">
          <Link
            href="/checkout"
            data-testid="checkout-button"
            className="btn btn-primary btn-block"
          >
            Proceed to Checkout
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
          <Link href="/" className="btn btn-outline btn-block border border-base-300">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary