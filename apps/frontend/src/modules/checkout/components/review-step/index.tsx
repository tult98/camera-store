"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { placeOrder } from "@lib/data/cart"
import { useToast } from "@lib/providers/toast-provider"
import { Heading, Text } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import CartTotals from "@modules/common/components/cart-totals"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const ReviewStep = ({
  cart,
  isBuyNow = false,
}: {
  cart: any
  isBuyNow?: boolean
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOpen = searchParams.get("step") === "review"
  const { showToast } = useToast()

  const [orderPlaced, setOrderPlaced] = useState(false)

  const previousStepsCompleted = cart.shipping_address

  const placeOrderMutation = useMutation({
    mutationFn: () => placeOrder(cart.id, isBuyNow),
    onSuccess: () => {
      setOrderPlaced(true)
    },
    onError: (error) => {
      showToast(error.message || "Failed to place order", "error")
    },
  })

  const handleConfirmOrder = () => {
    placeOrderMutation.mutate()
  }

  const handleGoBack = () => {
    router.push("/checkout?step=shipping-address")
  }

  // Only render when this step is active
  if (!isOpen) {
    return null
  }

  // Show success message after order is placed
  if (orderPlaced) {
    return (
      <div className="bg-white">
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <Heading
            level="h2"
            className="text-2xl font-bold text-base-content mb-2"
          >
            Order Placed Successfully!
          </Heading>
          <Text className="text-lg text-gray-600">
            Thank you for your order. You will receive a confirmation email
            shortly.
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading level="h2" className="text-2xl font-bold text-base-content">
          Review Your Order
        </Heading>
        <div></div>
      </div>

      {previousStepsCompleted && (
        <>
          {/* Cart Items Summary */}
          <div className="mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <Heading level="h3" className="text-lg font-semibold mb-4">
                Order Summary
              </Heading>

              {/* Items */}
              <div className="mb-6">
                <ItemsPreviewTemplate cart={cart} />
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <CartTotals totals={cart} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleGoBack}
              disabled={placeOrderMutation.isPending}
              className="btn btn-outline flex-1"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back
            </button>
            <button
              onClick={handleConfirmOrder}
              disabled={placeOrderMutation.isPending}
              className={`btn btn-primary flex-1 ${
                placeOrderMutation.isPending ? "loading" : ""
              }`}
              data-testid="confirm-order-button"
            >
              Confirm Order
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ReviewStep
