import { HttpTypes } from "@medusajs/types"
import CartStep from "@modules/checkout/components/cart-step"
import OrderSuccessStep from "@modules/checkout/components/order-success-step"
import ReviewStep from "@modules/checkout/components/review-step"
import ShippingAddressStep from "@modules/checkout/components/shipping-address-step"

export default function CheckoutForm({
  cart,
  isBuyNow = false,
}: {
  cart: HttpTypes.StoreCart
  isBuyNow?: boolean
}) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-y-8">
        <CartStep initialCart={cart} />
        <ShippingAddressStep cart={cart} />
        <ReviewStep cart={cart} isBuyNow={isBuyNow} />
        <OrderSuccessStep />
      </div>
    </div>
  )
}
