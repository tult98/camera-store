/**
 * Client-side cookie utilities for cart management
 */

import { deleteCookie, getCookie, setCookie } from "cookies-next"

const CART_COOKIE_NAME = "_medusa_cart_id"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

/**
 * Get cart ID from browser cookies
 */
export function getCartId(): string | null {
  if (typeof window === "undefined") return null

  const cartId = getCookie(CART_COOKIE_NAME)
  return cartId ? String(cartId) : null
}

/**
 * Set cart ID in browser cookies
 */
export function setCartId(cartId: string): void {
  if (typeof window === "undefined") return

  setCookie(CART_COOKIE_NAME, cartId, {
    maxAge: COOKIE_MAX_AGE,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

/**
 * Remove cart ID from browser cookies
 */
export function removeCartId(): void {
  if (typeof window === "undefined") return

  deleteCookie(CART_COOKIE_NAME, {
    path: "/",
  })
}
