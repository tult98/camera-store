import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

const EmptyCartMessage = () => {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center"
      data-testid="empty-cart-message"
    >
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="relative inline-block">
            <ShoppingCartIcon className="w-24 h-24 text-base-content/20" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-base-content mb-4">
          Your Cart is Empty
        </h2>

        <Link href="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default EmptyCartMessage
