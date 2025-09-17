"use client"

import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

const CartDropdown = ({ cart }: { cart?: HttpTypes.StoreCart | null }) => {
  // Calculate total items count from cart
  const lineProductsCount = cart?.items?.length || 0

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
