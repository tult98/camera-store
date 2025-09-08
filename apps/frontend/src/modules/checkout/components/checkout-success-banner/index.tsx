"use client"

import { CheckCircleIcon, ShoppingBagIcon } from "@heroicons/react/24/solid"
import Link from "next/link"

export default function CheckoutSuccessBanner() {
  return (
    <div className="bg-success/10 border border-success/20 rounded-lg p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="w-8 h-8 text-success" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-success-content mb-2">
            Order Placed Successfully!
          </h3>
          <p className="text-success-content/80 mb-4">
            Thank you for your purchase. Your order has been confirmed and is being processed.
            You'll receive a confirmation email shortly.
          </p>
          <div className="flex gap-3">
            <Link 
              href="/account/orders" 
              className="btn btn-success btn-sm"
            >
              <ShoppingBagIcon className="w-4 h-4" />
              View Orders
            </Link>
            <Link 
              href="/categories/cameras" 
              className="btn btn-outline btn-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}