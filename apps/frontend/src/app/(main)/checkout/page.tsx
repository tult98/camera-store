import { Suspense } from "react"
import { retrieveCart } from "@lib/data/cart"
import EmptyCartMessage from "@modules/cart/components/empty-cart-message"
import Checkout from "@modules/checkout/components"
import SkeletonCheckoutPage from "@modules/skeletons/templates/skeleton-checkout-page"

export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
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
