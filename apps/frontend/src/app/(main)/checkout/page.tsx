import { retrieveCart } from "@lib/data/cart"
import EmptyCartMessage from "@modules/cart/components/empty-cart-message"
import Checkout from "@modules/checkout/components"
import SkeletonCheckoutPage from "@modules/skeletons/templates/skeleton-checkout-page"
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
    return <EmptyCartMessage />
  }

  return (
    <Suspense fallback={<SkeletonCheckoutPage />}>
      <Checkout cart={cart} isBuyNow={isBuyNow} />
    </Suspense>
  )
}
