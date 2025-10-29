"use client"

import { create } from "zustand"
import {
  getCartId,
  setCartId as setCookieCartId,
  removeCartId,
} from "../utils/cart-cookies"

interface CartStore {
  cartId: string | null
  buyNowCartId: string | null
  setCartId: (id: string | null) => void
  setBuyNowCartId: (id: string | null) => void
  getActiveCartId: () => string | null
  setActiveCartId: ({
    cartId,
    targetCartId,
  }: {
    cartId: string | null
    targetCartId: string | null
  }) => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartId: getCartId(),
  buyNowCartId: null,

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

  setActiveCartId: ({
    cartId,
    targetCartId,
  }: {
    cartId: string | null
    targetCartId: string | null
  }) => {
    // Update state
    const state = get()

    let isUpdateBuyNowCartId = false
    if (targetCartId) {
      isUpdateBuyNowCartId = targetCartId === state.buyNowCartId
    }

    if (isUpdateBuyNowCartId) {
      set({ buyNowCartId: cartId })
    } else {
      set({ cartId })
      // Sync to existing cookie system
      if (typeof window !== "undefined") {
        if (cartId) {
          setCookieCartId(cartId)
        } else {
          removeCartId()
        }
      }
    }
  },

  setBuyNowCartId: (buyNowCartId) => {
    // Update state only, no cookie sync
    set({ buyNowCartId })
  },

  getActiveCartId: () => {
    const state = get()
    return state.buyNowCartId || state.cartId
  },
}))
