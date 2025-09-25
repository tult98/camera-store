"use client"

import { useCartStore } from "../store/cart-store"

/**
 * Hook to reactively access the cart ID from global state
 * Replaces direct getCartId() calls for reactive updates
 */
export const useCartId = () => {
  return useCartStore((state) => state.cartId)
}