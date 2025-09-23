"use client"

import {
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { useToast } from "@lib/providers/toast-provider"
import { getMessengerUrl, isMessengerConfigured } from "@lib/util/messenger"
import { Heading, Text } from "@medusajs/ui"
import { deleteCookie } from "cookies-next/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const OrderSuccessStep = ({ isBuyNow }: { isBuyNow: boolean }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const orderId = searchParams.get("order_id")

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

  const handleCopyOrderId = async () => {
    if (!orderId) return

    try {
      await navigator.clipboard.writeText(orderId)
      showToast("Order ID copied to clipboard!", "success")
    } catch (err) {
      showToast("Failed to copy order ID", "error")
    }
  }

  const handleMessengerRedirect = () => {
    const messengerUrl = getMessengerUrl({ orderId: orderId || undefined })

    if (!messengerUrl) {
      showToast("Messenger is not configured. Please contact support.", "error")
      return
    }

    window.open(messengerUrl, "_blank")
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

        <Text className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
          Your order has been created. To complete your purchase and start
          shipping, please send a deposit payment using the order ID below.
        </Text>

        {orderId && (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/30 rounded-xl p-8 mb-8 w-fit mx-auto shadow-sm">
            <div className="text-center">
              <Text className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                Your Order ID
              </Text>
              <div className="bg-white rounded-lg p-4 border-2 border-primary/20 mb-4">
                <Text className="text-2xl font-bold text-primary font-mono tracking-wider">
                  #{orderId}
                </Text>
              </div>
              <button
                onClick={handleCopyOrderId}
                className="btn btn-primary btn-sm gap-2 px-6"
              >
                <DocumentDuplicateIcon className="w-4 h-4" />
                Copy Order ID
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center mx-auto">
          {isMessengerConfigured() && (
            <button
              onClick={handleMessengerRedirect}
              className="btn btn-primary flex items-center"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5 mr-2" />
              Send Deposit via Messenger
            </button>
          )}
          <button onClick={handleContinueShopping} className="btn btn-outline">
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
                  Copy Your Order ID
                </Text>
                <Text className="text-sm text-gray-600">
                  Use the copy button above to save your order ID
                </Text>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                <span className="text-xs font-semibold text-primary">2</span>
              </div>
              <div>
                <Text className="font-medium text-base-content">
                  Send Deposit Payment
                </Text>
                <Text className="text-sm text-gray-600">
                  Click 'Send Deposit via Messenger' and share your order ID
                  with us to complete payment
                </Text>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 mr-3">
                <span className="text-xs font-semibold text-primary">3</span>
              </div>
              <div>
                <Text className="font-medium text-base-content">
                  Order Processing & Shipping
                </Text>
                <Text className="text-sm text-gray-600">
                  Once deposit is received, we'll prepare and ship your items
                  with tracking updates
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
