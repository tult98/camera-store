import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

const EmptyCartMessage = () => {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center py-12"
      data-testid="empty-cart-message"
    >
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full border-2 border-orange-300">
            <ShoppingCartIcon className="w-16 h-16 text-orange-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-base-content mb-4">
          Your Cart is Empty
        </h2>

        <p className="text-base-content/70 mb-8 leading-relaxed">
          Looks like you haven&apos;t added anything to your cart yet. Start
          browsing our collection to find the perfect camera gear for you.
        </p>

        <Link href="/" className="btn btn-primary btn-md">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default EmptyCartMessage
