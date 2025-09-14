import { ShoppingBagIcon } from "@heroicons/react/24/outline"
import { HttpTypes } from "@medusajs/types"
import EmptyCartMessage from "../components/empty-cart-message"
import ItemsTemplate from "./items"
import Summary from "./summary"

const CartTemplate = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-base-content flex items-center gap-3">
            <ShoppingBagIcon className="w-8 h-8 md:w-10 md:h-10" />
            Shopping Cart
          </h1>
          {cart?.items?.length ? (
            <p className="text-base-content/70 mt-2">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}{" "}
              in your cart
            </p>
          ) : null}
        </div>

        <div data-testid="cart-container">
          {cart?.items?.length ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
              <div className="space-y-6">
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body p-4 md:p-6">
                    <ItemsTemplate cart={cart} />
                  </div>
                </div>
              </div>

              <div className="lg:sticky lg:top-20 h-fit">
                {cart && cart.region && (
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <Summary cart={cart as any} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <EmptyCartMessage />
          )}
        </div>
      </div>
    </div>
  )
}

export default CartTemplate
