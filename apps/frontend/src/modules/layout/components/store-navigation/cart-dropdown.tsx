"use client"

import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { useCart } from "@lib/hooks/use-cart"
import { HttpTypes } from "@medusajs/types"
import { useCartId } from "@modules/shared/hooks/use-cart-id"
import Link from "next/link"

const CartDropdown = ({
  cart: initialCart,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  // Get cart ID from global state - reactive to changes
  const cartId = useCartId()

  // Use React Query to fetch cart data - this will auto-update when cart changes
  const { data: cart } = useCart(cartId || undefined, undefined, initialCart)

  // Calculate total items count from cart (prefer React Query data, fallback to initial)
  const lineProductsCount =
    cart?.items?.length || initialCart?.items?.length || 0

  return (
    <Link href="/cart">
      <div className="indicator">
        <ShoppingCartIcon className="w-5 h-5" />
        {lineProductsCount > 0 && (
          <span className="badge badge-sm badge-primary indicator-item">
            {lineProductsCount}
          </span>
        )}
      </div>
    </Link>
  )
}

export default CartDropdown
