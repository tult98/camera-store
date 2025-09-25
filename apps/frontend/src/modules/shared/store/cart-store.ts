"use client"

import { create } from "zustand"
import { getCartId, setCartId as setCookieCartId, removeCartId } from "../utils/cart-cookies"

interface CartStore {
  cartId: string | null
  setCartId: (id: string | null) => void
  initFromCookies: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  cartId: null,
  
  setCartId: (cartId) => {
    // Update state
    set({ cartId })
    
    // Sync to existing cookie system
    if (typeof window !== "undefined") {
      if (cartId) {
        setCookieCartId(cartId)
      } else {
        removeCartId()
      }
    }
  },
  
  initFromCookies: () => {
    if (typeof window !== "undefined") {
      const cookieCartId = getCartId()
      set({ cartId: cookieCartId })
    }
  }
}))