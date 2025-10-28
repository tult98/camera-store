import { HttpTypes } from "@medusajs/types"
import CartStep from "@modules/checkout/components/cart-step"
import OrderSuccessStep from "@modules/checkout/components/order-success-step"
import ReviewStep from "@modules/checkout/components/review-step"
import ShippingAddressStep from "@modules/checkout/components/shipping-address-step"
import { useCheckoutBreadcrumbs } from "@modules/layout/components/breadcrumbs/useLayoutBreadcrumbs"
import { useSearchParams } from "next/navigation"

export default function CheckoutForm({
  cart,
  isBuyNow = false,
}: {
  cart: HttpTypes.StoreCart
  isBuyNow?: boolean
}) {
  const searchParams = useSearchParams()
  const step = searchParams.get("step") || "cart"

  // Set breadcrumbs based on current step
  useCheckoutBreadcrumbs(
    (step as "cart" | "shipping-address" | "review" | "success") || "cart"
  )

  return (
    <div className="w-full border border-base-content/10 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 gap-y-8">
        {step === "cart" && <CartStep initialCart={cart} />}
        {step === "shipping-address" && <ShippingAddressStep cart={cart} />}
        {step === "review" && <ReviewStep cart={cart} isBuyNow={isBuyNow} />}
        {step === "success" && <OrderSuccessStep isBuyNow={isBuyNow} />}
      </div>
    </div>
  )
}
