"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { sdk } from "@lib/config"
import { useToast } from "@lib/providers/toast-provider"
import { formatPrice } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import { completeOrder } from "@modules/checkout/apiCalls/orders"
import CartTotals from "@modules/common/components/cart-totals"
import { useMutation, useQueries } from "@tanstack/react-query"
import { useCookies } from "next-client-cookies"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const ReviewStep = ({
  cart,
  isBuyNow = false,
}: {
  cart: HttpTypes.StoreCart
  isBuyNow?: boolean
}) => {
  const router = useRouter()
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const isOpen = searchParams.get("step") === "review"
  const cookies = useCookies()

  const previousStepsCompleted = cart.shipping_address

  const [shippingOptionsQuery, paymentProvidersQuery] = useQueries({
    queries: [
      {
        queryKey: ["shipping-options", cart.id],
        queryFn: () => {
          return sdk.store.fulfillment.listCartOptions({
            cart_id: cart.id,
            fields: "*calculated_price",
          })
        },
        enabled: !!cart.id,
      },
      {
        queryKey: ["payment-providers", cart.region_id],
        queryFn: () =>
          sdk.store.payment.listPaymentProviders({
            region_id: cart.region_id!,
          }),
        enabled: !!cart.region_id,
      },
    ],
  })

  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState<
    string | null
  >(null)

  const defaultProviderId =
    paymentProvidersQuery.data?.payment_providers?.[0]?.id

  useEffect(() => {
    const isDataReady =
      !shippingOptionsQuery.isLoading && !paymentProvidersQuery.isLoading
    const isMissingRequireData =
      !shippingOptionsQuery.data?.shipping_options?.length || !defaultProviderId
    if (isDataReady && isMissingRequireData) {
      showToast("No shipping options or payment providers found", "error")
    }
  }, [
    defaultProviderId,
    shippingOptionsQuery.data?.shipping_options,
    shippingOptionsQuery.isLoading,
    paymentProvidersQuery.isLoading,
  ])

  // set default shipping option
  useEffect(() => {
    if (
      shippingOptionsQuery.data?.shipping_options?.length &&
      !selectedShippingOptionId
    ) {
      setSelectedShippingOptionId(
        shippingOptionsQuery.data.shipping_options[0].id
      )
    }
  }, [shippingOptionsQuery.data?.shipping_options, selectedShippingOptionId])

  const completeOrderMutation = useMutation({
    mutationFn: completeOrder,
    onSuccess: () => {
      cookies.remove(isBuyNow ? "_medusa_buy_now_cart_id" : "_medusa_cart_id")
      setTimeout(() => {
        router.push("/checkout?step=success")
      }, 500)
    },
    onError: (error) => {
      showToast(error.message || "Failed to place order", "error")
    },
  })

  const handleConfirmOrder = () => {
    if (!selectedShippingOptionId) {
      showToast("Please select a shipping option", "error")
      return
    }

    completeOrderMutation.mutate({
      cart,
      shippingMethodId: selectedShippingOptionId,
      providerId: defaultProviderId!,
      isBuyNow,
    })
  }

  const handleGoBack = () => {
    router.push("/checkout?step=shipping-address")
  }

  // Only render when this step is active
  if (!isOpen) {
    return null
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

              {/* Shipping Options */}
              {shippingOptionsQuery.data?.shipping_options && (
                <div className="mb-6 border-t pt-4">
                  <Heading level="h3" className="text-lg font-semibold mb-4">
                    Shipping Method
                  </Heading>
                  <div className="space-y-3">
                    {shippingOptionsQuery.data.shipping_options.map(
                      (option) => (
                        <label
                          key={option.id}
                          className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
                        >
                          <input
                            type="radio"
                            name="shipping-option"
                            className="radio radio-primary mt-1"
                            checked={selectedShippingOptionId === option.id}
                            onChange={() =>
                              setSelectedShippingOptionId(option.id)
                            }
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {option.type.label}
                            </div>
                            <div className="text-sm text-base-content/70">
                              {option.type.description}
                            </div>
                            <div className="text-sm font-semibold mt-1">
                              {option.calculated_price
                                ? formatPrice(
                                    option.calculated_price.calculated_amount ||
                                      0,
                                    option.calculated_price.currency_code ||
                                      "vnd"
                                  )
                                : formatPrice(
                                    option.amount || 0,
                                    cart.currency_code || "USD"
                                  )}
                            </div>
                          </div>
                        </label>
                      )
                    )}
                  </div>
                </div>
              )}

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
              disabled={completeOrderMutation.isPending}
              className="btn btn-outline flex-1"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Back
            </button>
            <button
              onClick={handleConfirmOrder}
              disabled={
                !selectedShippingOptionId || completeOrderMutation.isPending
              }
              className="btn btn-primary flex-1"
              data-testid="confirm-order-button"
            >
              {completeOrderMutation.isPending && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              Confirm Order
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ReviewStep
