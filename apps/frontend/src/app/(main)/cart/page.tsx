import { retrieveCart } from "@lib/data/cart"
import CartPage from "@modules/cart/components/cart-page"
import { Metadata } from "next"

// Force dynamic rendering due to cookies usage
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart() {
  // Fetch only cart data server-side for faster initial load
  // Customer data is not critical and can be fetched client-side
  const cart = await retrieveCart().catch(() => null)

  return <CartPage initialCart={cart} />
}
