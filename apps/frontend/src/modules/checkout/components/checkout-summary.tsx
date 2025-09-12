import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="sticky top-0 border border-gray-200 p-6 rounded-lg">
      <div className="w-full flex flex-col space-y-6">
        <Heading level="h2" className="text-xl font-semibold text-gray-900">
          Order Summary
        </Heading>

        {/* Items */}
        <div className="space-y-4">
          <ItemsPreviewTemplate cart={cart} />
        </div>

        {/* Totals */}
        <div className="pt-4">
          <CartTotals totals={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
