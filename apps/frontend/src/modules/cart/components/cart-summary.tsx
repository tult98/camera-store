"use client"

import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { HttpTypes } from "@medusajs/types"
import CartTotals from "@modules/common/components/cart-totals"
import Link from "next/link"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const Summary = ({ cart }: SummaryProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-base-content">Order Summary</h2>
      <div className="space-y-4">
        <div className="divider my-4"></div>
        <CartTotals totals={cart} />
        <div className="divider my-4"></div>
        <div className="flex flex-col gap-2">
          <Link
            href="/checkout"
            data-testid="checkout-button"
            className="w-full"
          >
            <button className="btn btn-primary btn-block">
              Proceed to Checkout
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </button>
          </Link>
          <Link href="/" className="w-full">
            <button className="btn btn-outline btn-block">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Summary
