"use client"

import { useCart } from "@lib/hooks/use-cart"
import CheckoutTemplate from "@modules/checkout/templates"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function Checkout() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const step = searchParams.get("step")

  // Try to get buy-now cart first, then fall back to regular cart
  const { data: buyNowCart, isLoading: isLoadingBuyNow } = useCart(
    undefined,
    true
  )
  const { data: regularCart, isLoading: isLoadingRegular } = useCart()

  const cart = buyNowCart || regularCart

  const isBuyNow = !!buyNowCart
  const isLoading = isLoadingBuyNow || isLoadingRegular

  useEffect(() => {
    if (!step) {
      router.push("/checkout?step=cart")
    }
  }, [step, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!cart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Add items to your cart to checkout
          </p>
          <a href="/" className="btn btn-primary">
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return <CheckoutTemplate cart={cart} isBuyNow={isBuyNow} />
}
