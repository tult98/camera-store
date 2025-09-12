import { retrieveCart } from "@lib/data/cart"
import Checkout from "@modules/checkout/components"
import { redirect } from "next/navigation"
import { Suspense } from "react"

interface CheckoutPageProps {
  searchParams: { step?: string }
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const step = searchParams.step

  // Redirect to cart step if no step is specified
  if (!step) {
    redirect("/checkout?step=cart")
  }

  // Fetch carts on the server
  const [buyNowCart, regularCart] = await Promise.all([
    retrieveCart(undefined, true),
    retrieveCart(),
  ])

  const cart = buyNowCart || regularCart
  const isBuyNow = !!buyNowCart

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

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </div>
      }
    >
      <Checkout cart={cart} isBuyNow={isBuyNow} />
    </Suspense>
  )
}
