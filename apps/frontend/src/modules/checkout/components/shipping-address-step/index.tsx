"use client"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { updateCart } from "@lib/data/cart"
import { useToast } from "@lib/providers/toast-provider"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { FormProvider, useForm } from "react-hook-form"
import ShippingAddress, { ShippingAddressFormData } from "../shipping-address"

const ShippingAddressStep = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const router = useRouter()
  const { showToast } = useToast()
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "shipping-address"

  const methods = useForm<ShippingAddressFormData>({
    mode: "onBlur",
    defaultValues: {
      shipping_address: {
        first_name: cart?.shipping_address?.first_name || "",
        last_name: cart?.shipping_address?.last_name || "",
        phone: cart?.shipping_address?.phone || "",
        city: cart?.shipping_address?.city || "",
        address_1: cart?.shipping_address?.address_1 || "",
        address_2: cart?.shipping_address?.address_2 || "",
      },
      email: cart?.email || "",
    },
  })

  const updateCartMutation = useMutation({
    mutationFn: async (data: HttpTypes.StoreUpdateCart) => {
      return await updateCart(
        {
          shipping_address: data.shipping_address,
          email: data.email,
        },
        cart.id
      )
    },
    onSuccess: () => {
      router.push(`/checkout?step=review`)
    },
    onError: (error) => {
      const errorMessage = error?.message || "Failed to update shipping address"
      showToast(errorMessage, "error")
    },
  })

  const onSubmit = (data: ShippingAddressFormData) => {
    const countryCode = cart.region?.countries?.[0]?.iso_2

    if (!countryCode) {
      showToast("Country code not found", "error")
      return
    }

    updateCartMutation.mutate({
      ...data,
      shipping_address: {
        ...data.shipping_address,
        country_code: countryCode,
      },
    })
  }

  // Only render when this step is active
  if (!isOpen) {
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex flex-row items-center justify-between mb-8">
        <Heading level="h2" className="text-xl font-semibold text-gray-900">
          Shipping Information
        </Heading>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <ShippingAddress />
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={() => router.push("/checkout?step=cart")}
                data-testid="back-to-cart-button"
              >
                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={updateCartMutation.isPending}
                data-testid="submit-address-button"
              >
                {updateCartMutation.isPending && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
                Continue
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default ShippingAddressStep
