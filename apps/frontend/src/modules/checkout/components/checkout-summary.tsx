import { useCart } from "@lib/hooks/use-cart"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/components/cart-items-preview"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ initialCart }: { initialCart: HttpTypes.StoreCart }) => {
  const { data: cart } = useCart(initialCart.id)
  const currentCart = cart || initialCart

  return (
    <div className="md:sticky md:top-0 border border-gray-200 p-4 md:p-6 rounded-lg overflow-hidden">
      <div className="w-full flex flex-col space-y-4 md:space-y-6">
        <Heading level="h2" className="text-lg md:text-xl font-semibold text-gray-900">
          Order Summary
        </Heading>

        {/* Items */}
        <div className="space-y-3 md:space-y-4 overflow-x-auto">
          <ItemsPreviewTemplate cart={currentCart} />
        </div>

        {/* Totals */}
        <div className="pt-3 md:pt-4">
          <CartTotals totals={currentCart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
