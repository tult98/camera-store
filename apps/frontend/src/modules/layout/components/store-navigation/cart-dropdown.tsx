"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCartIcon } from "@heroicons/react/24/outline"

const CartDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  // This would be replaced with actual cart state management
  const cartItems = 3 // Replace with actual cart count
  const cartTotal = 999.00 // Replace with actual cart total

  return (
    <div className="dropdown dropdown-end ml-2">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="indicator">
          <ShoppingCartIcon className="w-5 h-5" />
          {cartItems > 0 && (
            <span className="badge badge-sm badge-primary indicator-item">{cartItems}</span>
          )}
        </div>
      </div>
      {isOpen && (
        <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
          <div className="card-body">
            {cartItems > 0 ? (
              <>
                <span className="font-bold text-lg">{cartItems} Items</span>
                <span className="text-info">Subtotal: ${cartTotal.toFixed(2)}</span>
                <div className="card-actions">
                  <Link 
                    href="/cart" 
                    className="btn btn-primary btn-block"
                    onClick={() => setIsOpen(false)}
                  >
                    View cart
                  </Link>
                </div>
              </>
            ) : (
              <>
                <span className="text-base-content">Your cart is empty</span>
                <div className="card-actions">
                  <Link 
                    href="/" 
                    className="btn btn-primary btn-block"
                    onClick={() => setIsOpen(false)}
                  >
                    Continue shopping
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartDropdown