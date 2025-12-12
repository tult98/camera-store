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

/**
 * Get cart ID from server-side cookies
 */
export async function getCartIdServer(): Promise<string | undefined> {
  const cookies = await nextCookies()
  return cookies.get(CART_COOKIE_NAME)?.value
}
