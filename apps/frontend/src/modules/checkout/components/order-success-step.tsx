"use client"

import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { Heading, Text } from "@medusajs/ui"
import { deleteCookie } from "cookies-next/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const OrderSuccessStep = ({ isBuyNow }: { isBuyNow: boolean }) => {
  const router = useRouter()

  // Delete cart cookie when user navigates away from success page
  useEffect(() => {
    return () => {
      // This cleanup function runs when component unmounts
      deleteCookie(isBuyNow ? "_medusa_buy_now_cart_id" : "_medusa_cart_id", {
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
    }
  }, [])

  const handleContinueShopping = () => {
    router.push("/")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="text-center py-16 px-8">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>

        <Heading
          level="h1"
          className="text-3xl font-bold text-base-content mb-4"
        >
          Order Placed Successfully!
        </Heading>

        <Text className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for your order. You will receive a confirmation email with
          order details and tracking information shortly.
        </Text>

        <div className="flex justify-center max-w-md mx-auto">
          <button
            onClick={handleContinueShopping}
            className="btn btn-primary px-8"
          >
            Continue Shopping
          </button>
        </div>

        <div className="mt-12 p-6 bg-base-100 rounded-lg border border-base-200 max-w-2xl mx-auto">
          <Heading level="h3" className="text-lg font-semibold mb-4 text-left">
            What happens next?
          </Heading>
          <div className="space-y-3 text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                <span className="text-xs font-semibold text-primary">1</span>
              </div>
              <div>
                <Text className="font-medium text-base-content">
                  Order Confirmation
                </Text>
                <Text className="text-sm text-gray-600">
                  You'll receive an email confirmation with your order details
                </Text>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                <span className="text-xs font-semibold text-primary">2</span>
              </div>
              <div>
                <Text className="font-medium text-base-content">
                  Order Processing
                </Text>
                <Text className="text-sm text-gray-600">
                  We'll prepare your items for shipping
                </Text>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                <span className="text-xs font-semibold text-primary">3</span>
              </div>
              <div>
                <Text className="font-medium text-base-content">
                  Shipping Updates
                </Text>
                <Text className="text-sm text-gray-600">
                  Track your package with the tracking number we'll send you
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessStep
