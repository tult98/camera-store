import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="md:sticky md:top-0 border border-gray-200 p-4 md:p-6 rounded-lg overflow-hidden">
      <div className="w-full flex flex-col space-y-4 md:space-y-6">
        <Heading level="h2" className="text-lg md:text-xl font-semibold text-gray-900">
          Order Summary
        </Heading>

        {/* Items */}
        <div className="space-y-3 md:space-y-4 overflow-x-auto">
          <ItemsPreviewTemplate cart={cart} />
        </div>

        {/* Totals */}
        <div className="pt-3 md:pt-4">
          <CartTotals totals={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
