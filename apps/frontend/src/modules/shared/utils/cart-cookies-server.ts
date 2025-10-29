/**
 * Server-side cart cookie management utilities
 *
 * Use in: Server Components, Server Actions, and API routes
 * Examples: app/(main)/cart/page.tsx, lib/data/cart.ts
 */

import "server-only"
import { cookies as nextCookies } from "next/headers"

// Shared constants
const CART_COOKIE_NAME = "_medusa_cart_id"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

/**
 * Get cart ID from server-side cookies
 */
export async function getCartIdServer(): Promise<string | undefined> {
  const cookies = await nextCookies()
  return cookies.get(CART_COOKIE_NAME)?.value
}

/**
 * Set cart ID in server-side cookies
 */
export async function setCartIdServer(cartId: string): Promise<void> {
  const cookies = await nextCookies()
  cookies.set(CART_COOKIE_NAME, cartId, {
    maxAge: COOKIE_MAX_AGE,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })
}

/**
 * Remove cart ID from server-side cookies
 */
export async function removeCartIdServer(): Promise<void> {
  const cookies = await nextCookies()
  cookies.delete(CART_COOKIE_NAME)
}
