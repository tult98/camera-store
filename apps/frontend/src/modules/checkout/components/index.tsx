"use client"

import { useCart } from "@lib/hooks/use-cart"
import { HttpTypes } from "@medusajs/types"
import EmptyCartMessage from "@modules/cart/components/empty-cart-message"
import CheckoutForm from "@modules/checkout/components/checkout-form"
import CheckoutProgress from "@modules/checkout/components/checkout-progress"
import CheckoutSummary from "@modules/checkout/components/checkout-summary"
import { useCartStore } from "@modules/shared/store/cart-store"

interface CheckoutClientProps {
  initialCart: HttpTypes.StoreCart | null
}

export default function Checkout({ initialCart }: CheckoutClientProps) {
  const activeCartId = useCartStore((state) => state.getActiveCartId())

  const { data: cart } = useCart(activeCartId, initialCart)

  if (!cart) return <EmptyCartMessage />

  return (
    <div className="w-full py-4 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_416px] gap-4 md:gap-x-16 md:gap-y-8">
        <div className="space-y-4 md:space-y-8">
          <CheckoutProgress />
          <CheckoutForm cart={cart} />
        </div>
        <CheckoutSummary initialCart={cart} />
      </div>
    </div>
  )
}
